import './scss/index.scss'
import { getPixelRatio } from './utils';
import * as THREE from 'three';

class Portfolio3D {

    setup(canvas) {
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        this.objects = {}
        this.lights = {}

        this.objectsDistance = 4

        this.scrollY = window.scrollY

        this.cursor = { x: 0, y: 0 }

        this.scene = new THREE.Scene()
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(getPixelRatio())
        this.cameraGroup = new THREE.Group;
        this.scene.add(this.cameraGroup);
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.cameraGroup.add(this.camera)
        this.camera.position.z = 6
        this.clock = new THREE.Clock()
        this.previousTime = 0
    }


    startEvents() {
        window.addEventListener('resize', () => {
            this.sizes.width = innerWidth
            this.sizes.height = innerHeight
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(this.sizes.width, this.sizes.height)
            this.renderer.setPixelRatio(getPixelRatio())
        })

        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY
        })

        window.addEventListener('mousemove', (event) => {
            this.cursor.x = event.clientX / this.sizes.width - 0.5
            this.cursor.y = event.clientY / this.sizes.height - 0.5


        }, { passive: true })
    }

    animationLoop() {
        const elapsedTime = this.clock.getElapsedTime()
        const deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

        this.camera.position.y = - scrollY / this.sizes.height * this.objectsDistance

        Object.values(this.objects).forEach(mesh => {
            mesh.rotation.x = elapsedTime * 0.1
            mesh.rotation.y = elapsedTime * 0.12
        })

        const parallaxX = this.cursor.x * 0.8
        const parallaxY = - this.cursor.y * 0.8
        this.cameraGroup.position.x += (parallaxX - this.cameraGroup.position.x) * 5 * deltaTime
        this.cameraGroup.position.y += (parallaxY - this.cameraGroup.position.y) * 5 * deltaTime

        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.animationLoop.bind(this))
    }

    createObjects() {
        const material = new THREE.MeshToonMaterial({ color: '#ffffff' })

        const mesh1 = new THREE.Mesh(
            new THREE.TorusGeometry(1, 0.4, 16, 60),
            material
        )
        const mesh2 = new THREE.Mesh(
            new THREE.ConeGeometry(1, 2, 32),
            material
        )
        const mesh3 = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
            material
        )

        mesh1.scale.set(.5, .5, .5)
        mesh3.scale.set(.5, .5, .5)

        mesh1.position.y = - this.objectsDistance * 0
        mesh2.position.y = - this.objectsDistance * 1
        mesh3.position.y = - this.objectsDistance * 2

        mesh1.position.x = 2
        mesh2.position.x = - 2
        mesh3.position.x = 2

        this.scene.add(mesh1, mesh2, mesh3)

        this.objects.mesh1 = mesh1;
        this.objects.mesh2 = mesh2;
        this.objects.mesh3 = mesh3;

        const particlesCount = 400
        const positions = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 10
            positions[i * 3 + 1] = this.objectsDistance * 0.5 - Math.random() * this.objectsDistance * 10
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        }

        const particlesGeometry = new THREE.BufferGeometry()
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const particlesMaterial = new THREE.PointsMaterial({
            color: '#ffeded',
            sizeAttenuation: true,
            size: 0.03
        })
        const particles = new THREE.Points(particlesGeometry, particlesMaterial)
        this.scene.add(particles);

    }

    createLights() {
        const light = new THREE.DirectionalLight('#ffffff', 1)
        light.position.set(1, 1, 0)
        this.scene.add(light)
        this.lights.directionalLight = light
    }

    init() {
        this.setup(document.querySelector('canvas.screen'))
        this.startEvents()
        this.createObjects()
        this.createLights()
        this.animationLoop()
    }
}

const Folio = new Portfolio3D()

Folio.init();


