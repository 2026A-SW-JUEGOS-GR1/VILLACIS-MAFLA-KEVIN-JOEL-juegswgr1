import './style.css';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { buildHouse } from './house';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

const createScene = async function () {
    const scene = new BABYLON.Scene(engine);
    
    // Configurar color de fondo oscuro (Atmósfera nocturna)
    scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.05, 1);
    
    // Configurar Niebla (Fog) para crear la ilusión de horizonte infinito
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.01; // Ajusta este valor para hacer la niebla más espesa o ligera
    scene.fogColor = new BABYLON.Color3(0.02, 0.02, 0.05); // Debe coincidir con el clearColor
    
    // Añadir GlowLayer para el efecto neón
    const gl = new BABYLON.GlowLayer("glow", scene);
    gl.intensity = 1.0;

    // Habilitar sistema de colisiones nativo
    scene.collisionsEnabled = true;

    // Luz Ambiental y Luz Direccional Principal (Luna)
    const ambientLight = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.5;
    ambientLight.diffuse = new BABYLON.Color3(0.2, 0.2, 0.4);
    ambientLight.groundColor = new BABYLON.Color3(0.1, 0.1, 0.2);

    // Luna Gigante en el Cielo (Brillo Celeste)
    const moon = BABYLON.MeshBuilder.CreateSphere("moon", {diameter: 20}, scene);
    // Posicionada más baja en el horizonte y más lejos para que se vea siempre
    moon.position = new BABYLON.Vector3(80, 40, 150);
    const moonMat = new BABYLON.PBRMaterial("moonMat", scene);
    moonMat.albedoColor = new BABYLON.Color3(0, 0, 0);
    moonMat.emissiveColor = new BABYLON.Color3(0, 1, 0.8);
    moonMat.emissiveIntensity = 3;
    moon.material = moonMat;

    // Luz Direccional Principal (Emitiendo desde la Luna)
    // Calculamos la dirección exacta desde la luna hacia el centro (0,0,0)
    const dirLightDirection = new BABYLON.Vector3(-80, -40, -150).normalize();
    const dirLight = new BABYLON.DirectionalLight("dirLight", dirLightDirection, scene);
    dirLight.position = moon.position;
    dirLight.intensity = 2.0; // Luz fuerte para iluminar bien la escena
    dirLight.diffuse = new BABYLON.Color3(0.5, 0.9, 1.0); // Celeste

    // Usamos CascadedShadowGenerator en lugar de ShadowGenerator normal
    // Esto evita la "división" cuadrada oscura en el suelo al calcular las sombras basado en la cámara
    const shadowGenerator = new BABYLON.CascadedShadowGenerator(2048, dirLight);
    shadowGenerator.usePercentageCloserFiltering = true;

    // Construir la casa procedural (se le pasa el shadowGenerator para agregar las mallas)
    const { spotShadows } = buildHouse(scene, shadowGenerator);

    // Cargar el personaje
    const result = await BABYLON.SceneLoader.ImportMeshAsync("", "/models/batman/", "scene.gltf", scene);
    
    const avatar = result.meshes[0];
    avatar.scaling = new BABYLON.Vector3(1, 1, 1);
    
    // Añadir el avatar a las sombras
    result.meshes.forEach(m => {
        shadowGenerator.addShadowCaster(m);
        spotShadows.addShadowCaster(m);
        m.receiveShadows = true;
    });

    // Animaciones y Blending
    let idleAnim: BABYLON.AnimationGroup | null = null;
    let walkAnim: BABYLON.AnimationGroup | null = null;
    
    if (result.animationGroups.length > 0) {
        idleAnim = result.animationGroups.find(ag => ag.name.toLowerCase().includes("idle")) || result.animationGroups[0];
        walkAnim = result.animationGroups.find(ag => ag.name.toLowerCase().includes("walk") || ag.name.toLowerCase().includes("run")) || (result.animationGroups.length > 1 ? result.animationGroups[1] : idleAnim);
        
        result.animationGroups.forEach(ag => {
            ag.stop();
            // Habilitar blending (transición suave)
            ag.enableBlending = true;
            ag.blendingSpeed = 0.1;
        });
        
        if (idleAnim) idleAnim.play(true);
    }

    // Crear un elipsoide invisible para las colisiones del personaje
    const collider = BABYLON.MeshBuilder.CreateCapsule("collider", {height: 1.8, radius: 0.4}, scene);
    // Aparecer en el patio frontal, justo sobre el nivel del suelo (y = 1.4)
    collider.position = new BABYLON.Vector3(0, 1.4, -12); 
    collider.visibility = 0; 
    collider.checkCollisions = true;
    collider.isPickable = false; // Importante para que el Raycast no choque consigo mismo
    collider.ellipsoid = new BABYLON.Vector3(0.4, 0.9, 0.4);
    collider.ellipsoidOffset = new BABYLON.Vector3(0, 0, 0); // Sin desfase, el pivote ya está en el centro

    // Emparentar el modelo visual al collider
    avatar.parent = collider;
    // Bajamos el modelo 0.9 unidades para que los pies queden exactamente en el fondo de la cápsula
    avatar.position.y = -0.9; 
    
    // Ya no usamos la luz puntual aquí abajo, la luna gigante iluminará desde arriba
    
    // Configurar ArcRotateCamera (Cámara 3ra Persona Controlable)
    // Cambiamos alpha a -Math.PI / 2 para que inicie detrás del personaje (z negativo)
    const camera = new BABYLON.ArcRotateCamera("ArcCamera", -Math.PI / 2, Math.PI / 2.5, 12, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 15;
    camera.lockedTarget = collider; // Sigue al collider
    // Ajustar offset para mirar a la altura de la cabeza
    camera.targetScreenOffset = new BABYLON.Vector2(0, -1);
    
    // Sistema de cámara interior/exterior: la cámara chocará con paredes, pero se acercará sola al entrar
    camera.checkCollisions = true;
    camera.collisionRadius = new BABYLON.Vector3(0.1, 0.1, 0.1);

    // Controles de Movimiento WASD
    const inputMap: { [key: string]: boolean } = {};
    scene.actionManager = new BABYLON.ActionManager(scene);
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key.toLowerCase()] = evt.sourceEvent.type == "keydown";
    }));
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key.toLowerCase()] = evt.sourceEvent.type == "keydown";
    }));

    // Lógica del movimiento en el render loop
    const speed = 0.08;
    const rotationSpeed = 0.15;
    const gravity = -0.15; // Fuerza constante de gravedad

    scene.onBeforeRenderObservable.add(() => {
        let isMoving = false;

        // Movimiento relativo a la cámara
        const forward = camera.getDirection(new BABYLON.Vector3(0, 0, 1));
        forward.y = 0;
        forward.normalize();

        const right = camera.getDirection(new BABYLON.Vector3(1, 0, 0));
        right.y = 0;
        right.normalize();

        let moveDirection = new BABYLON.Vector3(0, 0, 0);

        if (inputMap["w"] || inputMap["arrowup"]) {
            moveDirection.addInPlace(forward.scale(speed));
            isMoving = true;
        }
        if (inputMap["s"] || inputMap["arrowdown"]) {
            moveDirection.subtractInPlace(forward.scale(speed));
            isMoving = true;
        }
        if (inputMap["a"] || inputMap["arrowleft"]) {
            moveDirection.subtractInPlace(right.scale(speed));
            isMoving = true;
        }
        if (inputMap["d"] || inputMap["arrowright"]) {
            moveDirection.addInPlace(right.scale(speed));
            isMoving = true;
        }

        if (isMoving) {
            // Rotar el modelo suavemente hacia la dirección del movimiento
            const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
            // Asegurar interpolación correcta en los 360 grados
            let diff = targetRotation - collider.rotation.y;
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));
            collider.rotation.y += diff * rotationSpeed;
            
            // Animación
            if (walkAnim && !walkAnim.isPlaying) {
                if (idleAnim) idleAnim.stop();
                walkAnim.play(true);
            }
        } else {
            if (idleAnim && !idleAnim.isPlaying) {
                if (walkAnim) walkAnim.stop();
                idleAnim.play(true);
            }
        }

        // Raycast hacia abajo para verificar si estamos en el suelo o en una escalera
        const ray = new BABYLON.Ray(collider.position, new BABYLON.Vector3(0, -1, 0), 1.2);
        // Filtramos para ignorar el collider del jugador
        const hit = scene.pickWithRay(ray, (mesh) => mesh.name !== "collider");
        
        // Si no nos estamos moviendo con el teclado y estamos en el suelo, quitamos la gravedad para no resbalar
        if (!isMoving && hit && hit.hit) {
            moveDirection.y = -0.001; // Gravedad casi nula para mantener estado "grounded" sin resbalar
        } else {
            // Aplicar gravedad normal cuando nos movemos o estamos en el aire
            moveDirection.y = gravity;
        }
        
        // Mover con colisiones
        collider.moveWithCollisions(moveDirection);

        // --- SISTEMA DE CÁMARA INTERIOR / EXTERIOR ---
        // Determinar si el personaje está dentro de la casa
        // La casa está entre x: -6 a 6, z: -6 a 6. El primer piso llega hasta y: 4.5
        const isInside = (collider.position.x > -5.5 && collider.position.x < 5.5 && 
                          collider.position.z > -5.5 && collider.position.z < 5.5 &&
                          collider.position.y < 5);
        
        // Si está adentro, queremos un zoom cercano (radio 3.5). Si está afuera, visión amplia (radio 12)
        const targetRadius = isInside ? 3.5 : 12;
        
        // Interpolar suavemente el radio actual hacia el objetivo
        camera.radius = BABYLON.Scalar.Lerp(camera.radius, targetRadius, 0.04);
        
        // También podemos ajustar el ángulo vertical para que adentro mire más de frente y no choque con el techo
        const targetBeta = isInside ? Math.PI / 2.1 : Math.PI / 2.5;
        camera.beta = BABYLON.Scalar.Lerp(camera.beta, targetBeta, 0.04);
    });

    return scene;
};

createScene().then(scene => {
    engine.runRenderLoop(function () {
        scene.render();
    });
});

window.addEventListener('resize', function () {
    engine.resize();
});
