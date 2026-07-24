import { Scene, Engine, Vector3, DeviceOrientationCamera, MeshBuilder, PointLight, StandardMaterial, Color3, Texture, Layer, Tools } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, TextBlock, Control, Slider, StackPanel } from "@babylonjs/gui";

export function createPhase5Scene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0, 0, 0).toColor4();

    // Iluminación
    const light = new PointLight("omni", new Vector3(0, 0, 0), scene);
    light.intensity = 1.0;

    // Crear Entorno (Estrellas y Planetas)
    createCosmos(scene);

    // ----------------------------------------------------
    // PROTAGONISTA DE LA FASE 5: DeviceOrientationCamera
    // ----------------------------------------------------
    // Esta cámara responde a los sensores de giroscopio y acelerómetro del celular
    const camera = new DeviceOrientationCamera("DevOr_camera", new Vector3(0, 0, 0), scene);
    
    // Adjuntar controles (En móvil esto capturaría los eventos del sensor)
    camera.attachControl(canvas, true);

    // UI (HUD del telescopio y Simulador de móvil para PC)
    createTelescopeHUD(scene);

    return scene;
}

function createCosmos(scene: Scene) {
    // 1. Fondo de Estrellas (Cielo Esférico)
    const skyMaterial = new StandardMaterial("skybox", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.disableLighting = true;
    skyMaterial.emissiveColor = new Color3(1, 1, 1);
    // Usamos una textura oficial de Babylon para el cielo estrellado
    skyMaterial.diffuseTexture = new Texture("https://playground.babylonjs.com/textures/skybox_nx.jpg", scene);
    
    const skybox = MeshBuilder.CreateSphere("skyBox", { diameter: 1000 }, scene);
    skybox.material = skyMaterial;

    // 2. Planetas Interesantes para buscar con el telescopio
    const createPlanet = (name: string, size: number, distance: number, color: Color3, url: string) => {
        const planet = MeshBuilder.CreateSphere(name, { segments: 32, diameter: size }, scene);
        // Distribuir esféricamente al azar
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        planet.position = new Vector3(
            distance * Math.sin(phi) * Math.cos(theta),
            distance * Math.cos(phi),
            distance * Math.sin(phi) * Math.sin(theta)
        );
        
        const mat = new StandardMaterial(name + "Mat", scene);
        mat.diffuseTexture = new Texture(url, scene);
        mat.emissiveColor = color.scale(0.2); // Leve brillo
        planet.material = mat;
    };

    // Planeta Tipo Tierra
    createPlanet("earthLike", 50, 200, new Color3(0, 0.5, 1), "https://playground.babylonjs.com/textures/earth.jpg");
    
    // Planeta Tipo Marte
    createPlanet("marsLike", 30, 150, new Color3(1, 0.3, 0), "https://playground.babylonjs.com/textures/rock.png");

    // Planeta Gaseoso
    createPlanet("gasGiant", 80, 300, new Color3(0.8, 0.6, 0.4), "https://playground.babylonjs.com/textures/sand.jpg");
}

function createTelescopeHUD(scene: Scene) {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // 1. Crear el HUD de retícula del telescopio
    const reticle = new Rectangle();
    reticle.width = "400px";
    reticle.height = "400px";
    reticle.cornerRadius = 200; // Hacerlo circular
    reticle.color = "#00FFCC";
    reticle.thickness = 2;
    reticle.background = "transparent";
    ui.addControl(reticle);

    const crosshairV = new Rectangle();
    crosshairV.width = "2px";
    crosshairV.height = "100px";
    crosshairV.color = "#00FFCC";
    crosshairV.background = "#00FFCC";
    ui.addControl(crosshairV);

    const crosshairH = new Rectangle();
    crosshairH.width = "100px";
    crosshairH.height = "2px";
    crosshairH.color = "#00FFCC";
    crosshairH.background = "#00FFCC";
    ui.addControl(crosshairH);

    // Texto de información
    const infoText = new TextBlock();
    infoText.text = "TELESCOPIO ACTIVO\nBusca los 3 planetas...";
    infoText.color = "#00FFCC";
    infoText.fontSize = 18;
    infoText.fontFamily = "Courier New";
    infoText.top = "-220px";
    ui.addControl(infoText);

    // 2. SIMULADOR DE GIROSCOPIO PARA PC
    // Ya que estamos en PC, proveemos controles deslizantes para simular el celular
    const panel = new StackPanel();
    panel.width = "300px";
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    panel.left = "20px";
    panel.top = "-20px";
    panel.background = "rgba(0,0,0,0.7)";
    ui.addControl(panel);

    const simTitle = new TextBlock();
    simTitle.text = "Simulador de Celular (PC)";
    simTitle.height = "30px";
    simTitle.color = "white";
    panel.addControl(simTitle);

    // Variables de estado del dispositivo simulado
    let alpha = 0; // Rotación Z (brújula)
    let beta = 0;  // Rotación X (inclinación adelante/atrás)
    let gamma = 0; // Rotación Y (inclinación izquierda/derecha)

    const dispatchEvent = () => {
        // Disparar evento falso de orientación para engañar a la DeviceOrientationCamera
        const event = new Event('deviceorientation') as any;
        event.alpha = alpha;
        event.beta = beta;
        event.gamma = gamma;
        window.dispatchEvent(event);
    };

    const addSlider = (name: string, min: number, max: number, onChange: (val: number) => void) => {
        const header = new TextBlock();
        header.text = name;
        header.height = "20px";
        header.color = "cyan";
        panel.addControl(header);

        const slider = new Slider();
        slider.minimum = min;
        slider.maximum = max;
        slider.value = 0;
        slider.height = "20px";
        slider.width = "200px";
        slider.color = "cyan";
        slider.background = "gray";
        slider.onValueChangedObservable.add(function(value) {
            onChange(value);
            dispatchEvent();
        });
        panel.addControl(slider);
    };

    // Alpha (0 a 360)
    addSlider("Girar Izq/Der (Alpha)", 0, 360, (v) => alpha = v);
    // Beta (-180 a 180)
    addSlider("Inclinar Arriba/Abajo (Beta)", -180, 180, (v) => beta = v);
    // Gamma (-90 a 90)
    addSlider("Rotar Pantalla (Gamma)", -90, 90, (v) => gamma = v);
}
