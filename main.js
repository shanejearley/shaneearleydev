import './style.css'

import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(0);
renderer.render( scene, camera );

const waterGeo = new THREE.PlaneGeometry( 10000, 10000 );
const waterMat = new THREE.MeshBasicMaterial( { color: 0x226699 } );

const water = new THREE.Mesh( waterGeo, waterMat );
water.position.y = - 33;
water.position.z = -150;
water.rotation.x = - Math.PI / 2;
scene.add( water );

const skyTexture = new THREE.TextureLoader().load('sky.png');
scene.background = skyTexture;

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 33, -150);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(33, 32, 24),
  new THREE.MeshBasicMaterial( {
    color: 0xFFF07C
  } )
)

sun.position.y = 33;
sun.position.z = -150;

scene.add(sun);


function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  sun.rotation.x += 0.05;
  sun.rotation.y += 0.075;
  sun.rotation.z += 0.05;

  camera.position.z = t * -0.01;
}

document.body.onscroll = moveCamera;


function animate() {

  requestAnimationFrame(animate);

  renderer.setSize( window.innerWidth, window.innerHeight );

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  renderer.render( scene, camera );
}

animate()