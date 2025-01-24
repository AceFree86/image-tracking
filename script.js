import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  const mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc:"https://acefree86.github.io/image-tracking-2/assets/Image/targets.mind",});

  const { renderer, scene, camera } = mindarThree;

  let group;

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.position.set(10, 15, 10);
  scene.add(directionalLight);

  const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
  scene.add(ambient);

  const light = new THREE.DirectionalLight();
  light.position.set(0.2, 1, 1);
  scene.add(light);

var horizontalFov = 90;
camera.fov =
  (Math.atan(Math.tan(((horizontalFov / 2) * Math.PI) / 180) / camera.aspect) *
    2 *
    180) /
  Math.PI;

  group = new THREE.Group();
  scene.add(group);

  const anchor = mindarThree.addAnchor(0);

  const url =
    "https://acefree86.github.io/image-tracking/assets/models/box2.gltf";
  const loader = new GLTFLoader();
  const errorDisplay = document.querySelector("#error-message");

  loader.load(url,(gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);
      group.add(model);
    },
    (xhr) => {
      errorDisplay.textContent = "loaded";
      console.log(
        `Model ${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`
      );
    },
    (error) => {
      errorDisplay.textContent = `Error: ${JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      )}`;
    }
  );
  anchor.group.add(group);

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
