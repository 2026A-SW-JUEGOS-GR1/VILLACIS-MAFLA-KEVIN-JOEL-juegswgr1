"use client";

import { useEffect, useRef, useState } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";

import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Physics";
import "@babylonjs/core/Cameras/universalCamera";
import "@babylonjs/core/Meshes/groundMesh";
import "@babylonjs/core/Lights/directionalLight";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Materials/PBR/pbrMaterial";
import "@babylonjs/core/Materials/standardMaterial";

import { createPhase1Scene } from "../projects/Phase1";
import { createPhase2Scene } from "../projects/Phase2";
import { createPhase3Scene } from "../projects/Phase3";
import { createPhase4Scene } from "../projects/Phase4";
import { createPhase5Scene } from "../projects/Phase5";

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const sceneRef = useRef<Scene | null>(null);
    const [currentPhase, setCurrentPhase] = useState<number>(1);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Initialize Engine
        const engine = new Engine(canvasRef.current, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            adaptToDeviceRatio: true
        });
        engineRef.current = engine;

        const resizeListener = () => engine.resize();
        window.addEventListener("resize", resizeListener);

        // Load initial scene
        loadPhase(1);

        engine.runRenderLoop(() => {
            if (sceneRef.current) {
                sceneRef.current.render();
            }
        });

        return () => {
            window.removeEventListener("resize", resizeListener);
            if (sceneRef.current) sceneRef.current.dispose();
            engine.dispose();
        };
    }, []);

    const loadPhase = (phaseNumber: number) => {
        setCurrentPhase(phaseNumber);
        
        if (sceneRef.current) {
            sceneRef.current.dispose();
        }

        const engine = engineRef.current;
        const canvas = canvasRef.current;
        if (!engine || !canvas) return;

        switch (phaseNumber) {
            case 1:
                sceneRef.current = createPhase1Scene(engine, canvas);
                break;
            case 2: 
                sceneRef.current = createPhase2Scene(engine, canvas); 
                break;
            case 3: 
                sceneRef.current = createPhase3Scene(engine, canvas); 
                break;
            case 4: 
                sceneRef.current = createPhase4Scene(engine, canvas); 
                break;
            case 5: 
                sceneRef.current = createPhase5Scene(engine, canvas); 
                break;
            default:
                break;
        }
    };

    return (
        <main className="flex w-screen h-screen flex-row items-center justify-between bg-black">
            {/* UI Lateral para Portfolio */}
            <div className="w-64 h-full bg-gray-900 text-white p-6 flex flex-col shadow-2xl z-10 border-r border-blue-500">
                <h1 className="text-xl font-bold text-cyan-400 mb-6 tracking-wider">TALLER SCI-FI</h1>
                <p className="text-sm text-gray-400 mb-8">Selecciona un proyecto para cargar la cámara correspondiente.</p>
                
                <div className="flex flex-col gap-3">
                    {[1, 2, 3, 4, 5].map((phase) => (
                        <button 
                            key={phase}
                            onClick={() => loadPhase(phase)}
                            disabled={phase > 5} // Habilitado hasta la fase 5
                            className={`px-4 py-3 text-left rounded transition-colors ${
                                currentPhase === phase 
                                    ? "bg-blue-600 text-white font-semibold" 
                                    : phase > 5 
                                        ? "bg-gray-800 text-gray-600 cursor-not-allowed" 
                                        : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                            }`}
                        >
                            Fase {phase}
                        </button>
                    ))}
                </div>
            </div>

            {/* Canvas de BabylonJS */}
            <div className="flex-1 h-full relative">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full outline-none select-none block"
                />
            </div>
        </main>
    );
}
