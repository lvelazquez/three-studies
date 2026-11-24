import * as THREE from "three";
import { createCube } from "../lib/cube";
import {
  CAMERA_FAR, CAMERA_FOV_DEG, CAMERA_NEAR, CAMERA_START_Z,
  COLOR_LIGHT, LIGHT_INTENSITY, LIGHT_START_POSITION, SPIN_RATE,
} from "../lib/constants";
import { Stage } from "../lib/stage";
import { bindPauseControls, getEl } from "../lib/ui";

const canvas = getEl<HTMLCanvasElement>("scene");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(CAMERA_FOV_DEG, 1, CAMERA_NEAR, CAMERA_FAR);
camera.position.z = CAMERA_START_Z;

const light = new THREE.DirectionalLight(COLOR_LIGHT, LIGHT_INTENSITY);
light.position.set(...LIGHT_START_POSITION);
scene.add(light);

const cube = createCube();
scene.add(cube);

const stage = new Stage({
  canvas, scene, camera,
  label: "A green cube spinning in a lit 3D scene",
  content: {
    update(dt) {
      cube.rotation.x += dt * SPIN_RATE;
      cube.rotation.y += dt * SPIN_RATE;
    },
  },
});
bindPauseControls(stage, getEl<HTMLButtonElement>("pause"), canvas);

if (import.meta.hot) import.meta.hot.dispose(() => stage.dispose());
