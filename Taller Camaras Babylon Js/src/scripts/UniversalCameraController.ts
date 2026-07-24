import { UniversalCamera } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, TextBlock, Control } from "@babylonjs/gui";

export default class UniversalCameraController extends UniversalCamera {
    private _uiTexture!: AdvancedDynamicTexture;

    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    protected constructor() { }

    /**
     * Called on the scene starts.
     */
    public onStart(): void {
        const scene = this.getScene();
        const engine = scene.getEngine();
        const canvas = engine.getRenderingCanvas();
        
        if (canvas) {
            // 1. Activar controles de la cámara
            this.attachControl(canvas, true);
        }

        // 2. Asegurarse que la gravedad y colisiones estén activas
        this.applyGravity = true;
        this.checkCollisions = true;

        // 3. Crear la UI Minimalista
        this.createUI();
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        // Aquí puedes agregar lógica adicional por cada frame
    }

    private createUI(): void {
        // Crear textura a pantalla completa
        this._uiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI_Universal");

        // Panel de fondo con estilo Sci-Fi
        const panel = new Rectangle();
        panel.width = "300px";
        panel.height = "90px";
        panel.cornerRadius = 10;
        panel.color = "#00FFFF";
        panel.thickness = 2;
        panel.background = "rgba(0, 10, 30, 0.8)";
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        panel.top = "-20px";
        panel.left = "-20px";
        this._uiTexture.addControl(panel);

        // Texto de Instrucciones
        const instructions = new TextBlock();
        instructions.text = "SISTEMA DE MANTENIMIENTO\n------------------------\n[W][A][S][D]: Moverse\n[Mouse]: Mirar";
        instructions.color = "white";
        instructions.fontSize = 14;
        instructions.fontFamily = "Courier New"; 
        panel.addControl(instructions);
    }
}
