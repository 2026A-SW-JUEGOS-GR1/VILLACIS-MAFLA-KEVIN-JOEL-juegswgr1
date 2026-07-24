import { Scene, Engine, Vector3, FollowCamera, MeshBuilder, DirectionalLight, StandardMaterial, Color3, ActionManager, ExecuteCodeAction } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, TextBlock, Control } from "@babylonjs/gui";

export function createPhase3Scene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.05, 0.05, 0.05).toColor4();
    scene.collisionsEnabled = true;

    // Iluminación
    const light = new DirectionalLight("dirLight", new Vector3(-1, -2, -1), scene);
    light.intensity = 0.8;

    // 1. Crear el entorno (Pista Neón modular con curvas de 45°)
    createTrack(scene);

    // 2. Crear la nave
    const hovercar = createHovercar(scene);

    // 3. Follow Camera
    const camera = new FollowCamera("FollowCam", new Vector3(0, 10, -10), scene);
    camera.lockedTarget = hovercar;
    camera.radius = 15;
    camera.heightOffset = 6;
    camera.rotationOffset = 180;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 20;

    const textBlock = createUI();

    // 4. Lógica de Movimiento
    setupMovement(scene, hovercar, textBlock);

    return scene;
}

function createTrack(scene: Scene) {
    const trackMat = new StandardMaterial("trackMat", scene);
    trackMat.diffuseColor = new Color3(0.1, 0.1, 0.1);
    
    const neonMat = new StandardMaterial("neonMat", scene);
    neonMat.emissiveColor = new Color3(0, 1, 0.8);
    neonMat.disableLighting = true;

    // Función para crear rectas con paredes de neón garantizando colisiones perfectas
    const createStraight = (name: string, start: Vector3, end: Vector3, width: number) => {
        const diff = end.subtract(start);
        const length = diff.length();
        const dir = diff.normalize();
        const angle = Math.atan2(dir.x, dir.z);
        const center = start.add(dir.scale(length / 2));

        // Suelo
        const ground = MeshBuilder.CreateGround(name + "_g", { width, height: length }, scene);
        ground.position = center;
        ground.rotation.y = angle;
        ground.material = trackMat;
        ground.checkCollisions = true;

        // Dirección hacia la izquierda (-X en local)
        const leftDir = new Vector3(-dir.z, 0, dir.x);
        
        // Pared Izquierda (sin extensión para no bloquear la pista)
        const leftWall = MeshBuilder.CreateBox(name + "_w1", { width: 1, height: 4, depth: length }, scene);
        leftWall.position = center.add(leftDir.scale(width / 2));
        leftWall.rotation.y = angle;
        leftWall.material = neonMat;
        leftWall.checkCollisions = true;

        // Pared Derecha (sin extensión para no bloquear la pista)
        const rightWall = MeshBuilder.CreateBox(name + "_w2", { width: 1, height: 4, depth: length }, scene);
        rightWall.position = center.add(leftDir.scale(-width / 2));
        rightWall.rotation.y = angle;
        rightWall.material = neonMat;
        rightWall.checkCollisions = true;
    };

    // Crear un circuito modular largo con curvas
    const w = 40; // Ancho de la pista
    const p0 = new Vector3(0, 0, -50);
    const p1 = new Vector3(0, 0, 1500); // Larga recta inicial
    const p2 = new Vector3(500, 0, 2000); // Curva a la derecha
    const p3 = new Vector3(1500, 0, 2000); // Recta horizontal
    const p4 = new Vector3(2000, 0, 2500); // Curva a la izquierda
    const p5 = new Vector3(2000, 0, 4500); // Recta final

    createStraight("seg1", p0, p1, w);
    createStraight("seg2", p1, p2, w);
    createStraight("seg3", p2, p3, w);
    createStraight("seg4", p3, p4, w);
    createStraight("seg5", p4, p5, w);

    // Función para tapar los huecos del suelo en las uniones
    const createJointFloor = (pos: Vector3) => {
        const jointFloor = MeshBuilder.CreateCylinder("jF", { diameter: w * 1.5, height: 0.1 }, scene);
        jointFloor.position = pos;
        jointFloor.material = trackMat;
        jointFloor.checkCollisions = true;
    };
    createJointFloor(p1);
    createJointFloor(p2);
    createJointFloor(p3);
    createJointFloor(p4);

    // Función para tapar los huecos de las paredes exteriores en las esquinas
    const createCornerPatch = (pos: Vector3, offsetX: number, offsetZ: number) => {
        const patch = MeshBuilder.CreateBox("patch", { width: 30, height: 4, depth: 30 }, scene);
        patch.position = pos.add(new Vector3(offsetX, 0, offsetZ));
        patch.material = neonMat;
        patch.checkCollisions = true;
    };

    // Parches en las 4 curvas (tapando el exterior de cada una)
    createCornerPatch(p1, -25, 25);
    createCornerPatch(p2, -25, 25);
    createCornerPatch(p3, 25, -25);
    createCornerPatch(p4, 25, -25);

    // Meta
    const finishMat = new StandardMaterial("finishMat", scene);
    finishMat.emissiveColor = new Color3(1, 0.8, 0);
    const finishLine = MeshBuilder.CreateGround("finishLine", { width: w, height: 10 }, scene);
    finishLine.position = new Vector3(2000, 0.1, 4400); 
    finishLine.material = finishMat;
}

