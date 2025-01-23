import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  const mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc:
      "https://acefree86.github.io/image-tracking/assets/Image/targets.mind",
  });

  const { renderer, scene, camera } = mindarThree;
  const anchor = mindarThree.addAnchor(0);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.5,
  });

  const box = new THREE.Mesh(geometry, material);
  anchor.group.add(box);

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
