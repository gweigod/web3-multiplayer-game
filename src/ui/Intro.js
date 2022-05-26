export default class Intro extends Phaser.Scene {
  preload() {
    this.load.video(
      "nhb_intro",
      "src/assets/videos/intro.mp4",
      "loadeddata",
      false,
      false
    );
  }

  async create() {
    // Use default settings (Skip via ENTER or SPACE)
    await this.introManager.playIntro("nhb_intro", {
      skipKeys: ["ENTER", "SPACE"],
    });

    // Start any scene after intro video finished
    this.scene.start("MainScene");
  }
}
