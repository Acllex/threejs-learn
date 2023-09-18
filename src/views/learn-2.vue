<!--太阳系-->
<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {ref, watch} from 'vue';

const threeRef = ref<HTMLElement | null>(null);
watch(threeRef, (val) => {
  if (!val) return;
  const scene = new THREE.Scene();
  // 修改背景颜色
  scene.background = new THREE.Color(0x000000);
  // 添加3d辅助坐标系
  // const axesHelper = new THREE.AxesHelper(50);
  // axesHelper.position.set(0, 0, 0);
  // scene.add(axesHelper);
  // 添加摄像机
  const camera = new THREE.PerspectiveCamera(60, val.offsetWidth / val.offsetHeight, 0.01);
  // camera.position.y = 0;
  camera.position.z = 20;
  // 添加WebGL渲染器
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(val.offsetWidth, val.offsetHeight);
  renderer.setAnimationLoop(animation);
  val.appendChild(renderer.domElement)
  const control = new OrbitControls(camera, renderer.domElement);

  // 添加太阳纹理
  const sunTexture = new THREE.TextureLoader().load('images/2k_sun.jpg');
  const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
  // 添加太阳
  const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      sunMaterial
  );
  sunMesh.position.set(0, 0, 0);
  scene.add(sunMesh);
  // 添加太阳光源
  const sunLight = new THREE.PointLight(0xffffff, 160, 1000);
  sunLight.position.set(0, 0, 0);
  sunMesh.add(sunLight);

  // 添加水星组
  const mercuryGroup = new THREE.Group();
  mercuryGroup.position.set(0, 0, 0);
  scene.add(mercuryGroup);
  // 添加水星纹理
  const mercuryTexture = new THREE.TextureLoader().load('images/2k_mercury.jpg');
  const mercuryMaterial = new THREE.MeshPhongMaterial({map: mercuryTexture});
  // 添加水星
  const mercuryMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      mercuryMaterial
  );
  mercuryMesh.position.set(1.5, 0, 0);
  mercuryGroup.add(mercuryMesh);


  // 添加金星组
  const venusGroup = new THREE.Group();
  venusGroup.position.set(0, 0, 0);
  scene.add(venusGroup);

  // 添加金星纹理
  const venusTexture = new THREE.TextureLoader().load('images/2k_venus_surface.jpg');
  const venusMaterial = new THREE.MeshPhongMaterial({map: venusTexture});
  // 添加金星
  const venusMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 32, 32),
      venusMaterial
  );
  venusMesh.position.set(2.1, 0, 0);
  venusGroup.add(venusMesh);

  // 添加地球组
  const earthGroup = new THREE.Group();
  earthGroup.position.set(0, 0, 0);
  scene.add(earthGroup);

  // 添加地球纹理
  const earthTexture = new THREE.TextureLoader().load('images/2k_earth_daymap.jpg');
  const earthMaterial = new THREE.MeshPhongMaterial({map: earthTexture});
  // 添加地球
  const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      earthMaterial
  );
  earthMesh.position.set(2.7, 0, 0);
  earthGroup.add(earthMesh);

  // 添加月球组
  const moonGroup = new THREE.Group();
  earthGroup.add(moonGroup);
  // 移动月球组中心点到地球中心
  moonGroup.translateX(2.7)


  // 添加月球纹理
  const moonTexture = new THREE.TextureLoader().load('images/2k_moon.jpg');
  const moonMaterial = new THREE.MeshPhongMaterial({map: moonTexture});
  // 添加月球
  const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 32, 32),
      moonMaterial
  );
  moonMesh.position.set(0.4, 0, 0);
  moonGroup.add(moonMesh);

  // 添加火星组
  const marsGroup = new THREE.Group();
  marsGroup.position.set(0, 0, 0);
  scene.add(marsGroup);

  // 添加火星纹理
  const marsTexture = new THREE.TextureLoader().load('images/2k_mars.jpg');
  const marsMaterial = new THREE.MeshPhongMaterial({map: marsTexture});
  // 添加火星
  const marsMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 32, 32),
      marsMaterial
  );
  marsMesh.position.set(3.7, 0, 0);
  marsGroup.add(marsMesh);

  // 添加木星组
  const jupiterGroup = new THREE.Group();
  jupiterGroup.position.set(0, 0, 0);
  scene.add(jupiterGroup);

  // 添加木星纹理
  const jupiterTexture = new THREE.TextureLoader().load('images/2k_jupiter.jpg');
  const jupiterMaterial = new THREE.MeshPhongMaterial({map: jupiterTexture});
  // 添加木星
  const jupiterMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      jupiterMaterial
  );
  jupiterMesh.position.set(9.2, 0, 0);
  jupiterGroup.add(jupiterMesh);

  // 添加土星组
  const saturnGroup = new THREE.Group();
  saturnGroup.position.set(0, 0, 0);
  scene.add(saturnGroup);

  // 添加土星纹理
  const saturnTexture = new THREE.TextureLoader().load('images/2k_saturn.jpg');
  const saturnMaterial = new THREE.MeshPhongMaterial({map: saturnTexture});
  // 添加土星
  const saturnMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      saturnMaterial
  );
  saturnMesh.position.set(15, 0, 0);
  saturnGroup.add(saturnMesh);

  // 添加土星环
  const saturnRingTexture = new THREE.TextureLoader().load('images/2k_saturn_ring_alpha.png');
  const saturnRingMaterial = new THREE.MeshPhongMaterial({
    map: saturnRingTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  const saturnRingMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 1, 32),
      saturnRingMaterial
  );
  saturnRingMesh.rotation.x = Math.PI / 2;
  saturnGroup.add(saturnRingMesh);
  saturnRingMesh.translateX(15)

  // 添加天王星组
  const uranusGroup = new THREE.Group();
  uranusGroup.position.set(0, 0, 0);
  scene.add(uranusGroup);

  // 添加天王星纹理
  const uranusTexture = new THREE.TextureLoader().load('images/2k_uranus.jpg');
  const uranusMaterial = new THREE.MeshPhongMaterial({map: uranusTexture});
  // 添加天王星
  const uranusMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      uranusMaterial
  );
  uranusMesh.position.set(20, 0, 0);
  uranusGroup.add(uranusMesh);

  // 添加海王星组
  const neptuneGroup = new THREE.Group();
  neptuneGroup.position.set(0, 0, 0);
  scene.add(neptuneGroup);

  // 添加海王星纹理
  const neptuneTexture = new THREE.TextureLoader().load('images/2k_neptune.jpg');
  const neptuneMaterial = new THREE.MeshPhongMaterial({map: neptuneTexture});
  // 添加海王星
  const neptuneMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      neptuneMaterial
  );
  neptuneMesh.position.set(25, 0, 0);
  neptuneGroup.add(neptuneMesh);

  // 自转
  function rotation() {
    sunMesh.rotation.y += 0.04;
    mercuryMesh.rotation.y += 0.02;
    venusMesh.rotation.y -= 0.005;
    earthMesh.rotation.y += 1;
    moonMesh.rotation.y += 0.05;
    marsMesh.rotation.y += 1;
    jupiterMesh.rotation.y += 1.5;
    saturnMesh.rotation.y += 1.5;
    saturnRingMesh.rotation.z += 0.02;
    uranusMesh.rotation.y -= 1.5;
    neptuneMesh.rotation.y += 1.2;
  }

  // 公转
  function revolution() {
    mercuryGroup.rotation.y += 0.15;
    venusGroup.rotation.y += 0.065;
    earthGroup.rotation.y += 0.05;
    moonGroup.rotation.y += 0.05;
    marsGroup.rotation.y += 0.03;
    jupiterGroup.rotation.y += 0.001;
    saturnGroup.rotation.y += 0.02;
    uranusGroup.rotation.y += 0.0005;
    neptuneGroup.rotation.y += 0.003;
  }

  function animation() {
    rotation();
    revolution();
    // 更新控制器
    control.update()
    renderer.render(scene, camera);
  }
})


</script>

<template>
  <div class="three" ref="threeRef"></div>
</template>

<style scoped>
.three {
  flex: 1;
}
</style>