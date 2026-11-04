/* === STARFIELD CANVAS LOGIC === */
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
}

class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.2 + 0.05;
        this.opacity = Math.random();
        this.fadeSpeed = (Math.random() * 0.02) + 0.005;
        this.fadeDir = Math.random() > 0.5 ? 1 : -1;
        
        const colors = ['#ffffff', '#ffb3c6', '#ff1a53'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.y -= this.speedY;
        if (this.y < 0) {
            this.y = height;
            this.x = Math.random() * width;
        }

        this.opacity += this.fadeSpeed * this.fadeDir;
        if (this.opacity <= 0.1) {
            this.fadeDir = 1;
        } else if (this.opacity >= 1) {
            this.fadeDir = -1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
    }
}

function initStars() {
    stars = [];
    const numStars = Math.floor((width * height) / 3000); 
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

function animateStars() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', resize);
resize();
animateStars();

/* === UI & AUDIO INTERACTION === */
const introSection = document.getElementById('intro-section');
const mainContent = document.getElementById('main-content');
const enterBtn = document.getElementById('enter-btn');
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');
const musicText = document.getElementById('music-text');

let isMusicPlaying = false;

enterBtn.addEventListener('click', () => {
    introSection.style.opacity = '0';
    setTimeout(() => {
        introSection.style.display = 'none';
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = '1';
        
        bgm.play().then(() => {
            isMusicPlaying = true;
            updateMusicUI();
        }).catch(err => {
            console.log("Audio autoplay prevented", err);
            isMusicPlaying = false;
            updateMusicUI();
        });
        
    }, 1500);
});

musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgm.pause();
        isMusicPlaying = false;
    } else {
        bgm.play();
        isMusicPlaying = true;
    }
    updateMusicUI();
});

function updateMusicUI() {
    if (isMusicPlaying) {
        musicIcon.textContent = '🔊';
        musicText.textContent = 'MUSIC ON';
        musicBtn.classList.add('music-pulse');
    } else {
        musicIcon.textContent = '🔇';
        musicText.textContent = 'MUSIC OFF';
        musicBtn.classList.remove('music-pulse');
    }
}

/* === LIGHTBOX MODAL LOGIC === */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openModal(imageSrc) {
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(e) {
    if(e) e.stopPropagation();
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        lightboxImg.src = '';
    }, 400);
}

/* === SCROLL REVEAL === */
const revealElements = document.querySelectorAll('.reveal-text');
const revealOptions = { threshold: 0.3, rootMargin: "0px 0px -50px 0px" };
const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => revealOnScroll.observe(el));

/* === THREE.JS GALAXY & PHOTO ORBIT LOGIC === */
const galaxyContainer = document.getElementById('galaxy-container');
const webglCanvas = document.getElementById('webgl-canvas');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, galaxyContainer.clientWidth / galaxyContainer.clientHeight, 0.1, 1000);
camera.position.set(0, 5, 28);

const renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, antialias: true, alpha: true });
renderer.setSize(galaxyContainer.clientWidth, galaxyContainer.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xff1a53, 3, 50);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// 1. Core Red Particle Sphere
const coreParticleCount = 4500;
const coreGeometry = new THREE.BufferGeometry();

// BAGIAN YANG DIPERBAIKI (Penambahan tanda bintang / perkalian)
const corePositions = new Float32Array(coreParticleCount * 3);
const coreColors = new Float32Array(coreParticleCount * 3);

const colorPalette = [
    new THREE.Color(0xff0055),
    new THREE.Color(0xff1a53),
    new THREE.Color(0xffffff),
    new THREE.Color(0xff6699)
];

for (let i = 0; i < coreParticleCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 4.5 + Math.random() * 0.8;
    
    corePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    corePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    corePositions[i * 3 + 2] = r * Math.cos(phi);
    
    const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    coreColors[i * 3] = col.r;
    coreColors[i * 3 + 1] = col.g;
    coreColors[i * 3 + 2] = col.b;
}

coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
coreGeometry.setAttribute('color', new THREE.BufferAttribute(coreColors, 3));

function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,100,150,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}
const particleTexture = createParticleTexture();

const coreMaterial = new THREE.PointsMaterial({
    size: 0.35,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    depthWrite: false
});

const coreSphere = new THREE.Points(coreGeometry, coreMaterial);
scene.add(coreSphere);

