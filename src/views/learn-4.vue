<script setup lang="ts">
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
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
  camera.position.z = 500;
  // camera.lookAt(0,1,0)
  const loader = new FontLoader();
  loader.load('fonts/helvetiker_regular.typeface.json', function (font) {

    const color = 0x006699;

    const matDark = new THREE.LineBasicMaterial({
      color: color,
      side: THREE.DoubleSide
    });

    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });

    const message = '   Three.js\nSimple text.';
    const shapes = font.generateShapes(message, 100);

    const geometry = new THREE.ShapeGeometry(shapes);

    geometry.computeBoundingBox();

    const xMid = -0.5 * (geometry.boundingBox!.max.x - geometry.boundingBox!.min.x);

    geometry.translate(xMid, 0, 0);

    // make shape ( N.B. edge view not visible )

    const text = new THREE.Mesh(geometry, matLite);
    text.position.z = -150;
    scene.add(text);

    // make line shape ( N.B. edge view remains visible )

    const holeShapes = [] as any[];

    for (let i = 0; i < shapes.length; i++) {

      const shape = shapes[i];

      if (shape.holes && shape.holes.length > 0) {

        for (let j = 0; j < shape.holes.length; j++) {
          const hole = shape.holes[j];
          if(hole.curves&&hole.curves.length>0){
            for (let k = 0; k < hole.curves.length; k++) {
              const curve = hole.curves[k];
              holeShapes.push(curve);
            }
          }
        }
      }
      // 添加直线的点位
      if (shape.curves && shape.curves.length > 0) {
        for (let j = 0; j < shape.curves.length; j++) {
          const curve = shape.curves[j];
          holeShapes.push(curve);
        }
      }
    }

    shapes.push.apply(shapes, holeShapes);

    const lineText = new THREE.Object3D();

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      console.log(shape.type, 'shape')
      let points = [] as any[];
      if (shape.type === 'LineCurve') {
        points = shape.getPoints(20);
      }else {
        points = shape.getPoints();
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.translate(xMid, 0, 0);
      const pointsMesh = new THREE.Points(geometry, new THREE.PointsMaterial({color: color, size: 2}));
      lineText.add(pointsMesh);
      // const lineMesh = new THREE.Line( geometry, matDark );
      // lineText.add( lineMesh );

    }

    scene.add(lineText);


  });

  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.shadowMap.enabled = true;
  renderer.setAnimationLoop(animation);
  renderer.setSize(val.offsetWidth, val.offsetHeight);
  val.appendChild(renderer.domElement)
  // 添加网格辅助线
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);
  // 添加轨道控制器
  const control = new OrbitControls(camera, renderer.domElement);

  function animation(time: number) {
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