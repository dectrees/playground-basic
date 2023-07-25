import { Vector3, Color3, Engine, Scene, ArcRotateCamera, HemisphericLight, CreateGround, MeshBuilder, Color4 } from "@babylonjs/core";
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
        this.test(this.scene);
    }
    private createCamera(scene: Scene) {
        var camera = new ArcRotateCamera("camera", -Math.PI/4, Math.PI/3, 15, Vector3.Zero(), scene);
        camera.lowerRadiusLimit = 9;
        camera.upperRadiusLimit = 50;
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

    private test(scene:Scene)
    {
        var box = MeshBuilder.CreateBox("box", {
            size: 2,
            faceColors: [
                new Color4(1, 0, 0, 1), // 前面（前面颜色为红色）
                new Color4(0, 1, 0, 1), // 右面（右面颜色为绿色）
                new Color4(0, 0, 1, 1), // 左面（左面颜色为蓝色）
                new Color4(1, 1, 0, 1), // 上面（上面颜色为黄色）
                new Color4(1, 0, 1, 1), // 下面（下面颜色为紫色）
                new Color4(0, 1, 1, 1), // 后面（后面颜色为青色）
            ],
        }, scene);
        box.position.y += 1;
    }


}

new Game()
