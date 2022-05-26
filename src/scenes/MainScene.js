import { game } from "../index.js";
import { address } from "../index.js";
import Player from "../req/Player.js";
import Moralis from "moralis/dist/moralis.min.js";
import { pos } from "../index.js";
import { user } from "../index.js";
import { settings } from "../config.js";
var otherPlayers = {};

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }
  //loading assets
  preload() {
    Player.preload(this);
    this.load.image("tiles", "src/assets/img/atlas/map/Terrain.png");
    this.load.tilemapTiledJSON("map", "src/assets/img/atlas/map/json/map.json");
  }

  // init setup
  async create() {
    let centerx = game.config.width / 2;
    let centery = game.config.height / 2;

    this.input.setDefaultCursor("url(src/assets/img/cursor.png), pointer");
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("Terrain", "tiles", 32, 32, 1, 2);
    const layer1 = map.createLayer("Tile Layer 1", tileset, centerx / 2, 0);
    const layer2 = map.createLayer("Tile Layer 2", tileset, centerx / 2, 0);
    layer1.setCollisionByProperty({ collides: true });
    layer2.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);
    this.matter.world.convertTilemapLayer(layer2);

    this.player = new Player({
      scene: this,
      x: centerx,
      y: centery,
      texture: "king",
      frame: "king_idle_1",
    });

    //console.log("Starting point: " + this.player.x + " " + this.player.y);

    // NPC
    /*
    let testPlayer = new Player({
      scene: this,
      x: 300,
      y: 300,
      texture: "king",
      frame: "king_idle_1",
    });
    */

    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,

      BACKTICK: Phaser.Input.Keyboard.KeyCodes.BACKTICK,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    let camera = this.cameras.main;
    camera.zoom = 3;
    camera.startFollow(this.player);
    camera.setLerp(0.1, 0.1);
    camera.setBounds(0, 0, this.game.config.width, this.game.config.height);

    let query = new Moralis.Query("PlayerPosition");
    let subscription = await query.subscribe();
    subscription.on("create", (server) => {
      if (server.get("player") != user.get("ethAddress")) {
        //if first time seeing otherPlayers
        if (otherPlayers[server.get("player")] == undefined) {
          //create otherPlayer
          otherPlayers[server.get("player")] = new Player({
            scene: this,
            x: server.get("x"),
            y: server.get("y"),
            texture: "king",
            frame: "king_idle_1",
          });
        } else {
          otherPlayers[server.get("player")].x = server.get("x");
          otherPlayers[server.get("player")].y = server.get("y");
          otherPlayers[server.get("player").facing] = server.get("facing");
          if (server.get("facing")) {
            if (server.get("facing") == "left") {
              otherPlayers[server.get("player")].setFlipX(true);
              otherPlayers[server.get("player")].setFrame("king_idle_1"); //temporary
            }
            if (server.get("facing") == "right") {
              otherPlayers[server.get("player")].setFlipX(false);
              otherPlayers[server.get("player")].setFrame("king_idle_1"); //temporary
            }
            if (server.get("facing") == "up") {
              otherPlayers[server.get("player")].setFrame("king_walk_3");
            }
            if (server.get("facing") == "down") {
              otherPlayers[server.get("player")].setFrame("king_walk_3");
            }
          }
        }
        if (settings.logAllPlayerPositions == true) {
          console.log(
            server.get("player").substring(0, 5) +
              "..." +
              server.get("player").substring(38, 42) +
              " has moved"
          );
          console.log("new X ", server.get("x"));
          console.log("new Y ", server.get("y"));
        }
      }
    });
  }

  //update called 60 tps - 60 fps
  update() {
    this.player.update();
  }
}
