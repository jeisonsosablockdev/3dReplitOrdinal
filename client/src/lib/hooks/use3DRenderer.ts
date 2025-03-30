import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface Use3DRendererProps {
  modelUrl?: string;
  containerId: string;
}

interface RendererState {
  isLoading: boolean;
  error: string | null;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  loaded: boolean;
}

export const use3DRenderer = ({ modelUrl, containerId }: Use3DRendererProps): RendererState => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Initialize Three.js
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      setError('Container not found');
      return;
    }

    // Get container dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (container && cameraRef.current && rendererRef.current) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [containerId]);

  // Load 3D model
  useEffect(() => {
    if (!modelUrl || !sceneRef.current) return;

    setIsLoading(true);
    setError(null);

    // If there's an existing model, remove it
    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
    }

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (sceneRef.current) {
          // Center model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = cameraRef.current?.fov || 45;
          const cameraZ = maxDim / (2 * Math.tan((fov * Math.PI) / 360));
          
          if (cameraRef.current) {
            cameraRef.current.position.z = cameraZ * 1.5;
            cameraRef.current.lookAt(center);
          }
          
          gltf.scene.position.x = -center.x;
          gltf.scene.position.y = -center.y;
          gltf.scene.position.z = -center.z;
          
          sceneRef.current.add(gltf.scene);
          modelRef.current = gltf.scene;
          
          // Auto-rotate the model
          const autoRotate = () => {
            if (modelRef.current) {
              modelRef.current.rotation.y += 0.005;
            }
            requestAnimationFrame(autoRotate);
          };
          autoRotate();
          
          setIsLoading(false);
          setLoaded(true);
        }
      },
      (progress) => {
        // Handle loading progress
        console.log('Loading progress:', (progress.loaded / progress.total) * 100, '%');
      },
      (error) => {
        setError('Failed to load 3D model: ' + error.message);
        setIsLoading(false);
      }
    );
  }, [modelUrl]);

  // Zoom controls
  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z *= 0.8;
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z *= 1.2;
    }
  };

  const resetView = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      
      // Recenter the model
      if (modelRef.current) {
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = cameraRef.current.fov;
        const cameraZ = maxDim / (2 * Math.tan((fov * Math.PI) / 360));
        
        cameraRef.current.position.set(0, 0, cameraZ * 1.5);
        cameraRef.current.lookAt(center);
      }
    }
  };

  return {
    isLoading,
    error,
    zoomIn,
    zoomOut,
    resetView,
    loaded
  };
};