function createHovercar(scene: Scene) {
    const carMat = new StandardMaterial("carMat", scene);
    carMat.diffuseColor = new Color3(0.8, 0.2, 0.2); 
    
    const car = MeshBuilder.CreateBox("hovercar", { width: 3, height: 1, depth: 5 }, scene);
    car.position = new Vector3(0, 1, 0); // Aparece un poco elevado para no traspasar el piso
    
    // Configuración robusta de colisiones (sin offsets para evitar hundimientos)
    car.checkCollisions = true;
    car.ellipsoid = new Vector3(1.5, 0.5, 2.5); 
    car.ellipsoidOffset = new Vector3(0, 0, 0);
    car.material = carMat;

    // Propulsores
    const engineMat = new StandardMaterial("engineMat", scene);
    engineMat.emissiveColor = new Color3(0, 0.8, 1);
    
    const engineL = MeshBuilder.CreateCylinder("engineL", { diameter: 1, height: 2 }, scene);
    engineL.rotation.x = Math.PI / 2;
    engineL.position = new Vector3(-1.5, 0, -2.5);
    engineL.parent = car;
    engineL.material = engineMat;

    const engineR = MeshBuilder.CreateCylinder("engineR", { diameter: 1, height: 2 }, scene);
    engineR.rotation.x = Math.PI / 2;
    engineR.position = new Vector3(1.5, 0, -2.5);
    engineR.parent = car;
    engineR.material = engineMat;

    return car;
}

function setupMovement(scene: Scene, hovercar: any, textBlock: TextBlock) {
    const inputMap: any = {};
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
    }));
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === "keydown";
    }));

    let forwardSpeed = 2.0; 
    const turnSpeed = 0.05;
    let hasFinished = false;

    scene.onBeforeRenderObservable.add(() => {
        // Detectar si cruzó la meta
        if (hovercar.position.z >= 4400 && hovercar.position.x > 1800 && !hasFinished) {
            hasFinished = true;
            textBlock.text = "¡META ALCANZADA!\n-----------------------\nFrenando nave...";
            textBlock.color = "#00FF00";
        }

        if (hasFinished) {
            forwardSpeed = Math.max(0, forwardSpeed - 0.02);
        }

        // Rotar libremente
        if (forwardSpeed > 0.1) {
            if (inputMap["a"] || inputMap["A"] || inputMap["ArrowLeft"]) {
                hovercar.rotation.y -= turnSpeed;
            }
            if (inputMap["d"] || inputMap["D"] || inputMap["ArrowRight"]) {
                hovercar.rotation.y += turnSpeed;
            }
        }

        // Vector de dirección de movimiento + un poco de gravedad artificial (-0.1 en Y)
        const direction = new Vector3(
            Math.sin(hovercar.rotation.y) * forwardSpeed,
            -0.1, 
            Math.cos(hovercar.rotation.y) * forwardSpeed
        );

        hovercar.moveWithCollisions(direction);
    });
}

function createUI(): TextBlock {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    const panel = new Rectangle();
    panel.width = "320px";
    panel.height = "100px";
    panel.cornerRadius = 10;
    panel.color = "#FF3366"; 
    panel.thickness = 2;
    panel.background = "rgba(30, 0, 10, 0.8)";
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.top = "-20px";
    panel.left = "-20px";
    ui.addControl(panel);

    const text = new TextBlock();
    text.text = "FASE 3: CARRERAS SCI-FI\n-----------------------\nEsquiva las paredes de neón\n[A/D o Flechas]: Girar";
    text.color = "white";
    text.fontSize = 14;
    text.fontFamily = "Courier New";
    panel.addControl(text);

    return text;
}