// 2. Ring Particles
const ringParticleCount = 8000;
const ringGeometry = new THREE.BufferGeometry();

// BAGIAN YANG DIPERBAIKI (Penambahan tanda bintang / perkalian)
const ringPositions = new Float32Array(ringParticleCount * 3);
const ringColors = new Float32Array(ringParticleCount * 3);

for (let i = 0; i < ringParticleCount; i++) {
    const radius = 7 + Math.random() * 14;
    const angle = Math.random() * Math.PI * 2;
    const yOffset = (Math.random() - 0.5) * 1.2;
    
    ringPositions[i * 3] = Math.cos(angle) * radius;
    ringPositions[i * 3 + 1] = yOffset;
    ringPositions[i * 3 + 2] = Math.sin(angle) * radius;
    
    const isWhite = Math.random() > 0.4;
    const col = isWhite ? new THREE.Color(0xffffff) : new THREE.Color(0xff1a53);
    ringColors[i * 3] = col.r;
    ringColors[i * 3 + 1] = col.g;
    ringColors[i * 3 + 2] = col.b;
}

ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
ringGeometry.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));

const ringMaterial = new THREE.PointsMaterial({
    size: 0.22,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    depthWrite: false
});

const ringGroup = new THREE.Group();
ringGroup.add(new THREE.Points(ringGeometry, ringMaterial));
ringGroup.rotation.x = 0.35;
ringGroup.rotation.z = 0.1;
scene.add(ringGroup);

// 3. Orbiting Photos
const photoUrls = [
    'photo1.jpg',
    'photo2.jpg',
    'photo3.jpg',
    'photo4.jpg',
    'photo5.jpg',
    'photo6.jpg',
    'photo7.jpg',
    'photo8.jpg'
];

let photoMeshes = [];
const photoGroup = new THREE.Group();
scene.add(photoGroup);
const textureLoader = new THREE.TextureLoader();

function createFallbackTexture(index) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ff1a53'; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`Memory ${index + 1}`, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

const orbitRadius = 13;
photoUrls.forEach((url, index) => {
    const angle = (index / photoUrls.length) * Math.PI * 2;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = (Math.sin(index * 1.5) * 2.5);
    
    const cardGeo = new THREE.CircleGeometry(1.6, 64);
    const cardMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide, 
        transparent: true 
    });
    
    textureLoader.load(
        url,
        (texture) => {
            cardMat.map = texture;
            cardMat.needsUpdate = true;
        },
        undefined,
        (err) => {
            console.warn(`Gagal memuat ${url}. Gunakan local server (Live Server) untuk mengatasi masalah CORS.`, err);
            cardMat.map = createFallbackTexture(index);
            cardMat.needsUpdate = true;
        }
    );
    
    const mesh = new THREE.Mesh(cardGeo, cardMat);
    mesh.position.set(x, y, z);
    mesh.userData = { index: index, photoUrl: url };
    
    const bubbleGeo = new THREE.SphereGeometry(1.75, 32, 32);
    const bubbleMat = new THREE.MeshBasicMaterial({ 
        color: 0xff1a53, 
        transparent: true, 
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false
    });
    const bubbleMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
    mesh.add(bubbleMesh);

    const ringGeo = new THREE.RingGeometry(1.6, 1.7, 64);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff6699,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.z = 0.01; 
    mesh.add(ringMesh);
    
    photoGroup.add(mesh);
    photoMeshes.push(mesh);
});

// 4. Raycaster for Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

webglCanvas.addEventListener('click', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(photoMeshes);
    
    if (intersects.length > 0) {
        const targetMesh = intersects[0].object;
        openModal(targetMesh.userData.photoUrl);
    }
});

// 5. Animation Loop
const clock = new THREE.Clock();
function animate3D() {
    requestAnimationFrame(animate3D);
    const elapsedTime = clock.getElapsedTime();
    
    coreSphere.rotation.y = elapsedTime * 0.15;
    ringGroup.rotation.y = elapsedTime * 0.08;
    photoGroup.rotation.y = elapsedTime * 0.05;
    
    const pulseScale = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
    coreSphere.scale.set(pulseScale, pulseScale, pulseScale);
    
    photoMeshes.forEach(mesh => {
        mesh.quaternion.copy(camera.quaternion);
    });
    
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = galaxyContainer.clientWidth / galaxyContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(galaxyContainer.clientWidth, galaxyContainer.clientHeight);
});

animate3D();