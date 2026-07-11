export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.setCollideWorldBounds(true);
        this.body.setSize(this.width * 0.8, this.height * 0.8); // Ajustar el hitbox

        this.speed = 160;
        this.lives = 3;
        this.isInvulnerable = false;

        // Crear las animaciones del jugador
        this.createAnimations();
    }

    createAnimations() {
        // Animación idle (usando el primer frame de la caminata hacia abajo)
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('fox_idle', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        });

        // Animación de caminar hacia abajo
        this.anims.create({
            key: 'walk_down',
            frames: this.anims.generateFrameNumbers('fox_down', { start: 0, end: 3 }), // Asumiendo 4 frames
            frameRate: 10,
            repeat: -1
        });

        // Animación de caminar hacia arriba
        this.anims.create({
            key: 'walk_up',
            frames: this.anims.generateFrameNumbers('fox_up', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Animación de caminar hacia la izquierda
        this.anims.create({
            key: 'walk_left',
            frames: this.anims.generateFrameNumbers('fox_left', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Animación de caminar hacia la derecha
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('fox_right', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update(cursors) {
        if (this.isInvulnerable) return; // No se mueve mientras es invulnerable

        let vx = 0;
        let vy = 0;

        // Detectar input del teclado (flechas y WASD)
        if (cursors.left.isDown || this.scene.input.keyboard.addKey('A').isDown) {
            vx = -1;
        } else if (cursors.right.isDown || this.scene.input.keyboard.addKey('D').isDown) {
            vx = 1;
        }

        if (cursors.up.isDown || this.scene.input.keyboard.addKey('W').isDown) {
            vy = -1;
        } else if (cursors.down.isDown || this.scene.input.keyboard.addKey('S').isDown) {
            vy = 1;
        }

        // Normalizar velocidad diagonal
        if (vx !== 0 && vy !== 0) {
            const factor = Math.SQRT1_2; // Aproximadamente 0.707
            vx *= factor;
            vy *= factor;
        }

        // Aplicar velocidad al cuerpo físico
        this.body.setVelocity(vx * this.speed, vy * this.speed);

        // Actualizar animación según la velocidad
        if (vx === 0 && vy === 0) {
            this.anims.play('idle', true);
        } else if (vy > 0) {
            this.anims.play('walk_down', true);
        } else if (vy < 0) {
            this.anims.play('walk_up', true);
        } else if (vx < 0) {
            this.anims.play('walk_left', true);
        } else if (vx > 0) {
            this.anims.play('walk_right', true);
        }
    }

    takeDamage() {
        if (this.isInvulnerable) return false; // No recibir daño si ya es invulnerable

        this.lives--;
        this.isInvulnerable = true;

        // Efecto de parpadeo (invulnerabilidad visual)
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.setAlpha(1);
                this.isInvulnerable = false;
            }
        });

        // Emitir evento para que GameScene actualice el HUD
        this.scene.events.emit('updateLives', this.lives);

        return this.lives > 0; // Retorna true si aún hay vidas
    }
}
