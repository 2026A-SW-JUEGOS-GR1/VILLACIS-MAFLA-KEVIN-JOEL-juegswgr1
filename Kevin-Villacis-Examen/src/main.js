import MenuScene    from './scenes/MenuScene.js';
import GameScene    from './scenes/GameScene.js';
import UIScene      from './scenes/UIScene.js';
import VictoryScene from './scenes/VictoryScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#2d4a1e',

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },

  scene: [
    MenuScene,
    GameScene,
    UIScene,
    VictoryScene,
    GameOverScene
  ]
};

const game = new Phaser.Game(config);
window.gameInstance = game; // Exponer para testing/debugging

export default game;
