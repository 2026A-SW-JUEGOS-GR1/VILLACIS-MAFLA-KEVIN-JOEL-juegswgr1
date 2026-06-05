# 🍎 Game Design Document (GDD)
## El Huerto de Manzanas Prohibidas

> **Materia:** Juegos Interactivos | Facultad de Ingeniería de Sistemas — EPN  
> **Evaluación:** Proyecto Individual — Videojuego Top-Down  
> **Versión del documento:** 1.0  
> **Motor:** Phaser 3

---

## 1. Visión General del Juego

| Campo | Detalle |
|---|---|
| **Título** | El Huerto de Manzanas Prohibidas |
| **Género** | Aventura / Laberinto — Top-Down 2D |
| **Plataforma** | Web (navegador) |
| **Motor** | Phaser 3 con Arcade Physics |
| **Perspectiva** | Superior (Top-Down) — sin gravedad en eje Y |
| **Jugadores** | 1 (single-player) |
| **Duración estimada por partida** | 60 – 120 segundos |

---

## 2. Concepto Central

Un juego de infiltración y recolección en perspectiva superior donde el jugador debe navegar un laberinto orgánico, recolectar la mayor cantidad de manzanas posible y escapar antes de que el tiempo se agote — o antes de perder todas sus vidas.

La tensión del juego nace de la dualidad entre **la codicia** (querer recolectar más manzanas para subir el score) y **la urgencia** (el tiempo corre y el gigante puede regresar en cualquier momento).

---

## 3. Narrativa y Lore

### 3.1 Premisa

En lo profundo del bosque del norte vive **Rox**, un pequeño zorro conocido en toda la comarca por su astucia y su insaciable apetito por las manzanas rojas. Sin embargo, las mejores manzanas del bosque no crecen en cualquier árbol: crecen en el **Huerto Prohibido del Gigante de la Montaña**, un vasto jardín privado rodeado de manzanos centenarios y arbustos espinosos tan densos que forman un laberinto natural.

### 3.2 El Protagonista — Rox, el Zorro

- **Nombre:** Rox
- **Especie:** Zorro del bosque
- **Personalidad:** Astuto, curioso, algo temerario. Nunca rechaza un buen reto ni una buena manzana.
- **Motivación:** Las manzanas del gigante son legendarias — más jugosas, más rojas y más dulces que cualquier otra. Rox no puede resistirse.
- **Habilidad:** Movimiento ágil en todas las direcciones, capaz de deslizarse por los estrechos pasillos del laberinto.

### 3.3 El Antagonista — El Gigante de la Montaña

- **Nombre:** No tiene nombre propio; los animales del bosque lo llaman simplemente *"el Gigante"*.
- **Rol en el juego:** No aparece físicamente en pantalla, pero su presencia se siente a través del **temporizador**: cada segundo que pasa es un segundo más cerca de su regreso.
- **Función narrativa:** Es la condición de derrota por tiempo. Si el contador llega a cero, el Gigante ha regresado y Rox ha sido atrapado.

### 3.4 El Entorno — El Huerto Prohibido

El huerto es un jardín privado en las laderas de la montaña. Desde arriba, los manzanos centenarios y los arbustos espinosos forman un **laberinto natural** con pasillos estrechos, callejones sin salida y una única salida: la pequeña **madriguera de escape** que Rox cavó en secreto semanas atrás, escondida en algún rincón del huerto.

El suelo es de tierra y pasto corto. Las paredes son manzanos frondosos y arbustos espinosos — sólidos e impasables para el pequeño zorro.

### 3.5 El Objetivo

> *"Rox entró al huerto con un plan simple: recoger las manzanas más rojas que pueda encontrar, cruzar el laberinto y escapar por su madriguera secreta antes de que el Gigante regrese de su paseo matutino. Simple... si no fuera porque los arbustos espinosos parecen moverse solos."*

---

## 4. Género y Referentes

### 4.1 Género Principal
**Aventura / Laberinto Top-Down** con elementos de recolección y gestión de tiempo.

### 4.2 Mecánicas de Género
- **Laberinto:** El mapa es un espacio cerrado con caminos definidos, callejones sin salida y una única meta. El jugador debe explorar y memorizar rutas.
- **Recolección:** Las manzanas dispersas por el mapa incentivan la exploración y el riesgo calculado.
- **Presión de tiempo:** El temporizador crea urgencia constante sin necesidad de enemigos activos.

### 4.3 Referentes de Diseño

