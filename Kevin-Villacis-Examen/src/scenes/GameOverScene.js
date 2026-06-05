export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        const { width, height } = this.scale;

        this.add.text(width / 2, height / 2 - 100, '¡El Gigante te atrapó!', {
            fontSize: '32px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2, `Manzanas recolectadas: ${data.score}`, {
            fontSize: '24px',
            fill: '#dddddd'
        }).setOrigin(0.5);

        // Zona interactiva - Intentar de nuevo
        const tryAgainZone = this.add.zone(width / 2, height / 2 + 100, 300, 60).setOrigin(0.5);
        tryAgainZone.setInteractive();

        const tryAgainButton = this.add.text(width / 2, height / 2 + 100, 'Intentar de nuevo', {
            fontSize: '24px',
            fill: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        tryAgainZone.on('pointerup', () => {
            this.tryAgain();
        });
        tryAgainZone.on('pointerover', () => tryAgainButton.setFill('#ffff00'));
        tryAgainZone.on('pointerout', () => tryAgainButton.setFill('#00ff00'));

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
            this.tryAgain();
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.tryAgain();
        });

        this.input.keyboard.on('keydown-M', () => {
            this.goToMenu();
        });
    }

    tryAgain() {
        this.scene.stop();
        this.scene.start('GameScene');
    }

    goToMenu() {
        this.scene.stop();
        this.scene.start('MenuScene');
    }
}
