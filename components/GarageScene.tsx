import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';

// GarageScene: renders a 3D car model using expo-gl and three.js
export default function GarageScene() {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clean up any pending timeouts on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // onContextCreate is called when the GL context is ready
  async function onContextCreate(gl: any) {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // Renderer setup using expo-three
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(new THREE.Color('#0E0E10'));

    // Basic scene setup
    const scene = new THREE.Scene();

    // Camera: perspective camera suitable for models
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.6, 3);

    // Lights: ambient + directional for basic shading
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);

    // Ground plane for subtle contact shadow (very simple)
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.ShadowMaterial({ opacity: 0.2 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    plane.receiveShadow = true;
    scene.add(plane);

    // Load the GLB model from assets
    // Note: the asset filename in the repo is 'red_bull_racing.glb' per workspace
    // Use explicit require with .default for Metro bundler compatibility
    const assetModule = require('../assets/models/red_bull_racing.glb');
    const asset = Asset.fromModule(assetModule);
    await asset.downloadAsync();

    const loader = new GLTFLoader();

    // Wrap loader in try/catch for clearer error output during bundling/runtime
    try {
      // Provide a simple manager for DRACOLoader or other decoders if needed
      loader.load(
        asset.localUri || asset.uri || asset.name,
        (gltf) => {
          const model = gltf.scene || gltf.scenes[0];

          // Center and scale the model to fit the view
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3()).length();
          const center = box.getCenter(new THREE.Vector3());

          // Rescale model to be reasonable size in the scene
          const scale = 1.0 / size;
          model.scale.setScalar(scale * 1.5);
          model.position.x += -center.x * (scale * 1.5);
          model.position.y += -center.y * (scale * 1.5) - 0.5; // lower a bit onto plane
          model.position.z += -center.z * (scale * 1.5);

          // Enable shadows if materials allow it
          model.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              // Prefer standard material for consistent lighting
              if (child.material && child.material.isMeshStandardMaterial) {
                child.material.roughness = Math.min(child.material.roughness || 0.5, 1);
              }
            }
          });

          scene.add(model);

          // Simple auto-rotate animation
          const clock = new THREE.Clock();

          const animate = () => {
            const delta = clock.getDelta();
            // rotate the whole scene slowly
            model.rotation.y += delta * 0.5;

            renderer.render(scene, camera);
            gl.endFrameEXP();

            // Use requestAnimationFrame for smooth animation
            timeoutRef.current = requestAnimationFrame(animate) as any;
          };

          animate();
        },
        undefined,
        (error) => {
          // Simple error logging — in production you'd handle this more gracefully
          // eslint-disable-next-line no-console
          console.warn('Error loading model', error);
        }
      );
    } catch (error) {
      // Log the error with more context
      console.error('Error during model loading', error);
    }
  }

  return (
    <View style={styles.container}>
      {/* GLView provides a native GL context for three.js rendering */}
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
