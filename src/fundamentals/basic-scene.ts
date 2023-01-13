import * as THREE from "three";

export function basicScene() {
    const app: HTMLDivElement = document.querySelector<HTMLDivElement>('#app')!;
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    app.appendChild(canvas);

    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({canvas});
    
    // Add camera
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    
    const scene: THREE.Scene = new THREE.Scene();    
    // Add Light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // Add mesh (geometry, material) 
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);    
    
    renderer.render(scene, camera);        

    function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render(time: number) {
      time *= 0.001;  // convert time to seconds

      if(resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix()
      }      

      cube.rotation.x = time;
      cube.rotation.y = time;
     
      renderer.render(scene, camera);
     
      window.requestAnimationFrame(render);

    }

    window.requestAnimationFrame(render);    

    
}  