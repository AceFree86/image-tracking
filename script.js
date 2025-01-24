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

  const url ="https://acefree86.github.io/image-tracking/assets/models/box2.gltf";
  const loader = new GLTFLoader();
  const errorDisplay = document.querySelector("#error-message");

  loader.load(url,(gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      anchor.group.add(model);
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

  let angle = 0; // Initial angle for horizontal rotation
  let verticalAngle = Math.PI / 4; // Vertical angle (elevation), default at 45 degrees
  const radius = 2; // Fixed radius of the orbit
  const targetPosition = new THREE.Vector3(0, 0, 0); // Center of the 3D object

  const updateCameraPosition = () => {
    // Calculate the new camera position in spherical coordinates
    camera.position.x =
      targetPosition.x + radius * Math.cos(verticalAngle) * Math.cos(angle); // X-coordinate
    camera.position.y = targetPosition.y + radius * Math.sin(verticalAngle); // Y-coordinate (elevation)
    camera.position.z =
      targetPosition.z + radius * Math.cos(verticalAngle) * Math.sin(angle); // Z-coordinate
    camera.lookAt(targetPosition);
  };

  const animateCamera = () => {
    angle += 0.01; // Horizontal rotation speed
    if (angle >= Math.PI * 2) {
      angle -= Math.PI * 2; // Reset angle to prevent overflow
    }
    updateCameraPosition();
  };


  const start = async () => {
   await mindarThree.start();
   renderer.setAnimationLoop(() => {
    animateCamera();
     renderer.render(scene, camera);
   });
  };

  document.querySelector("#startButton").addEventListener("click", start);
  document.querySelector("#stopButton").addEventListener("click", () => {
    mindarThree.stop();
    renderer.setAnimationLoop(null);
  });
});
