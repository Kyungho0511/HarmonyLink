import * as THREE from 'three';
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

const container = document.querySelector('#scene-container');
const harmonylinkSignal = document.querySelector('.harmonylink_signal');

/*
  ===== GLOBAL VARIABLES
*/
let WIDTH = window.innerWidth
let HEIGHT = window.innerHeight

const FOV = 60
const ASPECT = WIDTH / HEIGHT
const NEAR = 0.1
const FAR = 1000

// Handle inner size changes
window.addEventListener('resize', () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/*
  ===== SCENE
*/
const scene = new THREE.Scene();
scene.background = new THREE.Color('#ffffff');

/*
  ===== CAMERA
*/
const camera = new THREE.PerspectiveCamera( FOV, ASPECT, NEAR, FAR );
camera.position.set(3.84, 0.19, -4.06)
camera.lookAt(scene.position);

/*
  ===== RENDERER
*/
const renderer = new THREE.WebGLRenderer({
  antialias: true
});
// set the size
renderer.setSize( WIDTH, HEIGHT );
// set device pixel ratio
renderer.setPixelRatio(window.devicePixelRatio);
// add automatically created canvas element to the webpage
container.appendChild( renderer.domElement );

/*
  ===== LIGHTING / HELPER
*/
const axesHelper = new THREE.AxesHelper(5);
axesHelper.position.set(0, 0, 0)
const ambientLight = new THREE.AmbientLight("white", 0.6)
const directionalLight = new THREE.DirectionalLight('white', 2.5)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
directionalLight.position.set(0, 5, -10)
scene.add(ambientLight)
scene.add(directionalLight)
scene.add(directionalLightHelper)
// scene.add(axesHelper)

/*
  ===== obejcts
*/
const gltfLoader = new GLTFLoader();

let smartphone = null;
gltfLoader.load('./smartphone/scene.gltf', gltf => {
  gltf.scene.children[0].position.set(2.7, 0.1, -2)
  gltf.scene.children[0].rotateZ(3).rotateY(-0.05).rotateX(-0.5)
  smartphone = gltf.scene;
  scene.add(gltf.scene)
})

gltfLoader.load('./mountain_landscape/scene.gltf', landscape => {
  landscape.scene.children[0].scale.set(1.5, 1.5, 1.5)
  landscape.scene.children[0].position.set(5, -23, 20)
  scene.add(landscape.scene)
})

let harmonylink = null;
let harmonylinkOn = false;
const objects = [];
gltfLoader.load('./harmonylink.glb', gltf => {
  gltf.scene.scale.set(8, 8, 8)
  gltf.scene.children[0].rotateX(-Math.PI * 0.5)
  gltf.scene.children[0].rotateZ(-0.6)
  gltf.scene.position.set(1.5, -1.9, -3.2)
  harmonylink = gltf.scene
  objects.push(harmonylink)
  scene.add(harmonylink)
})

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(3000, 1000),
  new THREE.MeshBasicMaterial({ color: '#ffffff' })
)
plane.rotateY(Math.PI * 0.8)
plane.position.set(-300, 0, 600)
scene.add(plane)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.02),
  new THREE.MeshBasicMaterial({ color: '#000000' })
)
sphere.position.set(2.5, 0.88, -2.34)
scene.add(sphere)

const point = { 
  position: new THREE.Vector3(3, 0.9, -1.9), 
  element: document.querySelector('.signal') 
}

// description box
const point2 = {
  position: new THREE.Vector3(0.5, 0.75, -1.9), 
  element: document.querySelector('.instruction') 
}

// harmonylink signal
const point3 = {
  position: new THREE.Vector3(3, 0.9, -1.9),
  element: document.querySelector('.harmonylink_signal')
}

// Fog density controlled by wheel event
scene.fog = new THREE.FogExp2('#fa9c1b', 0)
container.addEventListener('wheel', handleWheelEvent)

