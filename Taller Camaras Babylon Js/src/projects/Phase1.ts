import { Scene, Engine, Vector3, UniversalCamera, MeshBuilder, PointLight, StandardMaterial, Color3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, TextBlock, Control } from "@babylonjs/gui";

export function createPhase1Scene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    
    // 1. Física/Gravedad de la escena
    scene.gravity = new Vector3(0, -0.15, 0); // Gravedad suave
    scene.collisionsEnabled = true;

    // 2. Iluminación Sci-Fi
    const light = new PointLight("light", new Vector3(0, 4, 10), scene);
    light.diffuse = new Color3(0.2, 0.6, 1.0); // Tono azulado de nave
    light.intensity = 0.8;

    // 3. Universal Camera (FPS)
    const camera = new UniversalCamera("UniversalCamera", new Vector3(0, 2, 0), scene);
    camera.setTarget(new Vector3(0, 2, 10));
    camera.attachControl(canvas, true);
    
    // Configuración de FPS
    camera.applyGravity = true;
    camera.checkCollisions = true;
    camera.ellipsoid = new Vector3(1, 1, 1); // Tamaño del colisionador del jugador
    camera.speed = 0.4;
    camera.minZ = 0.1;

    // 4. Crear el entorno (Pasillo)
    createCorridor(scene);

    // 5. UI Minimalista
    createUI();

    return scene;
}

function createCorridor(scene: Scene) {
    const mat = new StandardMaterial("wallMat", scene);
    mat.diffuseColor = new Color3(0.2, 0.2, 0.25);
    mat.specularColor = new Color3(0.1, 0.1, 0.1);

    const floorMat = new StandardMaterial("floorMat", scene);
    floorMat.diffuseColor = new Color3(0.1, 0.1, 0.15);

    // Suelo
    const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 60 }, scene);
    ground.position.z = 25;
    ground.checkCollisions = true;
    ground.material = floorMat;

    // Techo
    const ceiling = MeshBuilder.CreateGround("ceiling", { width: 10, height: 60 }, scene);
    ceiling.position.y = 5;
    ceiling.position.z = 25;
    ceiling.rotation.x = Math.PI;
    ceiling.checkCollisions = true;
    ceiling.material = mat;

    // Paredes laterales
    const leftWall = MeshBuilder.CreateBox("leftWall", { width: 1, height: 5, depth: 60 }, scene);
    leftWall.position = new Vector3(-5, 2.5, 25);
    leftWall.checkCollisions = true;
    leftWall.material = mat;

    const rightWall = MeshBuilder.CreateBox("rightWall", { width: 1, height: 5, depth: 60 }, scene);
    rightWall.position = new Vector3(5, 2.5, 25);
    rightWall.checkCollisions = true;
    rightWall.material = mat;

    // Obstáculos
    const box1 = MeshBuilder.CreateBox("box1", { size: 2 }, scene);
    box1.position = new Vector3(-2, 1, 10);
    box1.checkCollisions = true;
    box1.material = mat;
    
    const box2 = MeshBuilder.CreateBox("box2", { size: 2, width: 4 }, scene);
    box2.position = new Vector3(2, 1, 25);
    box2.checkCollisions = true;
    box2.material = mat;
}

function createUI() {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    const panel = new Rectangle();
    panel.width = "300px";
    panel.height = "100px";
    panel.cornerRadius = 10;
    panel.color = "#00FFFF";
    panel.thickness = 2;
    panel.background = "rgba(0, 10, 30, 0.8)";
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.top = "-20px";
    panel.left = "-20px";
    ui.addControl(panel);

    const text = new TextBlock();
    text.text = "FASE 1: MANTENIMIENTO\n---------------------\n[W][A][S][D]: Moverse\n[Mouse]: Mirar";
    text.color = "white";
    text.fontSize = 14;
    text.fontFamily = "Courier New";
    panel.addControl(text);
}
