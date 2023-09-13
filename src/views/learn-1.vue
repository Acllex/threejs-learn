<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {ref, watch} from 'vue';

const threeRef = ref<HTMLElement | null>(null);
watch(threeRef, (val) => {
  if (!val) return;
  const scene = new THREE.Scene();
  // 修改背景颜色
  scene.background = new THREE.Color(0xaaaaaa);
  // 添加3d辅助坐标系
  const axesHelper = new THREE.AxesHelper(5);
  axesHelper.position.set(0, 0.8, 0);
  scene.add(axesHelper);

  const camera = new THREE.PerspectiveCamera(60, val.offsetWidth / val.offsetHeight, 0.01, 10);
  camera.position.y = 5;
  camera.position.z = 4;
  // camera.lookAt(0,1,0)
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 0.8;
  scene.add(mesh);
  const renderer = new THREE.WebGLRenderer({antialias: true});
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