| Juego | Elemento tomado como referencia |
|---|---|
| *Pac-Man* (1980) | Recolección de ítems en laberinto con presión constante |
| *The Legend of Zelda: Link's Awakening* | Perspectiva top-down, exploración de mapa con colisiones sólidas |
| *Sokoban* | Lógica espacial en cuadrícula y navegación de pasillos estrechos |

---

## 5. Mecánicas de Juego

### 5.1 Movimiento del Jugador

- **Tipo:** Libre en 8 direcciones (ejes X e Y simultáneos)
- **Sin gravedad:** La perspectiva superior elimina la influencia gravitacional en el eje Y
- **Velocidad:** Constante, normalizada en diagonal para evitar velocidad extra
- **Control:** Teclado — teclas de dirección o WASD

### 5.2 Recolección de Manzanas

- Las manzanas rojas están dispersas por los pasillos del laberinto
- Al tocar una manzana, Rox la recoge automáticamente (overlap)
- Cada manzana recolectada suma **+10 puntos** al marcador
- Se reproduce el `sfx_collect` como confirmación auditiva

### 5.3 Sistema de Vidas

- Rox comienza con **3 vidas** (representadas como corazones en el HUD)
- Pierde una vida al contacto con una **trampa del huerto** (zonas de arbustos dañinos, si se implementan)
- Tras recibir daño, hay un breve período de **invulnerabilidad temporal** (parpadeo del sprite)
- Si las vidas llegan a 0 → condición de **Derrota**

### 5.4 Temporizador

- Al iniciar `GameScene`, arranca un contador regresivo (ej. **90 segundos**)
- El tiempo restante se muestra en el HUD en todo momento
- Si el contador llega a **0** → condición de **Derrota** (el Gigante regresó)

### 5.5 Condición de Victoria

- Rox llega a la **madriguera de escape** (zona especial en el mapa) antes de que el tiempo se agote y con al menos 1 vida restante
- El score acumulado de manzanas se muestra en la pantalla de victoria

### 5.6 Condición de Derrota

Cualquiera de estas dos condiciones activa la pantalla de Game Over:
1. El temporizador llega a **0** (el Gigante regresó)
2. Rox pierde todas sus **vidas** (quedó atrapado en las trampas del huerto)

---

## 6. Elementos del Mundo

### 6.1 Objetos Interactivos

| Objeto | Sprite | Interacción | Efecto |
|---|---|---|---|
| 🍎 Manzana roja | `apple.png` | Overlap con Rox | +10 puntos, SFX collect, desaparece |
| 🕳️ Madriguera | `burrow.png` | Overlap con Rox | Activa condición de victoria |
| 🌿 Arbusto espinoso | Tile de colisión | Colisión física | Bloquea el paso (pared sólida) |
| 🌳 Manzano | Tile de colisión | Colisión física | Bloquea el paso (pared sólida) |

### 6.2 El Mapa — Laberinto del Huerto

- **Dimensiones:** Cuadrícula de tiles (aprox. 16×12 tiles de 48×48px = 768×576px)
- **Estructura:** Laberinto con pasillos de 1–2 tiles de ancho, múltiples bifurcaciones y callejones sin salida
- **Punto de inicio:** Rox aparece en la esquina superior izquierda del mapa
- **Meta:** La madriguera se ubica en el extremo opuesto (esquina inferior derecha o zona interior profunda)
- **Distribución de manzanas:** Dispersas en posiciones accesibles del laberinto, incentivando explorar callejones

---

## 7. Interfaz de Usuario (HUD)

La interfaz es mínima y no invasiva. Todos los elementos se muestran en la capa superior (`UIScene`) sin interferir con el gameplay.

