// Minimal shims to satisfy TypeScript when using non-typed modules
declare module 'three/examples/jsm/loaders/GLTFLoader' {
  export * from 'three';
  export const GLTFLoader: any;
}

declare module 'expo-three' {
  export const Renderer: any;
  export default Renderer;
}

declare module 'expo-gl' {
  export const GLView: any;
  export default GLView;
}
