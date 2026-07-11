# 🦊 El Huerto de Manzanas Prohibidas
### Documentación Técnica — Estructura de Proyecto Phaser 3

> **Materia:** Juegos Interactivos | Facultad de Ingeniería de Sistemas — EPN  
> **Evaluación:** Proyecto Individual — Videojuego Top-Down  
> **Motor:** Phaser 3 (Arcade Physics)

---

## 1. Estructura de Carpetas

```
huerto-manzanas/
│
├── index.html                  # Punto de entrada HTML del juego
├── package.json                # (Opcional) Para gestión con npm/vite
│
├── src/
│   ├── main.js                 # Configuración principal de Phaser (new Phaser.Game)
│   │
│   ├── scenes/
│   │   ├── MenuScene.js        # Escena 1: Menú principal y reglas
│   │   ├── GameScene.js        # Escena 2: Juego principal (núcleo)
│   │   ├── UIScene.js          # Escena 3: HUD superpuesto (score, vidas, timer)
│   │   ├── VictoryScene.js     # Escena 4: Pantalla de victoria
│   │   └── GameOverScene.js    # Escena 5: Pantalla de derrota
│   │
│   ├── objects/
│   │   ├── Player.js           # Clase del zorro (movimiento, animaciones, vidas)
│   │   ├── Apple.js            # Clase de manzana recolectable (score +points)
│   │   └── Burrow.js           # Clase de la madriguera (zona de meta/victoria)
│   │
│   └── utils/
│       └── ScoreManager.js     # Lógica centralizada del puntaje
│
└── assets/
    ├── sprites/
    │   ├── fox_spritesheet.png     # Spritesheet del zorro (animaciones 4 dirs)
    │   ├── apple.png               # Sprite de manzana roja
    │   └── burrow.png              # Sprite de la madriguera (meta)
    │
    ├── tilesets/
    │   ├── orchard_tiles.png       # Tileset: suelo, arbustos, manzanos
    │   └── orchard_map.json        # (Opcional) Mapa exportado desde Tiled
    │
    └── audio/
        ├── bgm_orchard.mp3         # Música de fondo (BGM) — loop continuo
        ├── sfx_collect.mp3         # SFX: recolectar manzana
        ├── sfx_damage.mp3          # SFX: recibir daño / perder vida
        ├── sfx_victory.mp3         # SFX: pantalla de victoria
        └── sfx_gameover.mp3        # SFX: pantalla de derrota
```

---

## 2. Punto de Entrada — `index.html`

Archivo mínimo que carga Phaser 3 y el script principal.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>El Huerto de Manzanas Prohibidas</title>
  <style>
    * { margin: 0; padding: 0; }
    body { background: #1a1a2e; display: flex; justify-content: center; align-items: center; height: 100vh; }
  </style>
</head>
<body>
  <!-- Phaser 3 desde CDN -->
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
  <script src="src/main.js" type="module"></script>
</body>
</html>
```

---

## 3. Configuración Principal — `src/main.js`

Define el objeto de configuración global de Phaser y registra todas las escenas.

```javascript
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
      gravity: { y: 0 },   // ⚠️ Top-Down: gravedad desactivada en Y
      debug: false
    }
  },

  // Escenas registradas en orden de flujo
  scene: [
    MenuScene,
    GameScene,
    UIScene,         // Se ejecutará en paralelo a GameScene (plugin de UI)
    VictoryScene,
    GameOverScene
  ]
};

export default new Phaser.Game(config);
```

> **Nota sobre UIScene:** En Phaser 3 es posible lanzar dos escenas simultáneamente. `UIScene` se inicia en paralelo con `GameScene` usando `this.scene.launch('UIScene')`, lo que permite que el HUD quede siempre encima sin interferir con la física del juego.

---

## 4. Escenas — Responsabilidades y Flujo

### 4.1 `MenuScene.js` — Menú Principal

**Responsabilidad:** Presentar el juego, explicar las reglas y permitir iniciar la partida.

**Contenido visual:**
- Título: *"El Huerto de Manzanas Prohibidas"*
- Subtítulo / narrativa breve (quién es el zorro, qué busca)
- Reglas resumidas: recolectar manzanas 🍎, llegar a la madriguera 🕳️, no perder todas las vidas
- Botón **"¡Entrar al Huerto!"** → inicia `GameScene`

**Transición de salida:**
```javascript
// Al presionar el botón de inicio
this.scene.start('GameScene');
```

---

### 4.2 `GameScene.js` — Escena Principal del Juego ⭐

**Responsabilidad:** Núcleo completo del gameplay. Contiene el mapa, el jugador, los objetos y toda la lógica de juego.

**Ciclo de vida (`preload → create → update`):**

```
preload()
  └── Carga: tileset, spritesheet del zorro, sprites de manzana y madriguera, audio

