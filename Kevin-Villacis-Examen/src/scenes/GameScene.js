import Player from '../objects/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        // Cargar assets del juego
        this.load.image('pasto', 'Tilesets/Suelo de Pasto (Transitable).png');
        this.load.image('arbusto', 'Tilesets/Arbustos Espinosos (Sólido).png');
        this.load.image('manzano', 'Tilesets/Muros de Manzanos (Sólido).png');
        this.load.image('manzana', 'Tilesets/manzana.png');
        this.load.image('hoyo', 'Tilesets/hoyo.png');

        // Cargar todas las imágenes de animación del zorro (2 frames por dirección)
        // Frente (arriba)
        this.load.image('fox_frente_1', 'Tilesets/fox/Fox caminar frente 1.png');
        this.load.image('fox_frente_2', 'Tilesets/fox/Fox caminar frente 2.png');
        
        // Espalda (abajo)
        this.load.image('fox_espalda_1', 'Tilesets/fox/Fox caminar espaldas 1.png');
        this.load.image('fox_espalda_2', 'Tilesets/fox/Fox caminar espaldas 2.png');
        
        // Izquierda
        this.load.image('fox_izq_1', 'Tilesets/fox/Fox caminar izquierda 1.png');
        this.load.image('fox_izq_2', 'Tilesets/fox/Fox caminar izquierda 2.png');
        
        // Derecha
        this.load.image('fox_der_1', 'Tilesets/fox/Fox caminar derecha 1.png');
        this.load.image('fox_der_2', 'Tilesets/fox/Fox caminar derecha 2.png');
        
        // Cargar música de juego
        this.load.audio('play_song', 'Tilesets/songs/playsong.mp3');
    }

    create() {
        // Inicializar variables del juego
        this.score = 0;
        this.isGameOver = false;

        // Crear el mapa desde array (laberinto)
        const mapData = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];

        const tileSize = 32;
        this.manzanos = this.physics.add.staticGroup(); // Muros estáticos (solo colisión)
        this.arbustos = this.physics.add.group(); // Arbustos dinámicos (causan daño)

        // Renderizar mapa y paredes
        for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
                const tileType = mapData[y][x];
                const posX = x * tileSize + tileSize / 2;
                const posY = y * tileSize + tileSize / 2;

                // Piso de pasto
                this.add.image(posX, posY, 'pasto').setOrigin(0.5).setDisplaySize(tileSize, tileSize);

                // Muros/arbustos - alternar entre arbusto y manzano en patrón checkerboard
                if (tileType === 1) {
                    if ((x + y) % 2 === 0) {
                        // Arbustos espinosos (dinámicos, causan daño)
                        const arbusto = this.arbustos.create(posX, posY, 'arbusto');
                        arbusto.setOrigin(0.5).setDisplaySize(tileSize, tileSize);
                        arbusto.body.setImmovable(true);
                    } else {
                        // Muros de manzanos (estáticos, solo colisión)
                        this.manzanos.create(posX, posY, 'manzano').setOrigin(0.5).setDisplaySize(tileSize, tileSize).refreshBody();
                    }
                }
            }
        }

        // 2. Crear al jugador con sprite animado
        this.player = this.add.sprite(176, 80, 'fox_frente_1');
        this.player.setDisplaySize(48, 48);
        this.player.setOrigin(0.5);
        
        // Agregar física al jugador
        this.physics.add.existing(this.player);
        this.player.body.setSize(24, 24);
        this.player.body.setCollideWorldBounds(true);
        this.player.setDepth(10);
        
        // Agregar propiedades del jugador
        this.player.speed = 160;
        this.player.lives = 3;
        this.player.isInvulnerable = false;
        this.player.lastDirection = 'down'; // Dirección inicial
        this.player.lastDamageTime = 0; // Cooldown de daño
        
        // Crear animaciones para cada dirección
        this.createPlayerAnimations();

        // 3. Crear grupo de manzanas y distribuirlas en el mapa
        this.apples = this.physics.add.group();
        this.createApples();

        // 4. Crear la madriguera (zona de meta)
        this.burrow = this.add.image(24 * tileSize + tileSize / 2, 19 * tileSize + tileSize / 2, 'hoyo');
        this.burrow.setOrigin(0.5).setDisplaySize(tileSize, tileSize);
        this.physics.add.existing(this.burrow, true); // Static para no afectar física

        // 5. Configurar colisiones con muros de manzanos
        this.physics.add.collider(this.player, this.manzanos);

        // 6. Configurar overlaps
        this.physics.add.overlap(this.player, this.apples, this.collectApple, null, this);
        this.physics.add.overlap(this.player, this.burrow, this.reachBurrow, null, this);
        
        // Configurar daño por arbustos espinosos
        this.physics.add.overlap(this.player, this.arbustos, this.touchSpinyBush, null, this);

        // 7. Configurar controles
        this.cursors = this.input.keyboard.createCursorKeys();

        // 8. Lanzar la UIScene en paralelo
        this.scene.launch('UIScene');
        this.events.emit('updateScore', this.score);
        this.events.emit('updateLives', this.player.lives);

        // 8.5 Reproducir música de juego
        const introSong = this.sound.get('intro_song');
        if (introSong && introSong.isPlaying) {
            introSong.stop();
        }
        
        const playSong = this.sound.get('play_song');
        if (!playSong || !playSong.isPlaying) {
            this.sound.play('play_song', { loop: true, volume: 0.7 });
        }

        // 9. Temporizador
        this.timer = 90; // 90 segundos
        this.events.emit('updateTimer', this.timer);
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timer--;
                this.events.emit('updateTimer', this.timer);
                if (this.timer <= 0) {
                    this.endGame(false); // false = derrota por tiempo
                }
            },
            loop: true
        });
    }

    createPlayerAnimations() {
        // Animación para moverse hacia arriba (espalda)
        this.anims.create({
            key: 'walk_up',
            frames: [
                { key: 'fox_espalda_1' },
                { key: 'fox_espalda_2' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Animación para moverse hacia abajo (frente)
        this.anims.create({
            key: 'walk_down',
            frames: [
                { key: 'fox_frente_1' },
                { key: 'fox_frente_2' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Animación para moverse a la izquierda
        this.anims.create({
            key: 'walk_left',
            frames: [
                { key: 'fox_izq_1' },
                { key: 'fox_izq_2' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // Animación para moverse a la derecha
        this.anims.create({
            key: 'walk_right',
            frames: [
                { key: 'fox_der_1' },
                { key: 'fox_der_2' }
            ],
            frameRate: 8,
            repeat: -1
        });
    }

    createApples() {
        // Posiciones estratégicas de manzanas en el laberinto (accesibles)
        const applePositions = [
            { x: 2, y: 1 },   // Esquina superior izquierda
            { x: 5, y: 2 },   // Zona superior media
            { x: 10, y: 3 },  // Zona superior derecha
            { x: 8, y: 5 },   // Centro
            { x: 3, y: 7 },   // Zona media izquierda
            { x: 16, y: 7 },  // Centro medio
            { x: 20, y: 6 },  // Derecha media
            { x: 12, y: 9 },  // Zona baja central
            { x: 5, y: 10 },  // Baja izquierda
            { x: 22, y: 10 }, // Baja derecha
            { x: 2, y: 12 },  // Baja extrema izquierda
            { x: 8, y: 13 },  // Cerca de meta
        ];

        applePositions.forEach(pos => {
            const x = pos.x * 32 + 16;
            const y = pos.y * 32 + 16;
            const apple = this.apples.create(x, y, 'manzana');
            apple.setOrigin(0.5).setDisplaySize(24, 24);
        });
    }

    collectApple(player, apple) {
        apple.destroy();
        this.score += 10;
        this.events.emit('updateScore', this.score);
    }

    touchSpinyBush(player, bush) {
        // Solo causa daño si no está en cooldown
        const currentTime = this.time.now;
        const cooldownDuration = 1000; // 1 segundo de cooldown entre golpes
        
        if (currentTime - player.lastDamageTime > cooldownDuration && !this.isGameOver) {
            this.takeDamage();
            player.lastDamageTime = currentTime;
        }
    }

    takeDamage() {
        if (this.isGameOver) return;
        
        this.player.lives -= 1;
        this.events.emit('updateLives', this.player.lives);

        // Efecto de parpadeo (flashing)
        this.tweens.add({
            targets: this.player,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 9, // Parpadea 10 veces (0.5s total)
            onComplete: () => {
                this.player.setAlpha(1);
            }
        });

        // Si llega a 0 vidas, game over
        if (this.player.lives <= 0) {
            this.endGame(false); // false = derrota
        }
    }

    reachBurrow(player, burrow) {
        this.endGame(true); // true = victoria
    }

    endGame(isVictory) {
        if (this.isGameOver) return; // Prevenir llamadas múltiples
        this.isGameOver = true;

        this.timerEvent.remove(); // Detener timer
        
        // Detener TODAS las canciones
        this.sound.stopAll();
        
        // Detener UIScene
        this.scene.sleep('UIScene');
        
        if (isVictory) {
            this.scene.start('VictoryScene', { score: this.score, time: this.timer });
        } else {
            this.scene.start('GameOverScene', { score: this.score, time: this.timer });
        }
    }

    update() {
        // Actualizar lógica del juego en cada frame
        if (this.player && !this.isGameOver) {
            let vx = 0;
            let vy = 0;

            // Detectar input del teclado (flechas y WASD)
            if (this.cursors.left.isDown || this.input.keyboard.keys[65]) { // A key
                vx = -1;
            } else if (this.cursors.right.isDown || this.input.keyboard.keys[68]) { // D key
                vx = 1;
            }

            if (this.cursors.up.isDown || this.input.keyboard.keys[87]) { // W key
                vy = -1;
            } else if (this.cursors.down.isDown || this.input.keyboard.keys[83]) { // S key
                vy = 1;
            }

            // Normalizar velocidad diagonal
            if (vx !== 0 && vy !== 0) {
                const factor = Math.SQRT1_2;
                vx *= factor;
                vy *= factor;
            }

            // Aplicar velocidad al cuerpo físico
            this.player.body.setVelocity(vx * this.player.speed, vy * this.player.speed);

            // Cambiar animación según la dirección de movimiento
            if (vx !== 0 || vy !== 0) {
                let newDirection = this.player.lastDirection;
                
                // Determinar dirección primaria (preferir vertical sobre horizontal)
                if (vy !== 0) {
                    newDirection = vy < 0 ? 'up' : 'down';
                } else if (vx !== 0) {
                    newDirection = vx < 0 ? 'left' : 'right';
                }

                // Cambiar animación si la dirección cambió
                if (newDirection !== this.player.lastDirection) {
                    this.player.lastDirection = newDirection;
                    const animKey = 'walk_' + newDirection;
                    this.player.play(animKey);
                }
            }

            // Verificar si el jugador perdió todas las vidas
            if (this.player.lives <= 0) {
                this.endGame(false); // Derrota por vidas
            }
        }
    }
}
