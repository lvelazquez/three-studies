import * as THREE from "three";
import { COLOR_CUBE } from "./constants";

export function createCube(size = 1): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshPhongMaterial({ color: COLOR_CUBE }),
  );
}
