import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { loadHtml2Canvas, takeScreenshot } from "js/screenshot";

document.addEventListener("DOMContentLoaded", () => {
  const mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc:
      "https://acefree86.github.io/image-tracking/assets/Image/targetsA.mind",
    filterMinCF: 0.1, // Reduce jittering (default is 0.001)
    filterBeta: 10, // Reduce delay (default is 1000)
    warmupTolerance: 1, // Faster target detection (default is 5)
    missTolerance: 1, // Faster target lost detection (default is 5)
  });

  const { renderer, scene, camera } = mindarThree;

  const control = document.querySelector("#control");
  const startButton = document.querySelector("#startButton");
  const errorDisplay = document.querySelector("#error-message");
  const screenshotButton = document.getElementById("screenshotButton");

  let isRunning = false;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight1.position.set(5, 5, 5);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-5, -5, 5);
  scene.add(directionalLight2);

  const groupM = new THREE.Group();

  // Load the GLTF model
  const url =
    "https://acefree86.github.io/image-tracking/assets/models/Cake.glb";
  const loader = new GLTFLoader();

  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0); // Reset rotation
      model.scale.set(1, 1, 1);
      groupM.add(model);
    },
    (xhr) => {
      if (errorDisplay) {
        errorDisplay.textContent = "Model loaded successfully";
      }
      console.log(
        `Model ${Math.round((xhr.loaded / xhr.total) * 100)}% loaded`
      );
    },
    (error) => {
      if (errorDisplay) {
        errorDisplay.textContent = `Error: ${error.message}`;
      }
    }
  );
  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(groupM);

  // Start AR
  const start = async () => {
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
    isRunning = true;
    startButton.textContent = "Стоп";
  };

  // Stop AR
  const stop = () => {
    mindarThree.stop();
    renderer.setAnimationLoop(null);
    isRunning = false;
    startButton.textContent = "Старт";
  };

  // Add an event listener for visibility change
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Stop mindarThree when the page becomes inactive
      mindarThree.stop();
      renderer.setAnimationLoop(null);
    }
  });

  // Toggle AR on Button Click
  startButton.addEventListener("click", () => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  });

  screenshotButton.addEventListener("click", () => {
    if (screenshotButton) {
      screenshotButton.addEventListener("click", () => {
        loadHtml2Canvas(() => {
          takeScreenshot(control);
        });
      });
    } else {
      console.error("Screenshot button not found!");
    }
  });
});
