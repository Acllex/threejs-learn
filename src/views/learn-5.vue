<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, watch, onMounted } from 'vue'
import { loadGLTFModel } from '@/utils/index'
import * as TWEEN from '@tweenjs/tween.js'

let GLBs = [
  {
    name: 'EXT',
    path: 'gltf/learn-5/Lynkco09_EXT_d.glb'
  },
  {
    name: 'INT',
    path: 'gltf/learn-5/Lynkco09_INT_d.glb'
  },
  {
    name: 'Sunproof',
    path: 'gltf/learn-5/Lynkco09_Sunproof_d.glb'
  },
  {
    name: 'Trunk',
    path: 'gltf/learn-5/Lynkco09_Trunk_d.glb'
  },
  {
    name: 'Tires',
    path: 'gltf/learn-5/Lynkco09_Tires_d.glb'
  },
  {
    name: 'LBDoor',
    path: 'gltf/learn-5/Lynkco09_LBDoor_d.glb'
  },
  {
    name: 'LFDoor',
    path: 'gltf/learn-5/Lynkco09_LFDoor_d.glb'
  },
  {
    name: 'RFDoor',
    path: 'gltf/learn-5/Lynkco09_RFDoor_d.glb'
  },
  {
    name: 'RBDoor',
    path: 'gltf/learn-5/Lynkco09_RBDoor_d.glb'
  }
]

let tweenCollection = {
  LBDoor: {
    tween: null,
    from: { value: null },
    to: { value: null }
  },
  RBDoor: {
    tween: null,
    from: { value: null },
    to: { value: null }
  },
  LFDoor: {
    tween: null,
    from: { value: null },
    to: { value: null }
  },
  RFDoor: {
    tween: null,
    from: { value: null },
    to: { value: null }
  },
  Trunk: {
    tween: null,
    from: { value: null },
    to: { value: null }
  }
} as any
const threeRef = ref<HTMLElement | null>(null)

const setupTweenDoor = (door: any, status: string) => {
  const { from, to } = door.rotateDirection[status]
  if (status == 'open') {
    door.status = 'close'
  }
  if (status == 'close') {
    door.status = 'open'
  }

  let lastLocation = null
  if (tweenCollection[door.name].tween) {
    lastLocation = { value: tweenCollection[door.name].from.value }
    tweenCollection[door.name].tween.stop()
  } else {
    lastLocation = { value: from.value }
  }
  tweenCollection[door.name].tween = new TWEEN.Tween(lastLocation)
    .to(to, 1000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(function (lastLocation: { value: number }) {
      door.outer.rotation[door.rotateDirection.rotateAxis] = THREE.MathUtils.degToRad(
        lastLocation.value
      )
      tweenCollection[door.name].from.value = lastLocation.value
    })
    .onComplete(() => {
      tweenCollection[door.name] = {
        tween: null,
        from: { value: null },
        to: { value: null }
      }
    })
    .start()
}
watch(threeRef, (val) => {
  if (!val) return
  let models = [] as any
  const scene = new THREE.Scene()
  // 修改背景颜色
  scene.background = new THREE.Color(0xffffff)
  // 添加环境光
  const light = new THREE.AmbientLight(0x404040) // 柔和的白光
  scene.add(light)
  // 添加平行光
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  // directionalLight.castShadow = true
  // scene.add(directionalLight)
  // 添加环境光
  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(0, 2, 0)
  pointLight.castShadow = true
  scene.add(pointLight)

  // 创建地面
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
  )
  // 接收阴影
  ground.receiveShadow = true
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)
  // 添加摄像机
  const camera = new THREE.PerspectiveCamera(75, val.offsetWidth / val.offsetHeight, 0.01)
  const target = new THREE.Vector3(-0.5, 0.5, 0)
  const initialCameraPosition = new THREE.Vector3(
    5 * Math.sin(0.2 * Math.PI),
    2.5,
    5 * Math.cos(0.2 * Math.PI)
  )
  camera.position.copy(initialCameraPosition)
  camera.lookAt(target)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.setAnimationLoop(animation)
  renderer.setSize(val.offsetWidth, val.offsetHeight)
  val.appendChild(renderer.domElement)
  Promise.all(
    GLBs.map((item) =>
      loadGLTFModel(scene, item, renderer, {
        receiveShadow: true,
        castShadow: true
      })
    )
  ).then((res) => {
    models = res
  })

  // 添加轨道控制器
  const control = new OrbitControls(camera, renderer.domElement)
  control.autoRotate = true
  control.target = target
  let frame = 0
  function animation() {
    frame = frame <= 100 ? frame + 1 : frame

    if (frame <= 100) {
      const p = initialCameraPosition
      const rotSpeed = -Math.sqrt(1 - Math.pow(frame / 120 - 1, 4)) * Math.PI * 20
      camera.position.x = p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed)
      camera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed)
      camera.lookAt(target)
    } else {
      control.update()
    }

    TWEEN.update()
    renderer.render(scene, camera)
  }

  // 拾取对象
  const pickupObjects = (event: { clientX: number; clientY: number }) => {
    const scW = val.clientWidth
    const scH = val.clientHeight
    const offsetLeft = val.offsetLeft
    const offsetTop = val.offsetTop

    let mouse = new THREE.Vector2()
    mouse.x = ((event.clientX - offsetLeft) / scW) * 2 - 1
    mouse.y = -((event.clientY - offsetTop) / scH) * 2 + 1

    //使用射线
    let raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    let intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) {
      if (
        intersects[0].object.name.includes('Door') ||
        intersects[0].object.name.includes('Trunk')
      ) {
        let doorName = intersects[0].object.name.split('_')[0]
        let door = models.find((item: { name: string }) => item.name === doorName)
        console.log(door, door.status, 111)

        if (door && door.outer && door.status) {
          setupTweenDoor(door, door.status)
        }
      }
      if (intersects[0].object.name.includes('INT')) {
        control.autoRotate = false
        let INT = models.find((item: { name: string }) => item.name === 'INT')
        setupTweenCarIn(INT)
      }
    }
  }
  window.addEventListener('click', pickupObjects, false)

  const setupTweenCarIn = (model: { carInCameraPosition: { x: any; y: any; z: any } }) => {
    const { x: cx, y: cy, z: cz } = camera.position
    const { x: tocx, y: tocy, z: tocz } = model.carInCameraPosition

    setupTweenCamera(
      { cx, cy, cz, ox: 0, oy: 0, oz: 0 },
      { cx: tocx, cy: tocy, cz: tocz, ox: 0, oy: tocy, oz: 0.1 }
    )

    function setupTweenCamera(
      source: { cx: any; cy: any; cz: any; ox: number; oy: number; oz: number },
      target: { cx: any; cy: any; cz: any; ox: number; oy: any; oz: number }
    ) {
      const carTween = new TWEEN.Tween(source).to(target, 2000).easing(TWEEN.Easing.Quadratic.Out)
      carTween.onUpdate(function (that: { cx: any; cy: any; cz: any; ox: any; oy: any; oz: any }) {
        camera.position.set(that.cx, that.cy, that.cz)
        control.target.set(that.ox, that.oy, that.oz)
      })
      carTween.start()
    }
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
