<script setup lang="ts">
import * as THREE from 'three';
import {ref, onMounted} from 'vue';

const threeRef = ref<HTMLElement|null>(null);
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
onMounted(()=>{
  console.log(threeRef.value)
  threeRef.value.appendChild(renderer.domElement)
})
// animation

function animation( time:number ) {

  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  renderer.render( scene, camera );

}
</script>

<template>
  <div class="three" ref="threeRef"></div>
</template>
<style scoped>
.three{
  width: 100%;
  height: 100%;
}
</style>