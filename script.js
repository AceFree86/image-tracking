import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  const mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc:
      "https://acefree86.github.io/image-tracking-2/assets/Image/targets.mind",
  });

  const { renderer, scene, camera } = mindarThree;

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  const anchor = mindarThree.addAnchor(0);

  const url ="https://acefree86.github.io/image-tracking/assets/models/box.gltf";
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);
      anchor.group.add(model);
    },
    (xhr) => {
      console.log(
        `Model ${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`
      );
    },
    (error) => {
      console.error("An error occurred while loading the GLTF model:", error);
    }
  );

   const updateCameraPosition = (x, y, z) => {
     camera.position.set(x, y, z); // Adjust camera position
     camera.lookAt(new THREE.Vector3(0, 0, 0)); // Make the camera look at the center
     renderer.render(scene, camera); // Render the scene from the camera's perspective
   };

  const start = async () => {
    await mindarThree.start();

    updateCameraPosition(1, 1, 3);

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  document.querySelector("#startButton").addEventListener("click", start);
  document.querySelector("#stopButton").addEventListener("click", () => {
    mindarThree.stop();
    renderer.setAnimationLoop(null);
  });

   camera.position.set(0, 1, 3); // Camera is placed slightly above and behind the target
   camera.lookAt(new THREE.Vector3(0, 0, 0));
});
