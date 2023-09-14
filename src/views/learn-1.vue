<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {ref, watch} from 'vue';

const threeRef = ref<HTMLElement | null>(null);
watch(threeRef, (val) => {
  if (!val) return;
  const scene = new THREE.Scene();
  // 修改背景颜色
  scene.background = new THREE.Color(0xffffff);
  // 添加3d辅助坐标系
  const axesHelper = new THREE.AxesHelper(5);
  axesHelper.position.set(0, 0.8, 0);
  scene.add(axesHelper);
  // 添加环境光
  const light = new THREE.AmbientLight( 0x404040 ); // 柔和的白光
  scene.add( light );
  // 添加平行光
  // const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  // scene.add( directionalLight );
  // 添加点光源
  const pointLight = new THREE.PointLight( 0xffffff, 10 );
  pointLight.position.set( 1, 1, 1 );
  pointLight.castShadow = true;
  scene.add( pointLight );

  // 创建地面
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry( 10, 10, 1, 1 ),
    new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
  );
  // 接收阴影
  ground.receiveShadow = true;
  ground.rotation.x = - Math.PI / 2;
  ground.position.y = - 0.5;
  scene.add( ground );
  // 添加摄像机
  const camera = new THREE.PerspectiveCamera(60, val.offsetWidth / val.offsetHeight, 0.01, 10);
  camera.position.y = 5;
  camera.position.z = 4;
  // camera.lookAt(0,1,0)
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  // 法线网格材质
  // const material = new THREE.MeshNormalMaterial({flatShading:true});

  // 纹理材质
  const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/uv_grid_opengl.jpg');
  // const material = new THREE.MeshBasicMaterial({map: texture});
  // 环境光材质
  const material = new THREE.MeshPhongMaterial({map: texture,shininess:1000});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 0.8;
  scene.add(mesh);
  // 接收光源
  mesh.receiveShadow = true;
  // 投射阴影
  mesh.castShadow = true;
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.shadowMap.enabled = true;
  renderer.setAnimationLoop(animation);
  renderer.setSize(val.offsetWidth,val.offsetHeight);
  val.appendChild(renderer.domElement)
  // 添加网格辅助线
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);
  // 添加轨道控制器
  const control = new OrbitControls(camera, renderer.domElement);

  function animation(time: number) {
    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;
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