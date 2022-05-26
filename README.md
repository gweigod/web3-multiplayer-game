# Web3 Multiplayer Game

This is a game which utilizes Moralis databases and Phaser3 for framework.
This repo is not a complete game and is only intended as being a template or foundation for one.

<img width="700" alt="example" src="https://user-images.githubusercontent.com/91121601/170409045-939e04b9-6b99-4e32-80b4-9f2f6742e129.png">

ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)

| Command         | Description                                       |
| --------------- | ------------------------------------------------- |
| `npm install`   | Install project dependencies                      |
| `npm start`     | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings       |

# IMPORTANT

After installing the npm packages you need to register a free account with https://moralis.io/
Once complete you must create a database and update the "SERVER ID" and "APP ID" connections in src/index.js
Now you must go into your Moralis Dashboard, under browsers add a new class named "PlayerPosition", for the type put "Custom"
Under the new class will need to have 8 columns with the name and datatype accordingly (in order):

1. "objectId" String
2. "createdAt" Date
3. "updatedAt" Date
4. "ACL" ACL
5. "player" String
6. "x" Number
7. "y" Number
8. "facing" String
