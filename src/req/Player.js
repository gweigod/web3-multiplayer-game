import { game } from "../index.js";
export var player;
export var facing;

export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    var playerCollider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: "playerCollider",
    });
    var playerSensor = Bodies.circle(this.x, this.y, 24, {
      isSensor: true,
      label: "playerSensor",
    });
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
    // Phaser.Types.Physics.Matter.MatterConstraintRenderConfig;
  }

  static preload(scene) {
    scene.load.atlas(
      "king",
      "src/assets/img/atlas/char/king.png",
      "src/assets/img/atlas/char/json/king_atlas.json"
    );
    scene.load.animation(
      "king_anim",
      "src/assets/img/atlas/char/json/king_anim.json"
    );
  }

  get velocity() {
    return this.body.velocity;
  }

  update(time, delta) {
    var speed = 2;
    var isRunning = false;
    let playerVelocity = new Phaser.Math.Vector2();

    if (this.scene.inputKeys.left.isDown) {
      playerVelocity.x = -1;
      this.setFlipX(true);
      if (
        facing != "left" &&
        !this.scene.inputKeys.up.isDown &&
        !this.scene.inputKeys.down.isDown
      ) {
        facing = "left";
      }
    } else if (this.scene.inputKeys.right.isDown) {
      playerVelocity.x = 1;
      this.setFlipX(false);
      if (
        facing != "right" &&
        !this.scene.inputKeys.up.isDown &&
        !this.scene.inputKeys.down.isDown
      ) {
        facing = "right";
      }
    }
    if (this.scene.inputKeys.up.isDown) {
      playerVelocity.y = -1;
      this.setFrame("king_walk_3");
      if (
        facing != "up" &&
        !this.scene.inputKeys.left.isDown &&
        !this.scene.inputKeys.right.isDown
      ) {
        facing = "up";
      }
    } else if (this.scene.inputKeys.down.isDown) {
      playerVelocity.y = 1;
      this.setFrame("king_walk_2");
      if (
        facing != "down" &&
        !this.scene.inputKeys.left.isDown &&
        !this.scene.inputKeys.right.isDown
      ) {
        facing = "down";
      }
    }

    //initialze stats scene
    if (this.scene.inputKeys.BACKTICK.isDown && !game.scene.isActive("stats")) {
      game.scene.start("stats");
    }

    //running
    if (this.scene.inputKeys.SPACE.isDown && isRunning == false) {
      speed = 3;
      isRunning = true;
    } else if (!this.scene.inputKeys.SPACE.isDown && isRunning == true) {
      speed = 2;
      isRunning = false;
    }

    if (!game.scene.isActive("playerpos")) {
      game.scene.start("playerpos");
    }

    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);

    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play("idle", true);
    } else {
      this.anims.play("idle", false);
    }
    player = this;
  }
}
