import * as THREE from "three";
import { MindARThree } from "mindar-image-three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#container");

  const mindarThree = new MindARThree({
    container,
    imageTargetSrc:
      "https://acefree86.github.io/image-tracking-2/assets/Image/targets.mind",
  });

  const width = window.innerWidth,
    height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
  camera.position.z = 1;
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();

  // Set the renderer size
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement); // Add the renderer canvas to the container

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight1.position.set(5, 5, 5);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-5, -5, 5);
  scene.add(directionalLight2);

  // Load the GLTF model
  const url =
    "https://acefree86.github.io/image-tracking/assets/models/box2.gltf";
  const loader = new GLTFLoader();

  const group = new THREE.Group();
  const anchor = mindarThree.addAnchor(0);

  const errorDisplay = document.querySelector("#error-message");

  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.rotation.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      group.add(model);
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
      console.error("Error loading model:", error);
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