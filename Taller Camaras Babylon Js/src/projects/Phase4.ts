import { Scene, Engine, Vector3, FlyCamera, MeshBuilder, PointLight, StandardMaterial, Color3, Texture, ParticleSystem } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, TextBlock, Control } from "@babylonjs/gui";

export function createPhase4Scene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    // Fondo oscuro espacial
    scene.clearColor = new Color3(0.01, 0.01, 0.03).toColor4();

    // Iluminación ambiental
    const light = new PointLight("omni", new Vector3(0, 50, 0), scene);
    light.intensity = 0.5;

    // Crear un entorno de Asteroides / Nebulosa
    createAsteroidField(scene);
    createStarfield(scene);

    // Configuración de la Fly Camera
    // FlyCamera simula el movimiento en el espacio 3D (6 grados de libertad)
    const camera = new FlyCamera("FlyCam", new Vector3(0, 0, -20), scene);
    
    // Ajustes clave para una experiencia inmersiva
    camera.rollCorrect = 10; // Auto-corrige el horizonte (Giro) suavemente
    camera.bankedTurn = true; // Inclinación natural al girar
    camera.bankedTurnLimit = Math.PI / 4; // Límite de inclinación (45 grados)
    camera.bankedTurnMultiplier = 1;
    
    // Velocidades
    camera.speed = 1.5;
    camera.angularSensibility = 2000;

    // Adjuntar los controles al canvas
    camera.attachControl(canvas, true);

    // Crear Interfaz de Usuario
    createUI();

    return scene;
}

function createAsteroidField(scene: Scene) {
    const asteroidMat = new StandardMaterial("asteroidMat", scene);
    asteroidMat.diffuseColor = new Color3(0.4, 0.4, 0.4);
    asteroidMat.specularColor = new Color3(0.1, 0.1, 0.1);
    asteroidMat.emissiveColor = new Color3(0.1, 0.05, 0.1); // Leve brillo púrpura (nebulosa)

    const crystalMat = new StandardMaterial("crystalMat", scene);
    crystalMat.emissiveColor = new Color3(0.8, 0.2, 1.0); // Cristales espaciales brillantes

    // Generar asteroides aleatorios en un volumen 3D
    for (let i = 0; i < 150; i++) {
        // Alternar entre rocas y cristales
        const isCrystal = Math.random() > 0.8;
        const size = isCrystal ? Math.random() * 2 + 1 : Math.random() * 8 + 2;

        let asteroid;
        if (isCrystal) {
            // Cristales con forma puntiaguda
            asteroid = MeshBuilder.CreatePolyhedron("crystal" + i, { type: 1, size: size }, scene);
            asteroid.material = crystalMat;
        } else {
            // Rocas esféricas deformadas
            asteroid = MeshBuilder.CreateSphere("asteroid" + i, { segments: 6, diameter: size }, scene);
            // Deformación simple
            asteroid.scaling = new Vector3(
                1 + Math.random() * 0.5,
                1 + Math.random() * 0.5,
                1 + Math.random() * 0.5
            );
            asteroid.material = asteroidMat;
        }

        // Posición aleatoria en un rango de 200 unidades
        asteroid.position = new Vector3(
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300
        );

        // Rotación aleatoria
        asteroid.rotation = new Vector3(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
    }
}

function createStarfield(scene: Scene) {
    // Sistema de partículas simple para polvo espacial / estrellas
    const particleSystem = new ParticleSystem("particles", 2000, scene);
    
    // Usar una textura oficial de Babylon para las partículas estelares
    particleSystem.particleTexture = new Texture("https://models.babylonjs.com/Demos/WeaponsSystem/flare.png", scene);

    particleSystem.emitter = Vector3.Zero(); 
    // Emitir en todas direcciones
    particleSystem.createSphereEmitter(200);

    // Color del polvo estelar (púrpura / azul)
    particleSystem.color1 = new Color3(0.5, 0.2, 1.0).toColor4();
    particleSystem.color2 = new Color3(0.2, 0.5, 1.0).toColor4();
    particleSystem.colorDead = new Color3(0, 0, 0.2).toColor4();

    particleSystem.minSize = 0.5;
    particleSystem.maxSize = 2.0;
    
    particleSystem.minLifeTime = 10.0;
    particleSystem.maxLifeTime = 20.0;
    
    // Partículas estáticas que casi no se mueven
    particleSystem.minEmitPower = 0.1;
    particleSystem.maxEmitPower = 0.5;
    particleSystem.updateSpeed = 0.01;

    particleSystem.start();
}

function createUI() {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    const panel = new Rectangle();
    panel.width = "340px";
    panel.height = "160px";
    panel.cornerRadius = 10;
    panel.color = "#9933FF"; // Púrpura espacial
    panel.thickness = 2;
    panel.background = "rgba(20, 0, 40, 0.8)";
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.top = "-20px";
    panel.left = "-20px";
    ui.addControl(panel);

    const text = new TextBlock();
    text.text = "FASE 4: NEBULOSA ESPACIAL\n-----------------------\n(Fly Camera)\n\n[W/S]: Avanzar / Retroceder\n[A/D]: Desplazamiento Lateral\n[Q/E]: Rotar / Inclinación\n[Ratón]: Mirar alrededor";
    text.color = "white";
    text.fontSize = 14;
    text.fontFamily = "Courier New";
    panel.addControl(text);
}
