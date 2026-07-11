export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        const { width, height } = this.scale;

        // ===== HUD HORIZONTAL EN LA PARTE SUPERIOR =====
        const hudY = 15;
        const spacing = 200;

        // Manzanas (izquierda)
        this.scoreText = this.add.text(20, hudY, 'MANZANAS: 0', {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold'
        });

        // Vidas (centro)
        this.livesText = this.add.text(20 + spacing, hudY, 'VIDAS: ❤️❤️❤️', {
            fontSize: '20px',
            fill: '#ff6b6b',
            fontStyle: 'bold'
        });

        // Tiempo (derecha)
        this.timerText = this.add.text(20 + spacing * 2, hudY, 'TIEMPO: 90', {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold'
        });

        // Obtener la escena del juego para escuchar sus eventos
        const gameScene = this.scene.get('GameScene');

        // Escuchar eventos y actualizar el HUD
        gameScene.events.on('updateScore', (score) => {
            this.scoreText.setText('MANZANAS: ' + score);
        });

        gameScene.events.on('updateLives', (lives) => {
            const hearts = '❤️'.repeat(Math.max(0, lives));
            this.livesText.setText('VIDAS: ' + hearts);
        });

        gameScene.events.on('updateTimer', (time) => {
            this.timerText.setText('TIEMPO: ' + time);

            // Cambiar color según el tiempo restante
            if (time <= 10) {
                this.timerText.setFill('#ff0000'); // Rojo
            } else if (time <= 30) {
                this.timerText.setFill('#ffd700'); // Amarillo/oro
            } else {
                this.timerText.setFill('#ffffff'); // Blanco
            }
        });
    }
}