let smokeExperience1 = false; 
let smokeExperience2 = false; 
let smokeExperience3 = false; 
let coping1 = false;
let coping2 = false;
let coping3 = false;
let coping4 = false;
let connection1 = false;
let connection2 = false;
let connection3 = false;
let connection4 = false;
let feedback = false;
let response1 = false;
let response2 = false;
let response3 = false;
let response4 = false;
let experienceEnd = false;

function handleWheelEvent(event) {
  const delta = Math.sign(event.deltaY) * 0.001;
  if (delta > 0 && !experienceEnd) {
    scene.fog.density += delta
    if (scene.fog.density > 0.04) {
      scene.fog.density = 0.04;
      if (!harmonylinkOn) {
        point.element.classList.remove('invisible');
        point.element.innerHTML = 'No signal <i class="fa-solid fa-x"></i>'
        sphere.material.color.set('#ff0000') 
      }
      if (harmonylink.position.y < -1) {
        gsap.to(harmonylink.position, {
          duration: 1.5,
          ease: 'power2.inOut',
          y: '+= 1.6'
        })
        window.setTimeout(() => {
          document.querySelector('.instruction').classList.add('visible')
        }, 1600);
      }
  
      // prompts handling
      if (harmonylinkOn && !smokeExperience1) {
        window.setTimeout(() => {
          document.querySelector('.instruction2').classList.add('hidden');
          document.querySelector('.instruction3').classList.remove('hidden');
          document.querySelector('.smokeExperience1').classList.remove('hidden');
          smokeExperience1 = true;
        }, 1000);
      }
      if (smokeExperience1 && !smokeExperience2) {
        window.setTimeout(() => {
          document.querySelector('.smokeExperience1').classList.add('hidden');
          document.querySelector('.smokeExperience2').classList.remove('hidden');
          smokeExperience2 = true;
        }, 1000);
      }
      if (smokeExperience2 && !smokeExperience3) {
        window.setTimeout(() => {
          document.querySelector('.smokeExperience2').classList.add('hidden');
          document.querySelector('.smokeExperience3').classList.remove('hidden');
          smokeExperience3 = true;
        }, 1000);
      }
      if (smokeExperience3 && !response1) {
        window.setTimeout(() => {
          document.querySelector('.instruction3').classList.add('hidden');
          document.querySelector('.instruction4').classList.remove('hidden');
          document.querySelector('.smokeExperience3').classList.add('hidden');
          response1 = true;
        }, 1000);
      }

      if (response1 && !coping1) {
        window.setTimeout(() => {
          document.querySelector('.instruction4').classList.add('hidden');
          document.querySelector('.instruction3').classList.remove('hidden');
          document.querySelector('.coping1').classList.remove('hidden');
          coping1 = true;
        }, 1000);
      }
      if (coping1 && !coping2) {
        window.setTimeout(() => {
          document.querySelector('.coping1').classList.add('hidden');
          document.querySelector('.coping2').classList.remove('hidden');
          coping2 = true;
        }, 1000);
      }
      if (coping2 && !coping3) {
        window.setTimeout(() => {
          document.querySelector('.coping2').classList.add('hidden');
          document.querySelector('.coping3').classList.remove('hidden');
          coping3 = true;
        }, 1000);
      }
      if (coping3 && !coping4) {
        window.setTimeout(() => {
          document.querySelector('.coping3').classList.add('hidden');
          document.querySelector('.coping4').classList.remove('hidden');
          coping4 = true;
        }, 1000);
      }
      if (coping4 && !response2) {
        window.setTimeout(() => {
          document.querySelector('.instruction3').classList.add('hidden');
          document.querySelector('.instruction4').classList.remove('hidden');
          document.querySelector('.coping4').classList.add('hidden');
          response2 = true;
        }, 1000);
      }             
      
      if (response2 && !connection1) {
        window.setTimeout(() => {
          document.querySelector('.instruction4').classList.add('hidden');
          document.querySelector('.instruction3').classList.remove('hidden');
          document.querySelector('.connection1').classList.remove('hidden');
          connection1 = true;
        }, 1000);
      }
      if (connection1 && !connection2) {
        window.setTimeout(() => {
          document.querySelector('.connection1').classList.add('hidden');
          document.querySelector('.connection2').classList.remove('hidden');
          connection2 = true;
        }, 1000);
      }
      if (connection2 && !connection3) {
        window.setTimeout(() => {
          document.querySelector('.connection2').classList.add('hidden');
          document.querySelector('.connection3').classList.remove('hidden');
          connection3 = true;
        }, 1000);
      }
      if (connection3 && !connection4) {
        window.setTimeout(() => {
          document.querySelector('.connection3').classList.add('hidden');
          document.querySelector('.connection4').classList.remove('hidden');
          connection4 = true;
        }, 1000);
      }
      if (connection4 && !response3) {
        window.setTimeout(() => {
          document.querySelector('.instruction3').classList.add('hidden');
          document.querySelector('.instruction4').classList.remove('hidden');
          document.querySelector('.connection4').classList.add('hidden');
          response3 = true;
        }, 1000);
      } 
      
      if (response3 && !experienceEnd) {
        window.setTimeout(() => {
          document.querySelector('.instruction4').classList.add('hidden');
          document.querySelector('.feedback').classList.remove('hidden');
          experienceEnd = true;
        }, 1000);
      }  
    }
  
    if (scene.fog.density > 0.015 && scene.fog.density < 0.04 && !harmonylinkOn) {
      if (!document.querySelector('.invisible')) {
        point.element.classList.add('invisible')
      } else {
        point.element.classList.remove('invisible')
      }
    }
    event.preventDefault()
  }
}

