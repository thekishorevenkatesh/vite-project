import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export function Bike() {
  useEffect(() => {
    const renderer = new THREE.WebGLRenderer(); // You might already have one
    const gltfLoader = new GLTFLoader();

    // 1️⃣ Set up DRACO (if needed)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/"); // your path to draco decoder
    gltfLoader.setDRACOLoader(dracoLoader);

    // 2️⃣ Set up KTX2
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("/basis/"); // your path to basis_transcoder
    ktx2Loader.detectSupport(renderer);
    gltfLoader.setKTX2Loader(ktx2Loader); // THIS IS THE IMPORTANT LINE

    // 3️⃣ Load the model
    gltfLoader.load("/Bike.glb", (gltf) => {
      console.log("Loaded GLB with KTX2 textures", gltf);
    });
  }, []);

  return null;
}
