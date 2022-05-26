import { game } from "../index.js";
import { address } from "../index.js";
import { player } from "../req/Player.js";

var isStatsActive = false;
var fpsTxt;
var posTxt;
let t = 5;

export default class Stats extends Phaser.Scene {
  constructor() {
    super();
    Phaser.Scene.call(this, { key: "stats" });
    this.text_to_print = null;
  }
  async create() {
    if (isStatsActive == false) {
      const gameTxt = this.add.text(20, 40, "", {
        fontFamily: "TerminusTTF",
        fontSize: "18px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: t,
      });

      gameTxt.setText([
        "Version " + game.config.gameVersion,
        "User: " + address.substring(0, 5) + "..." + address.substring(38, 42),
        "© " + game.config.gameTitle + " 2022",
      ]);

      fpsTxt = this.add.text(20, 110, "", {
        fontFamily: "TerminusTTF",
        fontSize: "18px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: t,
      });

      posTxt = this.add.text(20, 130, "", {
        fontFamily: "TerminusTTF",
        fontSize: "18px",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: t,
      });

      isStatsActive = true;
      console.log("Stats is active");
    } else if (isStatsActive == true) {
      console.log("Stats is not active");
      isStatsActive = false;
    }
  }

  goBack() {
    this.scene.start("MainScene");
  }

  update() {
    var num = game.loop.actualFps;
    fpsTxt.setText((Math.round(num * 10) / 10).toString() + " fps");
    posTxt.setText([
      "x: " +
        player.x.toString().substring(0, 5) +
        "  " +
        "y: " +
        player.y.toString().substring(0, 5),
    ]);
  }
}
