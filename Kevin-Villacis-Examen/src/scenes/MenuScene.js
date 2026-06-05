export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Cargar assets para el menú si es necesario
    }

    create() {
        const { width, height } = this.scale;

        // Título
        this.add.text(width / 2, height / 2 - 150, 'El Huerto de Manzanas Prohibidas', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Narrativa
        this.add.text(width / 2, height / 2 - 80, 'Eres un astuto zorro en una misión secreta:\nrecolectar las más jugosas manzanas antes de que el granjero te atrape.', {
            fontSize: '18px',
            fill: '#dddddd',
            align: 'center'
        }).setOrigin(0.5);

        // Reglas
        this.add.text(width / 2, height / 2, '🍎 Recolecta todas las manzanas que puedas.\n🕳️ Llega a la madriguera para escapar.\n❤️ No dejes que tus vidas lleguen a cero.', {
            fontSize: '16px',
            fill: '#cccccc',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        // Crear zona interactiva para el botón
        const buttonZone = this.add.zone(width / 2, height / 2 + 100, 280, 60).setOrigin(0.5);
        buttonZone.setInteractive();
        
        // Texto del botón
        this.startButtonText = this.add.text(width / 2, height / 2 + 100, '¡Entrar al Huerto!', {
            fontSize: '24px',
            fill: '#00ff00',
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        // Interacción del zona interactiva
        buttonZone.on('pointerover', () => {
            this.startButtonText.setFill('#ffff00');
        });

        buttonZone.on('pointerout', () => {
            this.startButtonText.setFill('#00ff00');
        });

        buttonZone.on('pointerup', () => {
            this.startGame();
        });

        // Agregar soporte para teclado
        this.input.keyboard.on('keydown-ENTER', () => {
            this.startGame();
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.startGame();
        });
    }

    startGame() {
        this.scene.stop();
        this.scene.start('GameScene');
    }
}
