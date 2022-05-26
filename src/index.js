import Moralis from "moralis/dist/moralis.min.js";
import Phaser from "phaser";
import NhbIntroPlugin from "./utility/NhbIntroPlugin.js";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
//import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import MainScene from "./scenes/MainScene.js";
import Intro from "./ui/Intro.js";
import Stats from "./ui/Stats.js";
import PlayerPos from "./req/PlayerPos.js";
import { settings } from "./config.js";
export let game;
export let address;
export let user;
import { checkWeb3 } from "./web3/web3.js";

Moralis.initialize("APP ID HERE"); // APP ID HERE
Moralis.serverURL = "SERVER ID HERE"; // SERVER URL HERE
user = Moralis.User.current();

//configuration

let release = " (Alpha)";

const config = {
  width: settings.defaultScreen.width,
  height: settings.defaultScreen.height,
  backgroundColor: "#cbfbff",
  transparent: false,
  type: Phaser.AUTO,
  title: "Web3 Game",
  version: "0.1" + release,
  parent: "web3-multiplayer-game",
  scene: [MainScene, Stats, PlayerPos],
  scale: {
    zoom: 1,
  },
  pixelArt: true,
  physics: {
    default: "matter",
    fps: 10,
    matter: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  plugins: {
    scene: [
      {
        key: "matterCollision",
        plugin: PhaserMatterCollisionPlugin,
        mapping: "matterCollision",
      },
    ],
    scene: [
      {
        key: "NHBIntroPlugin",
        plugin: NhbIntroPlugin,
        mapping: "introManager",
      },
    ],
    /*    scene: [
      {
        key: "rexUI",
        plugin: UIPlugin,
        mapping: "rexUI",
      },
    ],
*/
  },
};

function launch() {
  let user = Moralis.User.current();
  if (!user) {
    console.log("You need to Login");
  } else {
    console.log(user.get("ethAddress") + " has logged in.");
    address = user.get("ethAddress");
    document.getElementById("btn-login").style.display = "none";
    document.getElementById("btn-logout").style.display = "block";
    if (settings.playIntro == true) {
      config.scene.unshift(Intro);
    }
    game = new Phaser.Game(config);
  }
}

checkWeb3();
launch();

//sign in
async function login() {
  user = Moralis.User.current();
  if (!user) {
    user = await Moralis.Web3.authenticate({
      signingMessage: "Sign in to Web3 Game",
    });
    launch();
  }
  console.log("Logged in user: ", user);
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("Logged out");
  location.reload();
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;
