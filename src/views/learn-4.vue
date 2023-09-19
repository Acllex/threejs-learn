<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as TWEEN from '@tweenjs/tween.js'
import {ref, watch} from 'vue';

const threeRef = ref<HTMLElement | null>(null);
watch(threeRef,
    (val) => {
      if (!val) return;
      let bufArrays = [] as any[];
      const scene = new THREE.Scene();
      // 修改背景颜色
      scene.background = new THREE.Color(0x000000);
      // 添加3d辅助坐标系
      // const axesHelper = new THREE.AxesHelper(5);
      // axesHelper.position.set(0, 0.8, 0);
      // scene.add(axesHelper);
      // 添加环境光
      const light = new THREE.AmbientLight(0x404040); // 柔和的白光
      scene.add(light);
      // 添加平行光
      // const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
      // scene.add( directionalLight );
      // 添加点光源
      const pointLight = new THREE.PointLight(0xffffff, 10);
      pointLight.position.set(1, 1, 1);
      pointLight.castShadow = true;
      scene.add(pointLight);

      // 添加摄像机
      const camera = new THREE.PerspectiveCamera(60, val.offsetWidth / val.offsetHeight, 0.01);
      camera.position.y = 0;
      camera.position.z = 5;
      camera.lookAt(0,1,0)

      // 添加粒子
      const geometry = new THREE.BufferGeometry();
      const geometryTween = [] as any[];
      const vertices = [] as any[];
      for (let i = 0; i < 60000; i++) {
        const position = THREE.MathUtils.randFloat(-4, 4)
        geometryTween.push(new TWEEN.Tween({position}).easing(TWEEN.Easing.Exponential.In))
        vertices.push(position)
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))

      const points = new THREE.Points(geometry, new THREE.PointsMaterial({
        size: 0.032,
        color: 0xffffff,
        alphaTest: 0.1,
        opacity: 0.5,
        transparent: true,
        depthTest: true
      }))

      scene.add(points)

      const loader = new FontLoader();
      loader.load('fonts/About_Love_Regular.json', function (font) {

        const message = '1234567890';
        const geometry = new TextGeometry( message, {
          font: font,
          size: 1,
          height: 0.01,
          curveSegments: 4,
          // bevelThickness: 0.1,
          // bevelSize: 0.04,
          // bevelEnabled: true
        } );

        geometry.computeBoundingBox();

        const xMid = -0.5 * (geometry.boundingBox!.max.x - geometry.boundingBox!.min.x);

        const materials =new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )// front

        const frontMesh = new THREE.Mesh( geometry, materials );
        frontMesh.geometry.translate( xMid, 0, 0 );
        const {array} = frontMesh.geometry.attributes.position
        bufArrays.push(array)
        // scene.add(frontMesh);
        transition()
      });
      const renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.shadowMap.enabled = true;
      renderer.setAnimationLoop(animation);
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(val.offsetWidth, val.offsetHeight);
      val.appendChild(renderer.domElement)
      // 添加轨道控制器
      const control = new OrbitControls(camera, renderer.domElement);

      function transition() {
        for (let i = 0; i < bufArrays[0].length; i++) {
          const item = geometryTween[i]
          item.to({position:THREE.MathUtils.randFloat(bufArrays[0][i]-0.02, bufArrays[0][i]+0.02)}, THREE.MathUtils.randFloat(1000, 4000)).onUpdate(({position}:{position:number})=> {
            geometry.attributes.position.array[i] = position
            geometry.attributes.position.needsUpdate = true
          })
          item.start()
        }
      }

      function animation() {
        points.rotation.x += 0.0002
        points.rotation.y += 0.001
        points.rotation.z += 0.003
        TWEEN.update()
        // 更新控制器
        control.update()
        renderer.render(scene, camera);
        // requestAnimationFrame(animation)
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