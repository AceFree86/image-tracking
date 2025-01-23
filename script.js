import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MindARThree } from "mindar-image-three";

const mindarThree = new MindARThree({
  container: document.querySelector("#container"),
  imageTargetSrc:
    "https://acefree86.github.io/image-tracking/assets/Image/targets.mind",
});

const { renderer, scene, camera } = mindarThree;
const anchor = mindarThree.addAnchor(0);

const loader = new GLTFLoader();
loader.load(
  "https://acefree86.github.io/image-tracking/assets/models/box.gltf",
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    anchor.group.add(model);
  },
  (xhr) => {
    console.log(`Model ${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`);
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

const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", () => {
  start();
});

const stopButton = document.querySelector("#stopButton");
stopButton.addEventListener("click", () => {
  mindarThree.stop();
  mindarThree.renderer.setAnimationLoop(null);
});
