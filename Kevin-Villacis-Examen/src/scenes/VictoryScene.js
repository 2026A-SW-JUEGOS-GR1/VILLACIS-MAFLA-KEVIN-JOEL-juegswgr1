export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
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

        this.add.text(width / 2, height / 2 - 100, '¡Escapaste del Huerto!', {
            fontSize: '32px',
            fill: '#ffffff',
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

        // Zona interactiva - Jugar de nuevo
        const playAgainZone = this.add.zone(width / 2, height / 2 + 120, 280, 60).setOrigin(0.5);
        playAgainZone.setInteractive();

        const playAgainButton = this.add.text(width / 2, height / 2 + 120, 'Jugar de nuevo', {
            fontSize: '24px',
            fill: '#00ff00',
            backgroundColor: '#00000055',
            padding: { x: 20, y: 10 },
            stroke: '#ffffff',
            strokeThickness: 1
        }).setOrigin(0.5);

        playAgainZone.on('pointerup', () => {
            this.playAgain();
        });
        playAgainZone.on('pointerover', () => playAgainButton.setFill('#ffff00'));
        playAgainZone.on('pointerout', () => playAgainButton.setFill('#00ff00'));

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
