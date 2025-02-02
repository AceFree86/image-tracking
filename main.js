import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  const mindarThree = new MindARThree({
    container: document.querySelector("#container"),
    imageTargetSrc:
      "https://acefree86.github.io/image-tracking/assets/Image/targetsA.mind",
    filterMinCF: 0.1, // Reduce jittering
    filterBeta: 10, // Reduce delay
    warmupTolerance: 1, // Faster target detection
    missTolerance: 1, // Faster target lost detection
  });

  const { renderer, scene, camera } = mindarThree;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight1.position.set(5, 5, 5);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-5, -5, 5);
  scene.add(directionalLight2);

  // Model Group
  const groupM = new THREE.Group();

  // Select UI Elements
  const errorDisplay = document.querySelector("#error-message");
  const progressBar = document.querySelector("#progress-bar");

  if (!errorDisplay) {
    console.error("Error: #error-message element not found in the DOM.");
  }

  if (!progressBar) {
    console.error("Error: #progress-bar element not found in the DOM.");
  }

  // Load GLTF Model
  const url =
    "https://acefree86.github.io/image-tracking/assets/models/Cake.glb";
  const loader = new GLTFLoader();

  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      groupM.add(model);

      // Hide progress bar after loading
      if (progressBar) {
        progressBar.style.width = "100%";
        setTimeout(() => {
          progressBar.parentElement.style.display = "none";
        }, 300);
      }
    },
    (xhr) => {
      // Update Progress Bar
      if (progressBar && xhr.total > 0) {
        const percent = (xhr.loaded / xhr.total) * 100;
        progressBar.style.width = `${percent}%`;
      }
    },
    (error) => {
      if (errorDisplay) {
        errorDisplay.textContent = `Error: ${error.message}`;
      }
      console.error("Error loading model:", error);

      // Hide progress bar on error
      if (progressBar) {
        progressBar.parentElement.style.display = "none";
      }
    }
  );

  // Add anchor for AR tracking
  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(groupM);

  // Start AR
  const start = async () => {
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  // Stop AR
  const stop = () => {
    mindarThree.stop();
    renderer.setAnimationLoop(null);
  };

  // Event Listeners
  document.querySelector("#startButton").addEventListener("click", start);
  document.querySelector("#stopButton").addEventListener("click", stop);
});
