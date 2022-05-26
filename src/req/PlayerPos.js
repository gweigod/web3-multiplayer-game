import Moralis from "moralis/dist/moralis.min.js";
import Player from "../req/Player.js";
import MainScene from "../scenes/MainScene.js";
import { facing } from "../req/Player.js";
import { player } from "../req/Player.js";
import { pos } from "../index.js";
import { user } from "../index.js";

export default class PlayerPos extends Phaser.Scene {
  constructor() {
    super();
    Phaser.Scene.call(this, { key: "playerpos" });
  }

  async create() {}

  async update() {
    if (!player) {
      return;
    }

    if (player.lastX != player.x || (player.lastY != player.y && user)) {
      const PlayerPosition = Moralis.Object.extend("PlayerPosition");
      const getServer = new PlayerPosition();
      getServer.set("player", user.get("ethAddress"));
      if (facing != undefined) {
        getServer.set("facing", facing);
      }
      getServer.set("x", player.x);
      getServer.set("y", player.y);
      player.lastX = player.x;
      player.lastY = player.y;

      await getServer.save().then(
        (pos) => {
          //console.log("New object created with objectId: " + pos.id);
        },
        (error) => {
          // console.log("Failed to create new object, with error code: " + error.message);
        }
      );
    }
  }
}
