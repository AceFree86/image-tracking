import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
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
}); // Red color
const box = new THREE.Mesh(geometry, material);
anchor.group.add(box);

const start = async () => {
  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};
const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", () => {
  start();
});
stopButton.addEventListener("click", () => {
  mindarThree.stop();
  mindarThree.renderer.setAnimationLoop(null);
});
