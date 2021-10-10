import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import MODEL from "../zombie/cartoon_lowpoly_small_city_free_pack/scene.gltf";

const TryOne = () => {
  const mountedRef = useRef(null);

  useEffect(() => {
    const currentRef = mountedRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("purple");
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.01, 1000);
    scene.add(camera);

    camera.position.z = 6;
    camera.position.x = 6;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    currentRef.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    //const material = new THREE.MeshBasicMaterial({ color: "red" });

    const material = new THREE.MeshPhongMaterial({ color: "red" });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);
    camera.lookAt(cube.position);

    const ambientLigth = new THREE.AmbientLight("blue", 5);
    scene.add(ambientLigth);

    const pointLight = new THREE.PointLight("#FFFF", 15);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      cube.rotation.y = elapsedTime;
      cube.rotation.x = elapsedTime;
      cube.position.y = Math.sin(elapsedTime);
      cube.position.x = Math.sin(elapsedTime);
      //cube.position.z = Math.sin(elapsedTime);

      //cube.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const resize = () => {
      const updateWidth = currentRef.clientWidth;
      const updateHeight = currentRef.clientHeight;
      renderer.setSize(updateWidth, updateHeight);
      camera.aspect = updateWidth / updateHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resize);

    // loaders

    /*     const gltfloader = new GLTFLoader();
    gltfloader.load("./arwing.glb", (gltf) => {
      var obj = gltf.scene.children[0];
      console.log(obj);
    }); */

    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./resources/thing.glb", (gltf) => {
      gltf.scene.traverse((c) => {
        c.castShadow = true;
      });
      scene.add(gltf.scene);
    });
    /// bien
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      "./resources/posx.jpg",
      "./resources/negx.jpg",
      "./resources/posy.jpg",
      "./resources/negy.jpg",
      "./resources/posz.jpg",
      "./resources/negz.jpg",
    ]);
    texture.encoding = THREE.sRGBEncoding;
    scene.background = texture;

    ////
    ///piso azul
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0x808080,
      })
    );
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    // piso azul
    animate();
    //renderer.render(scene, camera);

    return () => {
      currentRef.removeChild(renderer.domElement);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div ref={mountedRef} style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default TryOne;
