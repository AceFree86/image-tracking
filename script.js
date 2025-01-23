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
      model.scale.set(2, 2, 2);
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

  const start = async () => {
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  document.querySelector("#startButton").addEventListener("click", start);
  document.querySelector("#stopButton").addEventListener("click", () => {
    mindarThree.stop();
    renderer.setAnimationLoop(null);
  });
});
