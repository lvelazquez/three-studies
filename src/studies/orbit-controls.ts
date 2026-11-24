import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createCube } from "../lib/cube";
import {
  CAMERA_FAR, CAMERA_FOV_DEG, CAMERA_NEAR, CAMERA_START_Z,
  COLOR_LIGHT, LIGHT_INTENSITY, LIGHT_START_POSITION, SPIN_RATE,
} from "../lib/constants";
import { Stage } from "../lib/stage";
import { bindPauseControls, getEl } from "../lib/ui";

const LIGHT_HELPER_SIZE = 1;
const LIGHT_RANGE = 10;
const LIGHT_INTENSITY_MAX = 10;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const SLIDER_STEP = 0.1;

const canvas = getEl<HTMLCanvasElement>("scene");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CAMERA_FOV_DEG, 1, CAMERA_NEAR, CAMERA_FAR);
camera.position.z = CAMERA_START_Z;

const light = new THREE.DirectionalLight(COLOR_LIGHT, LIGHT_INTENSITY);
light.position.set(...LIGHT_START_POSITION);
const helper = new THREE.DirectionalLightHelper(light, LIGHT_HELPER_SIZE);
scene.add(light, helper);

const cube = createCube();
scene.add(cube);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.listenToKeyEvents(canvas);

const stage = new Stage({
  canvas, scene, camera,
  label: "A green cube you can orbit with mouse, touch or arrow keys; light and camera are adjustable in the settings panel",
  content: {
    update(dt) {
      cube.rotation.y += dt * SPIN_RATE;
      controls.update();
    },
    dispose() {
      controls.dispose();
      gui.destroy();
    },
  },
});
controls.addEventListener("change", stage.requestRender);

const params = {
  lightColor: `#${new THREE.Color(COLOR_LIGHT).getHexString()}`,
  showHelper: true,
};
const gui = new GUI({ title: "Settings" });
const onChange = () => { helper.update(); stage.requestRender(); };

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera, "zoom", ZOOM_MIN, ZOOM_MAX, SLIDER_STEP).onChange(() => {
  camera.updateProjectionMatrix();
  stage.requestRender();
});

const lightFolder = gui.addFolder("Light");
lightFolder.add(light, "intensity", 0, LIGHT_INTENSITY_MAX, SLIDER_STEP).onChange(onChange);
for (const axis of ["x", "y", "z"] as const) {
  lightFolder.add(light.position, axis, -LIGHT_RANGE, LIGHT_RANGE, SLIDER_STEP).onChange(onChange);
}
lightFolder.addColor(params, "lightColor").onChange((v: string) => {
  light.color.set(v);
  onChange();
});
lightFolder.add(params, "showHelper").name("show helper").onChange((v: boolean) => {
  helper.visible = v;
  onChange();
});

bindPauseControls(stage, getEl<HTMLButtonElement>("pause"), canvas);

if (import.meta.hot) import.meta.hot.dispose(() => stage.dispose());