create()
  ├── Construye el mapa (tiles manuales o carga JSON de Tiled)
  ├── Instancia al jugador (Player) en posición inicial
  ├── Coloca las manzanas (grupo de Apple)
  ├── Coloca la madriguera (Burrow) — zona de meta
  ├── Configura colisiones: player ↔ paredes (arbustos/manzanos)
  ├── Configura overlaps: player ↔ manzanas, player ↔ madriguera
  ├── Inicia el temporizador de cuenta regresiva
  ├── Lanza la UIScene en paralelo: this.scene.launch('UIScene')
  └── Reproduce la BGM en loop

update()
  ├── Actualiza el movimiento del jugador (lee input de teclado)
  ├── Verifica condición de derrota (timer = 0 o vidas = 0)
  └── Actualiza la UIScene con el estado actual (score, timer, vidas)
```

**Condiciones de fin de partida:**
```javascript
// Victoria
if (playerReachedBurrow) {
  this.scene.stop('UIScene');
  this.scene.start('VictoryScene', { score: this.score });
}

// Derrota
if (this.timer <= 0 || this.lives <= 0) {
  this.scene.stop('UIScene');
  this.scene.start('GameOverScene', { score: this.score });
}
```

---

### 4.3 `UIScene.js` — HUD Superpuesto

**Responsabilidad:** Mostrar en pantalla, en tiempo real, el estado del juego sin mezclarse con la física.

**Elementos del HUD:**

| Elemento | Posición sugerida | Descripción |
|---|---|---|
| 🍎 Score | Arriba izquierda | `MANZANAS: 0` — se actualiza con cada recolección |
| ❤️ Vidas | Arriba centro | 3 íconos de corazón que se reducen al recibir daño |
| ⏱️ Timer | Arriba derecha | Cuenta regresiva en segundos (ej. `TIEMPO: 60`) |

**Comunicación con `GameScene`:**
```javascript
// En UIScene, escucha eventos emitidos por GameScene
const gameScene = this.scene.get('GameScene');
gameScene.events.on('updateScore', (score) => { this.scoreText.setText('MANZANAS: ' + score); });
gameScene.events.on('updateLives', (lives) => { /* actualiza íconos */ });
gameScene.events.on('updateTimer', (time)  => { this.timerText.setText('TIEMPO: ' + time); });
```

---

### 4.4 `VictoryScene.js` — Pantalla de Victoria

**Responsabilidad:** Mostrar el resultado exitoso y permitir reiniciar.

**Contenido:**
- Título: *"¡Escapaste del Huerto!"*
- Puntaje final de manzanas recolectadas
- SFX de victoria (una sola vez)
- Botón **"Jugar de nuevo"** → reinicia `GameScene`
- Botón **"Menú principal"** → vuelve a `MenuScene`

---

### 4.5 `GameOverScene.js` — Pantalla de Derrota

**Responsabilidad:** Mostrar el resultado fallido y permitir reiniciar.

**Contenido:**
- Título: *"¡El Gigante te atrapó!"* (tiempo agotado) o *"¡Sin más vidas!"*
- Puntaje parcial obtenido
- SFX de derrota (una sola vez)
- Botón **"Intentar de nuevo"** → reinicia `GameScene`
- Botón **"Menú principal"** → vuelve a `MenuScene`

---

## 5. Objetos del Juego

### 5.1 `Player.js` — El Zorro

**Extiende:** `Phaser.Physics.Arcade.Sprite`

**Responsabilidades:**
- Movimiento en 8 direcciones con `setVelocity(vx, vy)`
- Normalización de velocidad diagonal (para que no sea más rápida que la cardinal)
- Gestión de animaciones según dirección (`walk_down`, `walk_up`, `walk_left`, `walk_right`, `idle`)
- Gestión de vidas y estado de daño (invulnerabilidad temporal tras recibir golpe)

**Esquema de movimiento:**
```javascript
// Normalización de velocidad diagonal
const SPEED = 160;
let vx = 0, vy = 0;

if (left.isDown)  vx = -1;
if (right.isDown) vx =  1;
if (up.isDown)    vy = -1;
if (down.isDown)  vy =  1;

// Normalizar vector para evitar velocidad extra en diagonal
if (vx !== 0 && vy !== 0) {
  vx *= Math.SQRT1_2;  // ≈ 0.707
  vy *= Math.SQRT1_2;
}

