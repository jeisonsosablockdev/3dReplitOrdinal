// Import necessary Three.js libraries
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let model: THREE.Object3D | null = null;
let animationFrameId: number | null = null;
let isRotating = true;

/**
 * Sets up a 3D scene in the given container
 * @param container The DOM element to render the scene in
 * @param modelUrl URL to the 3D model or image to convert
 * @param autoRotate Whether to auto-rotate the model
 */
export function setup3DScene(
  container: HTMLElement, 
  modelUrl: string | undefined, 
  autoRotate = true
): { toggleRotation: () => void; dispose: () => void } {
  if (!modelUrl) {
    console.error('No model URL provided');
    return { toggleRotation: () => {}, dispose: () => {} };
  }

  // Clean up any existing scene
  cleanup3DScene();
  
  // Initialize scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0F1115);
  
  // Set up renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
  
  // Set up camera
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5;
  
  // Add orbit controls
  if (camera && renderer) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;
  }
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // Determine if we need to load a 3D model or create a 3D model from an image
  if (modelUrl.toLowerCase().endsWith('.glb') || modelUrl.toLowerCase().endsWith('.gltf')) {
    loadGLTFModel(modelUrl);
  } else {
    // Create a 3D representation of a 2D image
    createImageBasedModel(modelUrl);
  }
  
  // Handle resize
  const handleResize = () => {
    if (!camera || !renderer) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Start animation loop
  animate();
  
  isRotating = autoRotate;
  
  // Functions to control the scene
  const toggleRotation = () => {
    if (!controls) return;
    
    isRotating = !isRotating;
    controls.autoRotate = isRotating;
  };
  
  const dispose = () => {
    window.removeEventListener('resize', handleResize);
    container.removeChild(renderer!.domElement);
  };
  
  return { toggleRotation, dispose };
}

/**
 * Cleans up the 3D scene
 */
export function cleanup3DScene() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  
  if (controls) {
    controls.dispose();
    controls = null;
  }
  
  scene = null;
  camera = null;
  model = null;
}

/**
 * Loads a GLTF/GLB 3D model
 * @param url URL to the 3D model
 */
function loadGLTFModel(url: string) {
  if (!scene) return;
  
  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      model = gltf.scene;
      scene!.add(model);
      
      // Adjust model position and scale if needed
      centerModel();
    },
    (xhr) => {
      console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
      console.error('Error loading GLTF model:', error);
    }
  );
}

/**
 * Creates a 3D model based on a 2D image
 * @param imageUrl URL to the image
 */
function createImageBasedModel(imageUrl: string) {
  if (!scene) return;
  
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    imageUrl,
    (texture) => {
      // Create a plane with the image as a texture
      const geometry = new THREE.PlaneGeometry(3, 3);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      
      const plane = new THREE.Mesh(geometry, material);
      scene!.add(plane);
      model = plane;
      
      // Add a backplane for 3D effect
      const backGeometry = new THREE.PlaneGeometry(3, 3);
      const backMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333,
        side: THREE.DoubleSide
      });
      
      const backPlane = new THREE.Mesh(backGeometry, backMaterial);
      backPlane.position.z = -0.1;
      scene!.add(backPlane);
      
      // Add sides to create a box-like appearance
      createBoxSides(3, 3, 0.1);
    },
    undefined,
    (error) => {
      console.error('Error loading texture:', error);
    }
  );
}

/**
 * Creates sides for a box to give a 3D effect to a 2D image
 * @param width Width of the box
 * @param height Height of the box
 * @param depth Depth of the box
 */
function createBoxSides(width: number, height: number, depth: number) {
  if (!scene) return;
  
  const material = new THREE.MeshBasicMaterial({
    color: 0x555555,
    side: THREE.DoubleSide
  });
  
  // Top side
  const topGeometry = new THREE.PlaneGeometry(width, depth);
  const topPlane = new THREE.Mesh(topGeometry, material);
  topPlane.rotation.x = Math.PI / 2;
  topPlane.position.y = height / 2;
  topPlane.position.z = -depth / 2;
  scene.add(topPlane);
  
  // Bottom side
  const bottomGeometry = new THREE.PlaneGeometry(width, depth);
  const bottomPlane = new THREE.Mesh(bottomGeometry, material);
  bottomPlane.rotation.x = Math.PI / 2;
  bottomPlane.position.y = -height / 2;
  bottomPlane.position.z = -depth / 2;
  scene.add(bottomPlane);
  
  // Left side
  const leftGeometry = new THREE.PlaneGeometry(depth, height);
  const leftPlane = new THREE.Mesh(leftGeometry, material);
  leftPlane.rotation.y = Math.PI / 2;
  leftPlane.position.x = -width / 2;
  leftPlane.position.z = -depth / 2;
  scene.add(leftPlane);
  
  // Right side
  const rightGeometry = new THREE.PlaneGeometry(depth, height);
  const rightPlane = new THREE.Mesh(rightGeometry, material);
  rightPlane.rotation.y = Math.PI / 2;
  rightPlane.position.x = width / 2;
  rightPlane.position.z = -depth / 2;
  scene.add(rightPlane);
}

/**
 * Centers the loaded model in the scene
 */
function centerModel() {
  if (!model) return;
  
  // Calculate the bounding box of the model
  const boundingBox = new THREE.Box3().setFromObject(model);
  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());
  
  // Get the maximum dimension to scale uniformly
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 4 / maxDim;
  
  // Center and scale the model
  model.position.x = -center.x;
  model.position.y = -center.y;
  model.position.z = -center.z;
  model.scale.set(scale, scale, scale);
}

/**
 * Animation loop
 */
function animate() {
  if (!scene || !camera || !renderer || !controls) return;
  
  animationFrameId = requestAnimationFrame(animate);
  
  if (controls) {
    controls.update();
  }
  
  renderer.render(scene, camera);
}

/**
 * Generates a 3D model from a 2D Ordinal image
 * @param imageUrl URL to the Ordinal image
 * @returns URL to the generated 3D model
 */
export async function generate3DModelFromOrdinal(imageUrl: string): Promise<string> {
  // In a real implementation, this would call a 3D model generation service
  // or use Three.js to generate a 3D model
  
  // For demo purposes, return a mock URL
  return '/mock-3d-model.glb';
}
