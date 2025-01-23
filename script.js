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

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  const anchor = mindarThree.addAnchor(0);

  const url =
    "https://acefree86.github.io/image-tracking/assets/models/box.gltf";
  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
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

  // Variables for camera movement
  let angle = 0;
  const radius = 3; // Radius of the camera's orbit
  const targetPosition = new THREE.Vector3(0, 0, 0); // Target object position (center)

  const updateCameraPosition = () => {
    // Calculate the camera's position in polar coordinates (circle)
    camera.position.x = targetPosition.x + radius * Math.cos(angle);
    camera.position.y = targetPosition.y + 1; // Adjust vertical position
    camera.position.z = targetPosition.z + radius * Math.sin(angle);

    // Make the camera always look at the target
    camera.lookAt(targetPosition);
  };

  // Animation loop to rotate the camera around the object
  const animateCamera = () => {
    angle += 0.01; // Adjust this value to change the speed of the camera's rotation
    updateCameraPosition();
    renderer.render(scene, camera);
  };

  const start = async () => {
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(animateCamera);
    });
  };

  document.querySelector("#startButton").addEventListener("click", start);
  document.querySelector("#stopButton").addEventListener("click", () => {
    mindarThree.stop();
    renderer.setAnimationLoop(null);
  });
});
