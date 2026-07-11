import * as BABYLON from '@babylonjs/core';

export function buildHouse(scene: BABYLON.Scene, shadowGenerator: BABYLON.ShadowGenerator) {
    // Materiales PBR
    const wallMaterial = new BABYLON.PBRMaterial("wallMat", scene);
    wallMaterial.albedoColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    wallMaterial.metallic = 0.1;
    wallMaterial.roughness = 0.9;

    const floorMaterial = new BABYLON.PBRMaterial("floorMat", scene);
    floorMaterial.albedoColor = new BABYLON.Color3(0.3, 0.2, 0.15); // Madera oscura
    floorMaterial.metallic = 0.05;
    floorMaterial.roughness = 0.5;

    const patioMaterial = new BABYLON.PBRMaterial("patioMat", scene);
    patioMaterial.albedoColor = new BABYLON.Color3(0.4, 0.4, 0.4); // Concreto
    patioMaterial.metallic = 0.1;
    patioMaterial.roughness = 0.8;

    // Helper para configurar mallas
    const setupMesh = (mesh: BABYLON.Mesh, material: BABYLON.Material) => {
        mesh.material = material;
        mesh.checkCollisions = true;
        mesh.receiveShadows = true;
        shadowGenerator.addShadowCaster(mesh);
    };

    // 1. Piso Principal (Patio y Casa)
    // Hacemos el piso (patio) gigantesco (500x500) para evitar caer al vacío
    const patio = BABYLON.MeshBuilder.CreateBox("patio", { width: 500, height: 0.5, depth: 500 }, scene);
    patio.position.y = 0.25;
    setupMesh(patio, patioMaterial);

    // Piso Interior Casa (10x10)
    const floor1 = BABYLON.MeshBuilder.CreateBox("floor1", { width: 12, height: 0.6, depth: 12 }, scene);
    floor1.position = new BABYLON.Vector3(0, 0.3, 0);
    setupMesh(floor1, floorMaterial);

    // 2. Paredes Planta 1
    const wallHeight = 4;
    const wallThickness = 0.5;

    const wall1 = BABYLON.MeshBuilder.CreateBox("wall1", { width: 12, height: wallHeight, depth: wallThickness }, scene);
    wall1.position = new BABYLON.Vector3(0, wallHeight/2 + 0.6, 6 - wallThickness/2);
    setupMesh(wall1, wallMaterial);

    const wall2a = BABYLON.MeshBuilder.CreateBox("wall2a", { width: 4.5, height: wallHeight, depth: wallThickness }, scene);
    wall2a.position = new BABYLON.Vector3(-3.75, wallHeight/2 + 0.6, -6 + wallThickness/2);
    setupMesh(wall2a, wallMaterial);

    const wall2b = BABYLON.MeshBuilder.CreateBox("wall2b", { width: 4.5, height: wallHeight, depth: wallThickness }, scene);
    wall2b.position = new BABYLON.Vector3(3.75, wallHeight/2 + 0.6, -6 + wallThickness/2);
    setupMesh(wall2b, wallMaterial);

    const wall2c = BABYLON.MeshBuilder.CreateBox("wall2c", { width: 3, height: 1, depth: wallThickness }, scene);
    wall2c.position = new BABYLON.Vector3(0, wallHeight - 0.5 + 0.6, -6 + wallThickness/2);
    setupMesh(wall2c, wallMaterial);

    const wall3 = BABYLON.MeshBuilder.CreateBox("wall3", { width: wallThickness, height: wallHeight, depth: 12 }, scene);
    wall3.position = new BABYLON.Vector3(-6 + wallThickness/2, wallHeight/2 + 0.6, 0);
    setupMesh(wall3, wallMaterial);

    const wall4 = BABYLON.MeshBuilder.CreateBox("wall4", { width: wallThickness, height: wallHeight, depth: 12 }, scene);
    wall4.position = new BABYLON.Vector3(6 - wallThickness/2, wallHeight/2 + 0.6, 0);
    setupMesh(wall4, wallMaterial);

    // 3. Techo Planta 1 / Piso Planta 2
    const floor2 = BABYLON.MeshBuilder.CreateBox("floor2", { width: 12, height: 0.5, depth: 12 }, scene);
    floor2.position = new BABYLON.Vector3(0, wallHeight + 0.6 + 0.25, 0);
    setupMesh(floor2, floorMaterial);

    // 4. Escaleras hacia la segunda planta
    const stairWidth = 2;
    const steps = 22; // Escalones
    const stairTotalHeight = 4.5; // (Desde el piso 1 (0.6) al piso 2 (5.1))
    const stepHeight = stairTotalHeight / steps;
    const stepDepth = 0.3; // Profundidad de cada escalón

    for (let i = 0; i < steps; i++) {
        const step = BABYLON.MeshBuilder.CreateBox(`step${i}`, { width: stairWidth, height: stepHeight, depth: stepDepth }, scene);
        step.position = new BABYLON.Vector3(6 + stairWidth/2, 0.6 + stepHeight/2 + (i * stepHeight), 5 - (i * stepDepth));
        setupMesh(step, patioMaterial);
    }

    // Plataforma de descanso (Landing) al final de la escalera para conectar con el segundo piso
    const landing = BABYLON.MeshBuilder.CreateBox("landing", { width: stairWidth, height: 0.5, depth: 3 }, scene);
    landing.position = new BABYLON.Vector3(6 + stairWidth/2, 4.85, 5 - (steps * stepDepth) - 1.5 + stepDepth);
    setupMesh(landing, patioMaterial);

    // 5. Paredes Planta 2
    const p2Size = 8;

    const wall5 = BABYLON.MeshBuilder.CreateBox("wall5", { width: p2Size, height: wallHeight, depth: wallThickness }, scene);
    wall5.position = new BABYLON.Vector3(-2, wallHeight*1.5 + 1.1, 6 - wallThickness/2);
    setupMesh(wall5, wallMaterial);

    const wall6 = BABYLON.MeshBuilder.CreateBox("wall6", { width: p2Size, height: wallHeight, depth: wallThickness }, scene);
    wall6.position = new BABYLON.Vector3(-2, wallHeight*1.5 + 1.1, -2);
    setupMesh(wall6, wallMaterial);

    const wall7 = BABYLON.MeshBuilder.CreateBox("wall7", { width: wallThickness, height: wallHeight, depth: p2Size }, scene);
    wall7.position = new BABYLON.Vector3(-6 + wallThickness/2, wallHeight*1.5 + 1.1, 2);
    setupMesh(wall7, wallMaterial);

    const wall8 = BABYLON.MeshBuilder.CreateBox("wall8", { width: wallThickness, height: wallHeight, depth: p2Size }, scene);
    wall8.position = new BABYLON.Vector3(2 - wallThickness/2, wallHeight*1.5 + 1.1, 2);
    setupMesh(wall8, wallMaterial);

    // Techo Final
    const roof = BABYLON.MeshBuilder.CreateBox("roof", { width: p2Size, height: 0.5, depth: p2Size }, scene);
    roof.position = new BABYLON.Vector3(-2, wallHeight*2 + 1.35, 2);
    setupMesh(roof, floorMaterial);

    // Luces Interiores
    const pointLight1 = new BABYLON.PointLight("pointLight1", new BABYLON.Vector3(0, 3, 0), scene);
    pointLight1.diffuse = new BABYLON.Color3(1, 0.8, 0.5);
    pointLight1.intensity = 2; // Mayor intensidad para PBR

    const pointLight2 = new BABYLON.PointLight("pointLight2", new BABYLON.Vector3(-2, 7, 2), scene);
    pointLight2.diffuse = new BABYLON.Color3(1, 0.8, 0.5);
    pointLight2.intensity = 2;

    const spotLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(2, 6, -1), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 2, scene);
    spotLight.diffuse = new BABYLON.Color3(1, 1, 1);
    spotLight.intensity = 5;
    
    // Configurar sombras para el spotlight
    const spotShadows = new BABYLON.ShadowGenerator(1024, spotLight);
    spotShadows.useBlurExponentialShadowMap = true;
    spotShadows.blurKernel = 32;
    
    // Retornamos el array de luces y generadores si el main.ts lo necesita
    return { spotShadows };
}