/**
 * Mouse
 */
const mouse = new THREE.Vector2();
const containerBounding = container.getBoundingClientRect();
const left = containerBounding.left;
const top = containerBounding.top;
container.addEventListener('mousemove', event => {
  mouse.x = (event.clientX - left) / WIDTH * 2 - 1;
  mouse.y = - ((event.clientY - top) / HEIGHT * 2 - 1);
});

// raycaster to interact with objects 
const raycaster = new THREE.Raycaster()
let currentIntersect = null;

// add controls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enabled = false;
const dragControls = new DragControls(objects, camera, renderer.domElement)
dragControls.transformGroup = true;
dragControls.addEventListener('dragend', () => {
  // Cast a ray
  raycaster.setFromCamera(mouse, camera)
  const smartphoneIntersect = raycaster.intersectObject(smartphone);
  const harmonylinkIntersect = raycaster.intersectObject(harmonylink);
  if (smartphoneIntersect.length && harmonylinkIntersect.length) {
    point3.element.classList.remove('invisible_signal');
    point.element.classList.add('invisible');
    harmonylinkOn = true;
    sphere.material.color.set('#00ff00')
    document.querySelector('.instruction1').classList.add('hidden');
    document.querySelector('.instruction2').classList.remove('hidden');
  } else {
    point3.element.classList.add('invisible_signal');
    point.element.classList.remove('invisible');
    harmonylinkOn = false;
    sphere.material.color.set('#ff0000')    
  } 
})

/*
  ===== ANIMATION LOOP
*/
function tick() {
  requestAnimationFrame(tick);

  const screenPosition = point.position.clone()
  screenPosition.project(camera)
  const translateX = screenPosition.x * WIDTH * 0.5
  const translateY = screenPosition.y * HEIGHT * 0.5
  point.element.style.transform = `translate(${translateX}px, ${-translateY}px)`

  const screenPosition2 = point2.position.clone()
  screenPosition2.project(camera)
  const translateX2 = screenPosition2.x * WIDTH * 0.5
  const translateY2 = screenPosition2.y * HEIGHT * 0.5
  point2.element.style.transform = `translate(${translateX2}px, ${-translateY2}px)`

  const screenPosition3 = point3.position.clone()
  screenPosition3.project(camera)
  const translateX3 = screenPosition3.x * WIDTH * 0.5
  const translateY3 = screenPosition3.y * HEIGHT * 0.5
  point3.element.style.transform = `translate(${translateX3}px, ${-translateY3}px)`

  renderer.render(scene, camera);
}

tick()