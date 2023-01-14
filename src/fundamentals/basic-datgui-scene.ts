import * as THREE from "three";
import * as dat from 'dat.gui';
import { Cube } from "./cube";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface ICameraOptions {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  zoom: number;
  focus: number;
}

export interface IDirectionalLightOptions {
  color: number;
  intensity: number;
  x: number;
  y: number;
  z: number;
}

const cameraOptions: ICameraOptions = {
  fov: 75,
  aspect: 2,
  near: 0.1,
  far: 5,
  zoom: 1,
  focus: 30
};

const lightOptions: IDirectionalLightOptions = {
  color: 0xFFFFFF,
  intensity: 1,
  x: -1,
  y: 2,
  z: 4
}

export class DatGUIApp extends THREE.WebGLRenderer {

  private gui = new dat.GUI({ name: "My App" });  
  private camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
  private scene: THREE.Scene = new THREE.Scene();  
  private rafId: number | null = null;
  private cube = new Cube();
  private controls = new OrbitControls(this.camera, this.domElement);  

  constructor() {
    const app: HTMLDivElement = document.querySelector<HTMLDivElement>('#app')!;
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    app.appendChild(canvas);
    
    super({canvas});
    
    this.controls.enableDamping = true;
    
    this.initCamera();
    this.initLight();
    this.initCube();
    this.render(this.scene, this.camera);
    this.init();

  }
  
  public init() {
    this.rafId = window.requestAnimationFrame(this.loop);
  }

  private initCamera() {
    this.camera.position.z = 2;
    const cameraGui: dat.GUI = this.gui.addFolder("Camera");

    cameraGui.add(cameraOptions, "aspect", -10, 10, 0.1).onChange((value: number) => {
      this.camera.aspect = value;
      this.camera.updateProjectionMatrix();
    });
    
    cameraGui.add(cameraOptions, "zoom", -3, 3, 0.1).onChange((value: number) => {
      this.camera.zoom = value;
      this.camera.updateProjectionMatrix();
    });
  }

  private initLight() {    
    const light = new THREE.DirectionalLight(lightOptions.color, lightOptions.intensity);
    light.position.set(lightOptions.x, lightOptions.y, lightOptions.z);
    const lightGui = this.gui.addFolder("Light");
    lightGui.add(lightOptions, "intensity", 0,10,0.1).onChange((value)=> light.intensity = value);
    lightGui.add(lightOptions, "x", -10,10,0.1).onChange((value)=> light.position.setX(value));
    lightGui.add(lightOptions, "y", -10,10,0.1).onChange((value)=> light.position.setY(value));
    lightGui.add(lightOptions, "z", -10,10,0.1).onChange((value)=> light.position.setZ(value));
    lightGui.addColor(lightOptions, "color").onChange((value)=> light.color = (new THREE.Color(parseInt(value, 16))));
    this.scene.add(light);
  }

  private initCube() {    
    this.scene.add(this.cube);
  }

  private resizeRendererToDisplaySize() {
    const canvas = this.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      this.setSize(width, height, false);
    }
    return needResize;
  }

  private loop = (time: number) => {
    
    time *= 0.001;  // convert time to seconds

    if (this.resizeRendererToDisplaySize()) {
      const canvas = this.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix()
    }

    this.controls.update();

    this.render(this.scene, this.camera);

    window.requestAnimationFrame(this.loop);

  }
}