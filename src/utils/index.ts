import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { addMaterialAndAction } from './MaterialAndAction'

export function loadGLTFModel(
  scene: { add: (arg0: any) => any },
  glb: { name: any; path: string },
  renderer: any,
  options = { receiveShadow: true, castShadow: true }
) {
  const name = glb.name

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader()
    const DRACOloader = new DRACOLoader()

    DRACOloader.setDecoderPath('draco/')

    loader.setDRACOLoader(DRACOloader)
    loader.load(
      glb.path,
      (gltf: any) => {
        const { outer, obj } = addMaterialAndAction(gltf, name, renderer, options)
        outer ? scene.add(outer) : scene.add(obj)
        resolve(obj)
      },
      undefined,
      function (error: any) {
        reject(error)
      }
    )
  })
}
