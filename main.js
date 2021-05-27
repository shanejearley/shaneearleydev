import './style.css'

import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

const pixelRatio = window.devicePixelRatio
renderer.setPixelRatio( pixelRatio );
const renderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth * pixelRatio,
  window.innerHeight * pixelRatio
);

renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(0);
renderer.render( scene, camera );

const clock = new THREE.Clock();

const params = {
  foamColor: 0x226699,
  waterColor: 0x55ACEE,
  threshold: 0.25
};

const dudvMap = new THREE.TextureLoader().load(
  "https://i.imgur.com/hOIsXiZ.png"
);
dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;

const uniforms = {
  time: {
    value: 5
  },
  threshold: {
    value: 0.1
  },
  tDudv: {
    value: null
  },
  tDepth: {
    value: null
  },
  cameraNear: {
    value: 0
  },
  cameraFar: {
    value: 0
  },
  resolution: {
    value: new THREE.Vector2()
  },
  foamColor: {
    value: new THREE.Color()
  },
  waterColor: {
    value: new THREE.Color()
  }
};

const waterGeo = new THREE.PlaneGeometry( 1800, 600, 24, 18 );

var waterMat = new THREE.ShaderMaterial({
  defines: {
    DEPTH_PACKING: 1,
    ORTHOGRAPHIC_CAMERA: 0
  },
  uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib["fog"], uniforms]),
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
});

waterMat.uniforms.cameraNear.value = camera.near;
waterMat.uniforms.cameraFar.value = camera.far;
waterMat.uniforms.resolution.value.set(
  window.innerWidth * pixelRatio,
  window.innerHeight * pixelRatio
);
waterMat.uniforms.tDudv.value = dudvMap;
waterMat.uniforms.tDepth.value = renderTarget.texture;

const water = new THREE.Mesh(waterGeo, waterMat);

water.position.y = - 33;
water.position.z = -150;
water.rotation.x = - Math.PI / 2;

scene.add(water);


const skyTexture = new THREE.TextureLoader().load('sky.svg');
scene.background = skyTexture;

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 150, -900);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(150, 240, 180),
  new THREE.MeshBasicMaterial( {
    color: 0xFFF07C
  } )
)

sun.position.y = 150;
sun.position.z = -900;

scene.add(sun);


function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  sun.rotation.x += 0.005;
  sun.rotation.y += 0.0075;
  sun.rotation.z += 0.005;

  camera.position.z = t * -0.01;
}

document.body.onscroll = moveCamera;


function animate() {

  requestAnimationFrame(animate);

  renderer.setSize( window.innerWidth, window.innerHeight );

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  const time = clock.getElapsedTime();

  water.material.uniforms.threshold.value = params.threshold;
  water.material.uniforms.time.value = time;
  water.material.uniforms.foamColor.value.set(params.foamColor);
  water.material.uniforms.waterColor.value.set(params.waterColor);

  renderer.render( scene, camera );
}

animate()