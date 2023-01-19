

import * as THREE from "three";

export class Cube extends THREE.Mesh {
    
    
    constructor(w: number = 1, h: number = 1, depth: number = 1) {
        const geometry = new THREE.BoxGeometry(w, h, depth);
        const material = new THREE.MeshPhongMaterial({color: 0x44aa88 });                
        super(geometry, material);            

    }


}