this.body.setVelocity(vx * SPEED, vy * SPEED);
```

**Animaciones del spritesheet:**

| Animación | Frames sugeridos | Condición |
|---|---|---|
| `idle` | 0 | Sin movimiento |
| `walk_down` | 1 – 3 | `vy > 0` |
| `walk_up` | 4 – 6 | `vy < 0` |
| `walk_left` | 7 – 9 | `vx < 0` |
| `walk_right` | 10 – 12 | `vx > 0` |

---

### 5.2 `Apple.js` — Manzana Recolectable

**Extiende:** `Phaser.Physics.Arcade.Image` (estático, sin movimiento)

**Comportamiento:**
- Al colisionar con el jugador (overlap): desaparece, emite evento `+10 puntos` al score, reproduce `sfx_collect`
- Se distribuyen aleatoriamente en posiciones válidas del mapa (no dentro de paredes)

---

### 5.3 `Burrow.js` — La Madriguera (Meta)

**Extiende:** `Phaser.Physics.Arcade.Image` (estático)

**Comportamiento:**
- Zona de overlap al final del laberinto
- Al ser alcanzada por el jugador: dispara condición de victoria en `GameScene`
- Puede tener una animación sutil de brillo/pulso para ser visible

---

## 6. Diseño del Mapa — Laberinto del Huerto

### Estrategia recomendada: Tiles Manuales con Arrays

Se define un array 2D donde cada número representa un tipo de tile:

```javascript
// En GameScene.js — create()
const MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,1],
  [1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Leyenda de tiles
// 0 = suelo transitable (grass)
// 1 = pared sólida (arbusto/manzano) — colisión activada
// 2 = posición de manzana recolectable
// 9 = madriguera (meta de victoria)
```

### Alternativa: Tiled (Opcional)

Si se prefiere Tiled, el flujo es:
1. Diseñar el mapa en Tiled con el tileset `orchard_tiles.png`
2. Exportar como `orchard_map.json`
3. Cargar en Phaser con `this.make.tilemap({ key: 'map' })`
4. Asignar colisión a la capa de obstáculos con `setCollisionByProperty({ collides: true })`

---

## 7. Sistema de Audio

| Archivo | Tipo | Uso | Loop |
|---|---|---|---|
| `bgm_orchard.mp3` | BGM | Se reproduce al iniciar `GameScene` | ✅ Sí |
| `sfx_collect.mp3` | SFX | Al recolectar una manzana | ❌ No |
| `sfx_damage.mp3` | SFX | Al recibir daño / perder vida | ❌ No |
| `sfx_victory.mp3` | SFX | Al entrar a `VictoryScene` | ❌ No |
| `sfx_gameover.mp3` | SFX | Al entrar a `GameOverScene` | ❌ No |

```javascript
// Reproducción en GameScene
this.bgm = this.sound.add('bgm_orchard', { loop: true, volume: 0.5 });
this.bgm.play();

// Detener BGM al terminar la partida
this.bgm.stop();
```

---

## 8. Flujo Completo de Escenas

```
┌─────────────────┐
│   MenuScene     │  ← Inicio del juego
│  (Título +      │
│   Reglas)       │
└────────┬────────┘
         │ Botón "¡Entrar al Huerto!"
         ▼
┌─────────────────┐     ┌──────────────┐
│   GameScene     │◄────┤   UIScene    │  ← Corre en paralelo
│  (Gameplay)     │────►│  (HUD)       │     (score, vidas, timer)
└────────┬────────┘     └──────────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌───────┐  ┌──────────┐
│Victory│  │ GameOver │
│Scene  │  │  Scene   │
└───┬───┘  └────┬─────┘
    │            │
    └─────┬──────┘
          │ Botón "Jugar de nuevo" o "Menú"
          ▼
     GameScene / MenuScene
```

---

## 9. Checklist de Requerimientos de Evaluación

| # | Requerimiento | Implementado en | % Rúbrica |
|---|---|---|---|
| 1 | Narrativa del juego | `MenuScene` (texto de premisa) | 20% |
| 2 | Menú de inicio funcional | `MenuScene.js` | 25% |
| 3 | Sistema de Score (HUD) | `UIScene.js` + `ScoreManager.js` | 25% |
| 4 | Audio BGM + SFX | `GameScene`, `VictoryScene`, `GameOverScene` | 20% |
| 5 | Condiciones de victoria y derrota | `GameScene` → `VictoryScene` / `GameOverScene` | 25% |
| 6 | Spritesheet + animaciones direccionales | `Player.js` | 30% |

---

*Documentación generada para el Proyecto Técnico: Juego Top-Down — EPN*
