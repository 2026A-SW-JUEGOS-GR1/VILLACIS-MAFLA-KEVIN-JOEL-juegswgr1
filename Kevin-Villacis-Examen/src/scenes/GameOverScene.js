export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    preload() {
        // Cargar fondo de cierre
        this.load.image('fondo_cierre', 'Tilesets/ventana inicio y fin/fondo cierre.png');
    }

    create(data) {
        const { width, height } = this.scale;

        // Agregar fondo de cierre
        this.add.image(width / 2, height / 2, 'fondo_cierre')
            .setOrigin(0.5)
            .setDisplaySize(width, height);

        this.add.text(width / 2, height / 2 - 100, '¡El Granjero te atrapó!', {
            fontSize: '32px',
            fill: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 20, `Manzanas recolectadas: ${data.score}`, {
            fontSize: '26px',
            fill: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 20, `Tiempo restante: ${data.time}s`, {
            fontSize: '26px',
            fill: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Zona interactiva - Intentar de nuevo
        const tryAgainZone = this.add.zone(width / 2, height / 2 + 120, 300, 60).setOrigin(0.5);
        tryAgainZone.setInteractive();

        const tryAgainButton = this.add.text(width / 2, height / 2 + 120, 'Intentar de nuevo', {
            fontSize: '24px',
            fill: '#00ff00',
            backgroundColor: '#00000055',
            padding: { x: 20, y: 10 },
            stroke: '#ffffff',
            strokeThickness: 1
        }).setOrigin(0.5);

        tryAgainZone.on('pointerup', () => {
            this.tryAgain();
        });
        tryAgainZone.on('pointerover', () => tryAgainButton.setFill('#ffff00'));
        tryAgainZone.on('pointerout', () => tryAgainButton.setFill('#00ff00'));

        // Zona interactiva - Menú principal
        const menuZone = this.add.zone(width / 2, height / 2 + 190, 280, 60).setOrigin(0.5);
        menuZone.setInteractive();

        const menuButton = this.add.text(width / 2, height / 2 + 190, 'Menú principal', {
            fontSize: '24px',
            fill: '#00aaff',
            backgroundColor: '#00000055',
            padding: { x: 20, y: 10 },
            stroke: '#ffffff',
            strokeThickness: 1
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
