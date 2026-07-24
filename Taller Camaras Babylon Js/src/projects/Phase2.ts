import { Scene, Engine, Vector3, ArcRotateCamera, MeshBuilder, PointLight, StandardMaterial, Color3, TransformNode, ParticleSystem, Texture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, TextBlock, Control } from "@babylonjs/gui";

export function createPhase2Scene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    
    // 1. Fondo oscuro/espacial
    scene.clearColor = new Color3(0.01, 0.01, 0.05).toColor4();

    // 2. Arc Rotate Camera (Orbital)
    // alpha = rotación horizontal, beta = rotación vertical, radius = distancia
    const camera = new ArcRotateCamera("ArcCamera", Math.PI / 4, Math.PI / 3, 30, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    
    // Configuración de límites (zoom e inercia)
    camera.lowerRadiusLimit = 10; // No acercarse más de 10 unidades
    camera.upperRadiusLimit = 100; // No alejarse más de 100 unidades
    camera.wheelPrecision = 20; // Sensibilidad del scroll (zoom)
    camera.panningSensibility = 0; // Deshabilitar el paneo para forzar la órbita sobre el sol

    // 3. Crear Sistema Solar (Sol y Planetas)
    createSolarSystem(scene);

    // 4. UI Minimalista
    createUI();

    return scene;
}

function createSolarSystem(scene: Scene) {
    // Sol
    const sun = MeshBuilder.CreateSphere("sun", { diameter: 8 }, scene);
    const sunMat = new StandardMaterial("sunMat", scene);
    sunMat.emissiveColor = new Color3(1, 0.8, 0.1);
    sunMat.disableLighting = true; // Para que brille por sí mismo
    sun.material = sunMat;

    // Luz que emite el sol
    const sunLight = new PointLight("sunLight", Vector3.Zero(), scene);
    sunLight.intensity = 1.5;

    // Sistema de planetas
    const planetsInfo = [
        { name: "Planeta1", distance: 10, diameter: 2, color: new Color3(0.2, 0.5, 1), speed: 0.01 },
        { name: "Planeta2", distance: 18, diameter: 3, color: new Color3(0.8, 0.3, 0.1), speed: 0.007 },
        { name: "Planeta3", distance: 28, diameter: 1.5, color: new Color3(0.6, 0.8, 0.6), speed: 0.004 }
    ];

    const planets: { pivot: TransformNode, mesh: any, speed: number }[] = [];

    planetsInfo.forEach(info => {
        // Pivot en el centro para facilitar la órbita
        const pivot = new TransformNode("pivot_" + info.name, scene);
        
        const planet = MeshBuilder.CreateSphere(info.name, { diameter: info.diameter }, scene);
        planet.parent = pivot;
        planet.position.x = info.distance;

        const mat = new StandardMaterial(info.name + "_mat", scene);
        mat.diffuseColor = info.color;
        mat.specularColor = new Color3(0.1, 0.1, 0.1);
        planet.material = mat;

        planets.push({ pivot, mesh: planet, speed: info.speed });
    });

    // Animar las órbitas en cada frame
    scene.onBeforeRenderObservable.add(() => {
        sun.rotation.y += 0.005; // Rotación del sol sobre su eje
        planets.forEach(p => {
            p.pivot.rotation.y += p.speed; // Traslación alrededor del sol
            p.mesh.rotation.y += 0.02; // Rotación sobre su propio eje
        });
    });
}

function createUI() {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    const panel = new Rectangle();
    panel.width = "320px";
    panel.height = "100px";
    panel.cornerRadius = 10;
    panel.color = "#FFD700"; // Dorado para el sol
    panel.thickness = 2;
    panel.background = "rgba(10, 5, 0, 0.8)";
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.top = "-20px";
    panel.left = "-20px";
    ui.addControl(panel);

    const text = new TextBlock();
    text.text = "FASE 2: SISTEMA SOLAR\n---------------------\n[Drag/Click]: Orbitar\n[Rueda/Scroll]: Zoom";
    text.color = "white";
    text.fontSize = 14;
    text.fontFamily = "Courier New";
    panel.addControl(text);
}
