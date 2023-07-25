import { Vector3, Color3, Engine, Scene, ArcRotateCamera, HemisphericLight, CreateGround, MeshBuilder, StandardMaterial, PointerEventTypes, Mesh, Nullable } from "@babylonjs/core";
import './index.css';


export default class Game {
    engine: Engine;
    scene: Scene;
    camera;
    canvas: HTMLCanvasElement;

    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.id = "gameCanvas";
        document.body.appendChild(this.canvas);
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);
        this.camera = this.createCamera(this.scene);
        this.createEnvironment(this.scene);
        this.engine.runRenderLoop(
            () => {
                this.scene.render();
            }
        );
        this.registerPointerHandler();
    }
    private createCamera(scene: Scene) {
        var camera = new ArcRotateCamera("camera", 0, 0, 0, Vector3.Zero(), scene);
        camera.lowerRadiusLimit = 9;
        camera.upperRadiusLimit = 50;
        camera.setPosition(new Vector3(0, 2, -10));
        camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
        return camera;
    }

    private createEnvironment(scene: Scene) {

        //light
        const light = new HemisphericLight("light", new Vector3(0.5, 1, 0), scene);
        light.intensity = 0.7;
        scene.ambientColor = new Color3(0.3, 0.3, 0.3);

        //ground
        CreateGround("ground", { width: 50, height: 50 });
        return scene;
    }
    // a local axis system to help you in need
    private localAxes(size: number): Mesh {
        var pilot_local_axisX = Mesh.CreateLines("pilot_local_axisX", [
            Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
            new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
        ], this.scene, false);
        pilot_local_axisX.color = new Color3(1, 0, 0);

        var pilot_local_axisY = Mesh.CreateLines("pilot_local_axisY", [
            Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
            new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
        ], this.scene, false);
        pilot_local_axisY.color = new Color3(0, 1, 0);

        var pilot_local_axisZ = Mesh.CreateLines("pilot_local_axisZ", [
            Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
            new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
        ], this.scene, false);
        pilot_local_axisZ.color = new Color3(0, 0, 1);

        var local_origin = MeshBuilder.CreateBox("local_origin", { size: 1 }, this.scene);
        local_origin.isVisible = false;

        pilot_local_axisX.parent = local_origin;
        pilot_local_axisY.parent = local_origin;
        pilot_local_axisZ.parent = local_origin;

        return local_origin;

    }
    // an asymmetricall object  to help you not lost your direction
    private asymmetry(scene: Scene): Nullable<Mesh> {
        var body = MeshBuilder.CreateCylinder("body", { height: 1, diameterTop: 0.2, diameterBottom: 0.5, tessellation: 6, subdivisions: 1 }, scene);
        var arm = MeshBuilder.CreateBox("arm", { height: 1, width: 0.3, depth: 0.1875 }, scene);
        arm.position.x = 0.125;
        var pilot = Mesh.MergeMeshes([body, arm], true);
        return pilot;
    }
    //combined an asymmetrical obect with axis
    private asymmetryWithAxis(scene:Scene):Nullable<Mesh>
    {
        var localOrigin = this.localAxes(1);
        var asymmetricalObject = this.asymmetry(scene);
        localOrigin.parent = asymmetricalObject;
        var material = new StandardMaterial("m", scene);
        material.diffuseColor = new Color3(1, 0, 5);
        if(asymmetricalObject)
        {
            asymmetricalObject.material = material;
            asymmetricalObject.position.y += 0.5;
        }
        return asymmetricalObject;
    }


    private isPointerDown: boolean = false;
    private registerPointerHandler() {
  
        var obj = this.asymmetryWithAxis(this.scene);
        this.scene.onPointerObservable.add((eventData) => {
            if (eventData.type === PointerEventTypes.POINTERDOWN) {
                this.isPointerDown = true;
            }
            else if (eventData.type === PointerEventTypes.POINTERMOVE) {
                if (this.isPointerDown) {
                    const a1 = this.camera.alpha;
                    if(obj) obj.rotation.y = -Math.PI / 2 - a1;
                }
            }
            else if (eventData.type === PointerEventTypes.POINTERUP) {
                this.isPointerDown = false;
            }
        });

    }


}

new Game()
