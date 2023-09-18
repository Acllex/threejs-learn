<script setup lang="ts">
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {ref, watch} from 'vue';

const threeRef = ref<HTMLElement | null>(null);
watch(threeRef, (val) => {
  if (!val) return;
  const scene = new THREE.Scene();
  // 修改背景颜色
  scene.background = new THREE.Color(0xffffff);
  // 添加摄像机
  const camera = new THREE.PerspectiveCamera(60, val.offsetWidth / val.offsetHeight, 0.001);
  camera.position.y = 0;
  camera.position.z = 6;
  // camera.lookAt(0,1,0)
  // 法线网格材质
  // const material = new THREE.MeshNormalMaterial({flatShading:true});

  // 导入模型
  const loader = new GLTFLoader();
  loader.load(
      // 模型路径
      'gltf/ship_in_clouds.glb',
      // 加载完成后的回调函数
      (gltf) => {
        gltf.scene.traverse((child) => {
          console.log(child, 'child')
          // if (child instanceof THREE.Mesh) {
          //   child.castShadow = true;
          //   child.receiveShadow = true;
          // }
        });
        // gltf.scene.children[0].material = new THREE.MeshPhongMaterial({color: 0x00ff00});
        scene.add(gltf.scene);
      },
      // 加载过程中的回调函数
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // 加载出错后的回调函数
      (error) => {
        console.log('An error happened', error);
      }
  );

  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.shadowMap.enabled = true;
  renderer.setAnimationLoop(animation);
  renderer.setSize(val.offsetWidth, val.offsetHeight);
  val.appendChild(renderer.domElement)

  // 添加轨道控制器
  const control = new OrbitControls(camera, renderer.domElement);

  function animation() {
    // 更新相机位置
    if (camera.position.z > 0.1){
      camera.position.z -= 0.1;
    }

    // camera.position.x = Math.sin(time / 1000) * 2;
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