```
┌─────────────────────────────────────────────────┐
│ 🍎 MANZANAS: 30    ❤️❤️❤️    ⏱️ TIEMPO: 74     │
│─────────────────────────────────────────────────│
│                                                 │
│              [ÁREA DE JUEGO]                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

| Elemento | Descripción |
|---|---|
| **Score** | Contador numérico de manzanas recolectadas. Actualización inmediata. |
| **Vidas** | 3 íconos de corazón. Se vacían/apagan al perder una vida. |
| **Timer** | Cuenta regresiva en segundos. Color normal → amarillo (≤30s) → rojo (≤10s). |

---

## 8. Diseño de Audio

### 8.1 Música de Fondo (BGM)

- **Archivo:** `bgm_orchard.mp3`
- **Estilo:** Melodía de cuerda y xilófono — tensa pero con un tono juguetón y alegre. Evoca la travesura de un animal pequeño en un lugar prohibido.
- **Reproducción:** Loop continuo durante toda la `GameScene`. Se detiene al entrar a pantallas de victoria o derrota.
- **Recomendación de búsqueda:** Música libre de derechos estilo *"sneaky adventure"* o *"forest heist"* en sitios como OpenGameArt.org o freesound.org.

### 8.2 Efectos de Sonido (SFX)

| Evento | Archivo | Descripción del sonido |
|---|---|---|
| Recolectar manzana | `sfx_collect.mp3` | Sonido corto y brillante — tipo "ding" o mordisco |
| Recibir daño | `sfx_damage.mp3` | Sonido de impacto suave — tipo "ouch" o crujido |
| Victoria | `sfx_victory.mp3` | Fanfarria corta y alegre |
| Derrota | `sfx_gameover.mp3` | Sonido descendente y cómico — el gigante gruñe |

---

## 9. Estética Visual

### 9.1 Paleta de Colores

| Elemento | Color sugerido | Referencia |
|---|---|---|
| Suelo / pasto | Verde oscuro | `#2d5a1b` |
| Paredes (arbustos) | Verde intenso / marrón | `#1a3d0a` / `#5c3d1a` |
| Manzanas | Rojo brillante | `#e63946` |
| Madriguera | Marrón tierra | `#8b5e3c` |
| HUD (texto) | Blanco / amarillo cálido | `#ffffff` / `#ffd166` |
| Fondo de UI | Negro semitransparente | `rgba(0,0,0,0.5)` |

### 9.2 Estilo de Arte

- **Estilo:** Pixel art — 16×16 o 32×32 px por tile
- **Paleta:** Tonos naturales del bosque (verdes, marrones, rojos)
- **Personaje:** Spritesheet del zorro con animaciones fluidas para 4 direcciones de caminata + idle
- **Coherencia:** Todos los assets deben mantener el mismo tamaño de tile y estilo pixel art

### 9.3 Spritesheet del Zorro (Rox)

El spritesheet debe contener como mínimo las siguientes animaciones:

| Animación | Frames | Descripción |
|---|---|---|
| `idle` | 1 frame | Zorro parado, mirando al frente |
| `walk_down` | 3 frames | Camina hacia abajo (hacia la cámara) |
| `walk_up` | 3 frames | Camina hacia arriba (alejándose) |
| `walk_left` | 3 frames | Camina hacia la izquierda |
| `walk_right` | 3 frames | Camina hacia la derecha (o flip de `walk_left`) |

> **Recurso recomendado:** Buscar *"fox top-down spritesheet pixel art"* en itch.io (sección free assets) o OpenGameArt.org.

---

## 10. Flujo de Experiencia del Jugador

```
INICIO
  │
  ▼
[MenuScene]
  Título del juego + narrativa breve
  Reglas explicadas claramente
  Botón "¡Entrar al Huerto!"
  │
  ▼
[GameScene] ←─────────────────────────────┐
  Rox aparece en el inicio del laberinto   │
  BGM comienza en loop                     │
  HUD activo: score=0, vidas=3, timer=90s  │
  │                                        │
  ├── Recolecta manzanas → score sube      │
  ├── Toca trampa → pierde vida            │
  │                                        │
  ├── [VICTORIA] Llega a la madriguera ────┤──► [VictoryScene]
  │     Score final mostrado               │      Botón "Jugar de nuevo" ──┘
  │     sfx_victory                        │      Botón "Menú principal"
  │                                        │
  └── [DERROTA] Timer=0 o vidas=0 ─────────┤──► [GameOverScene]
        Score parcial mostrado                     Botón "Intentar de nuevo" ─┘
        sfx_gameover                               Botón "Menú principal"
```

---

## 11. Alineación con la Rúbrica de Evaluación

| Criterio | Peso | Cómo se cumple en este diseño |
|---|---|---|
| **Físicas e Interacción** | 30% | Movimiento 8 direcciones normalizado + colisiones sólidas con todas las paredes del laberinto |
| **Escenario y Entorno** | 25% | Laberinto de tiles con estética pixel art coherente (manzanos, arbustos, suelo de pasto) |
| **Flujo y Marcador** | 25% | MenuScene → GameScene+UIScene → VictoryScene/GameOverScene con score activo en HUD |
| **Multimedia, Audio y Narrativa** | 20% | BGM en loop + 4 SFX + narrativa de Rox y el Gigante + spritesheet con animaciones direccionales |

---

> 📎 **Documento relacionado:** Ver `TECHNICAL.md` para la estructura de carpetas, arquitectura de escenas en Phaser 3 y fragmentos de código de implementación.

---

*GDD v1.0 — Proyecto Técnico: Juego Top-Down — EPN*
