import { game } from "../index.js";

export default class Intro extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);

    this.defaultConfig = {
      skipKeys: ["ENTER", "SPACE"],
    };

    this.intro = null;
    this.keyObjects = [];
  }

  playIntro(videoId, config = {}) {
    //overwrite config
    if (!config) {
      config = this.defaultConfig;
    }

    return new Promise((resolve) => {
      this.intro = this.scene.add.video(0, 0, videoId);

      this.intro.setDisplaySize(game.config.width, game.config.height);

      //center video in canvas
      this.intro.setOrigin(0, 0);
      /*
      this.intro.setPosition(
        this.game.canvas.width / 2 - this.intro.width / 2,
        this.game.canvas.height / 2 - this.intro.height / 2
      );
      */
      //start video once the audio context was triggered
      this.scene.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        this.intro.play(false);
        this.intro.setPaused(false);
      });

      //check when to skip the video
      this.defaultConfig.skipKeys.forEach((key, i) => {
        this.keyObjects[i] = this.scene.input.keyboard.addKey(key);
        this.keyObjects[i].once("down", () => {
          //skip video
          this.intro.setPaused(true);
          this.reset();
          resolve();
        });
      });

      this.intro.once("complete", () => {
        resolve();
      });
    });
  }

  //stop video and remove all listeners

  reset() {
    this.intro.setPaused(true);
    this.intro.off("complete");
    this.intro = null;

    this.keyObjects.forEach((keyObject) => {
      keyObject.off("down");
    });
    this.keyObjects = [];
  }
}
