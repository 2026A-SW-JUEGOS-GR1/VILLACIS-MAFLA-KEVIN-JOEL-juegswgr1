export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    create(data) {
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 2 - 100, '¡Escapaste del Huerto!', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2, `Manzanas recolectadas: ${data.score}`, {
            fontSize: '24px',
            fill: '#dddddd'
        }).setOrigin(0.5);

        // Zona interactiva - Jugar de nuevo
        const playAgainZone = this.add.zone(width / 2, height / 2 + 100, 280, 60).setOrigin(0.5);
        playAgainZone.setInteractive();

        const playAgainButton = this.add.text(width / 2, height / 2 + 100, 'Jugar de nuevo', {
            fontSize: '24px',
            fill: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        playAgainZone.on('pointerup', () => {
            this.playAgain();
        });
        playAgainZone.on('pointerover', () => playAgainButton.setFill('#ffff00'));
        playAgainZone.on('pointerout', () => playAgainButton.setFill('#00ff00'));

        // Zona interactiva - Menú principal
        const menuZone = this.add.zone(width / 2, height / 2 + 160, 280, 60).setOrigin(0.5);
        menuZone.setInteractive();

        const menuButton = this.add.text(width / 2, height / 2 + 160, 'Menú principal', {
            fontSize: '24px',
            fill: '#00aaff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        menuZone.on('pointerup', () => {
            this.goToMenu();
        });
        menuZone.on('pointerover', () => menuButton.setFill('#ffff00'));
        menuZone.on('pointerout', () => menuButton.setFill('#00aaff'));

        // Soporte para teclado
        this.input.keyboard.on('keydown-ENTER', () => {
            this.playAgain();
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.playAgain();
        });

        this.input.keyboard.on('keydown-M', () => {
            this.goToMenu();
        });
    }

    playAgain() {
        this.scene.stop();
        this.scene.start('GameScene');
    }

    goToMenu() {
        this.scene.stop();
        this.scene.start('MenuScene');
    }
}
