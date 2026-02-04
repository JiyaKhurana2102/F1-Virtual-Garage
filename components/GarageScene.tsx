import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import { Renderer } from 'expo-three';

// GarageScene: renders a 3D car model using expo-gl and three.js without expo-three
export default function GarageScene() {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // onContextCreate is called when the GL context is ready
  async function onContextCreate(gl: any) {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Use expo-three's Renderer to bind the Expo GL context to three.js correctly
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(new THREE.Color('#0E0E10'));

    // Basic scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.6, 3);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);

    // Simple ground plane
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.2 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    plane.receiveShadow = true;
    scene.add(plane);

    // Load the GLB model from assets
    const assetModule = require('../assets/models/red_bull_racing.glb');
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync();

    const loader = new GLTFLoader();

    // Load model using GLTFLoader and the local URI
    loader.load(
      asset.localUri || asset.uri || asset.name,
      (gltf) => {
        const model = gltf.scene || gltf.scenes[0];

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        const scale = 1.0 / size;
        model.scale.setScalar(scale * 1.5);
        model.position.x += -center.x * (scale * 1.5);
        model.position.y += -center.y * (scale * 1.5) - 0.5;
        model.position.z += -center.z * (scale * 1.5);

        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material && child.material.isMeshStandardMaterial) {
              child.material.roughness = Math.min(child.material.roughness || 0.5, 1);
            }
          }
        });

        scene.add(model);

        // Animation loop: simple auto-rotate
        const clock = new THREE.Clock();

        const animate = () => {
          const delta = clock.getDelta();
          model.rotation.y += delta * 0.5;

          renderer.render(scene, camera);

          // Notify Expo GL that the frame is complete
          gl.endFrameEXP();

          rafRef.current = requestAnimationFrame(animate) as any;
        };

        animate();
      },
      undefined,
      (error) => {
        // eslint-disable-next-line no-console
        console.warn('Error loading model', error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <GLView style={styles.gl} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0E0E10',
  },
  gl: {
    flex: 1,
    width: '100%',
  },
});
