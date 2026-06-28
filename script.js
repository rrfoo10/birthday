function createTextSprite(text){

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 128;

    ctx.font = "bold 42px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffffff";
    ctx.fillText(text,256,64);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map:texture,
        transparent:true
    });

    const sprite = new THREE.Sprite(material);

    sprite.scale.set(10,2.5,1);

    return sprite;

}
import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 70);

const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("bg"),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);

const starsGeometry = new THREE.BufferGeometry();

const starCount = 9000;

const positions = new Float32Array(starCount * 3);
const galaxyColors = new Float32Array(starCount * 3);

const galaxyCoreColor = new THREE.Color(0xffffff);
const galaxyMidColor = new THREE.Color(0xff2d6e);
const galaxyOuterColor = new THREE.Color(0x7a0030);

const GALAXY_RADIUS = 60;
const GALAXY_ARMS = 3;
const GALAXY_SPIN = 4.5;
const GALAXY_RANDOMNESS = 0.4;
const cards = {
    about: {
        title: "About You",
        content: `You’re the kind of person people are lucky to meet.

Kind without trying.
Gentle without pretending.

And somehow...

you always make me feel happy.`
    },
    first: {
        title: "The First Thing",
        content: `We met through a screen.
Yet somehow,
you made me feel seen from the first day.

You treated me with a kindness
I’ll never forget,
the way you made me feel comfortable without even trying, the way you treated me.`
    },
    notice: {
        title: "What I Notice",
        content: `I notice that no matter how you are with everyone else,
you’ve always been gentle with me.`
    },
    reason: {
        title: "One Reason",
        content: `If someone asked why you’re special…
I’d probably smile.

Because I don’t have one reason.
I have hundreds of little ones.`
    },
    memory: {
        title: "A Memory",
        content: `I remember the way
you always made me feel special.

You always had a way
of making me feel loved…
like I mattered.

And whenever you noticed
that I was upset,
you never ignored it.
You’d do everything you could
just to make me happy again.`
    },
    never: {
        title: "Something I Never Said",
        content: `There’s something
I never told you…

You became my comfort
without even knowing.

Maybe I never showed it,
because I was afraid.

Afraid that if I cared too much,
I’d end up getting hurt.`
    },
    knew: {
        title: "If You Knew",
        content: `Maybe you already know this…
but I’ll say it anyway.

You’re one of the kindest people
I’ve ever met, ur an amazing person and I love the way you are.

And I hope
you never change.`
    },
    more: {
        title: "Just One More",
        content: `Just one more thing!
If you're upset remember, you have someone who is there for you! (rfo the queen)`
    },
    wish: {
        title: "My Wish",
        content: `I hope life gives you
the same kindness
you’ve always given me.`
    },
    end: {
        title: "The End",
        content: `Thank you…
for making me feel loved,
even when I didn’t know
I needed it.`
    }
};
for (let i = 0; i < starCount; i++) {

    const i3 = i * 3;

    const radius = Math.pow(Math.random(), 1.5) * GALAXY_RADIUS;

    const armAngle = (i % GALAXY_ARMS) * ((Math.PI * 2) / GALAXY_ARMS);
    const spinAngle = (radius / GALAXY_RADIUS) * GALAXY_SPIN;

    const randomness = GALAXY_RANDOMNESS * (radius / GALAXY_RADIUS);
    const randomX = (Math.random() - 0.5) * randomness * GALAXY_RADIUS * 0.3;
    const randomZ = (Math.random() - 0.5) * randomness * GALAXY_RADIUS * 0.3;
    const randomY = (Math.random() - 0.5) * 1.2;

    const angle = armAngle + spinAngle;

    positions[i3] = Math.cos(angle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(angle) * radius + randomZ;

    const t = radius / GALAXY_RADIUS;
    let mixedColor;

    if (t < 0.15) {
        mixedColor = galaxyCoreColor.clone().lerp(galaxyMidColor, t / 0.15);
    } else {
        mixedColor = galaxyMidColor.clone().lerp(galaxyOuterColor, (t - 0.15) / 0.85);
    }

    galaxyColors[i3] = mixedColor.r;
    galaxyColors[i3 + 1] = mixedColor.g;
    galaxyColors[i3 + 2] = mixedColor.b;

}

starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);

starsGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(galaxyColors, 3)
);
const starsMaterial = new THREE.PointsMaterial({
    size: 0.45,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const stars = new THREE.Points(
    starsGeometry,
    starsMaterial
);

stars.position.y = -10;

scene.add(stars);

const galaxyCoreGeometry = new THREE.SphereGeometry(1.4, 32, 32);
const galaxyCoreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95
});
const galaxyCore = new THREE.Mesh(galaxyCoreGeometry, galaxyCoreMaterial);
galaxyCore.position.y = -10;
scene.add(galaxyCore);

// نجوم خلفية متناثرة (سماء عامة، منفصلة عن قرص المجرة)
const bgStarsGeometry = new THREE.BufferGeometry();
const bgStarCount = 1500;
const bgStarPositions = new Float32Array(bgStarCount * 3);

for (let i = 0; i < bgStarCount * 3; i++) {
    bgStarPositions[i] = (Math.random() - 0.5) * 300;
}

bgStarsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(bgStarPositions, 3)
);

const bgStarsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.18,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    depthWrite: false
});

const bgStars = new THREE.Points(bgStarsGeometry, bgStarsMaterial);

scene.add(bgStars);
const light = new THREE.PointLight(0xff6ea8, 80, 300);

light.position.set(0, 0, 0);

scene.add(light);

const heartGroup = new THREE.Group();

scene.add(heartGroup);

const orbitGroup = new THREE.Group();

heartGroup.add(orbitGroup);

const HEART_COUNT = 12000;
const HEART_SCALE = 13 ;        // كبر القلب (تكبير عام)
const HEART_WIDTH_FACTOR = 0.92; // نضغط العرض شوي عشان يصير القلب أنحف وأطول
const FORM_DURATION = 40.0;      // مدة التكوّن بالثواني

function heartPoint() {

    const t = Math.random() * Math.PI * 2;

    const onOutline = Math.random() < 0.8;

    let r;
    if (onOutline) {
        r = 0.985 + Math.random() * 0.02;
    } else {
        r = Math.random() * 0.9;
    }

    let x = 16 * Math.pow(Math.sin(t), 3);
    let y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

   x *= r * HEART_WIDTH_FACTOR;
    y *= r;

    const z = onOutline
        ? (Math.random() - 0.5) * 0.5
        : (Math.random() - 0.5) * 1.8;

    return {
        x: (x * 0.1) * HEART_SCALE,
        y: (y * 0.1 + 1) * HEART_SCALE,
        z: z * HEART_SCALE,
        onOutline
    };
}
const heartGeometry = new THREE.BufferGeometry();

const heartCurrentPositions = new Float32Array(HEART_COUNT * 3);
const heartTargetPositions = new Float32Array(HEART_COUNT * 3);
const heartBasePositions = new Float32Array(HEART_COUNT * 3);

const heartColors = new Float32Array(HEART_COUNT * 3);

const colorOutline = new THREE.Color(0xff1f5e);
const colorGlow = new THREE.Color(0xffffff);
const colorInside = new THREE.Color(0xff6f91);

for (let i = 0; i < HEART_COUNT; i++) {

    const i3 = i * 3;

    const startRadius = 25 + Math.random() * 35;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    heartCurrentPositions[i3] = startRadius * Math.sin(phi) * Math.cos(theta);
    heartCurrentPositions[i3 + 1] = startRadius * Math.sin(phi) * Math.sin(theta);
    heartCurrentPositions[i3 + 2] = startRadius * Math.cos(phi);

    const p = heartPoint();

    heartTargetPositions[i3] = p.x;
    heartTargetPositions[i3 + 1] = p.y;
    heartTargetPositions[i3 + 2] = p.z;

    heartBasePositions[i3] = p.x;
    heartBasePositions[i3 + 1] = p.y;
    heartBasePositions[i3 + 2] = p.z;

    if (p.onOutline) {
        const mixedColor = colorOutline.clone().lerp(colorGlow, Math.random() * 0.04);

        heartColors[i3] = mixedColor.r;
        heartColors[i3 + 1] = mixedColor.g;
        heartColors[i3 + 2] = mixedColor.b;
    } else {
        const mixedColor = colorInside.clone();

        heartColors[i3] = mixedColor.r;
        heartColors[i3 + 1] = mixedColor.g;
        heartColors[i3 + 2] = mixedColor.b;

    }

}

heartGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(heartCurrentPositions, 3)
);

heartGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(heartColors, 3)
);

const heartMaterial = new THREE.PointsMaterial({
    size: 0.11,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const heartPoints = new THREE.Points(heartGeometry, heartMaterial);

heartGroup.add(heartPoints);

let heartFormStartTime = null;
let heartFormed = false;

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}
controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;

controls.enablePan = false;

controls.minDistance = 25;
controls.maxDistance = 110;

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

});

function animate(){

    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    controls.autoRotate = !isHovering;
controls.update();

    stars.rotation.y += 0.0009;
      bgStars.rotation.y += 0.00003;
const delta = clock.getDelta();
    light.intensity = 80 + Math.sin(t * 0.6) * 8;
updateOrbitWords(delta);
    if (heartFormStartTime !== null) {

        const elapsed = t - heartFormStartTime;
        const posAttr = heartGeometry.attributes.position;

        if (!heartFormed) {

            const progress = Math.min(elapsed / FORM_DURATION, 1);
            const eased = easeOutCubic(progress);

            for (let i = 0; i < HEART_COUNT; i++) {

                const i3 = i * 3;

                posAttr.array[i3] = THREE.MathUtils.lerp(
                    posAttr.array[i3],
                    heartTargetPositions[i3],
                    eased * 0.12 + 0.02
                );

                posAttr.array[i3 + 1] = THREE.MathUtils.lerp(
                    posAttr.array[i3 + 1],
                    heartTargetPositions[i3 + 1],
                    eased * 0.12 + 0.02
                );

                posAttr.array[i3 + 2] = THREE.MathUtils.lerp(
                    posAttr.array[i3 + 2],
                    heartTargetPositions[i3 + 2],
                    eased * 0.12 + 0.02
                );

            }

            posAttr.needsUpdate = true;

            if (progress >= 1) {
                heartFormed = true;
            }

        } else {

            const pulse = 1 + Math.sin((elapsed - FORM_DURATION) * 2.2) * 0.045;

            for (let i = 0; i < HEART_COUNT; i++) {

                const i3 = i * 3;

                posAttr.array[i3] = heartBasePositions[i3] * pulse;
                posAttr.array[i3 + 1] = heartBasePositions[i3 + 1] * pulse;
                posAttr.array[i3 + 2] = heartBasePositions[i3 + 2] * pulse;

            }

            posAttr.needsUpdate = true;

            heartGroup.rotation.y += 0.0025;

        }

    }

    renderer.render(scene, camera);

}
const clock = new THREE.Clock();
const orbitUI = document.getElementById("orbit-ui");

const orbitWords = [
    { id: "about",  text: "1-About you",              cardKey: "about"  },
    { id: "first",  text: "2-The first thing",        cardKey: "first"  },
    { id: "notice", text: "3-What i notice",          cardKey: "notice" },
    { id: "reason", text: "4-One reason",              cardKey: "reason" },
    { id: "memory", text: "5-A memory",                cardKey: "memory" },
    { id: "never",  text: "6-Somthing i never said",   cardKey: "never"  },
    { id: "knew",   text: "7-If you knew",              cardKey: "knew"   },
    { id: "more",   text: "8-Just one more",           cardKey: "more"   },
    { id: "wish",   text: "9-My wish",                  cardKey: "wish"   },
    { id: "end",    text: "10-The end",                  cardKey: "end"    }
];

const ORBIT_RADIUS = 50 ;
const ORBIT_CENTER_Y = -6 ;
const ORBIT_SPEED = 0.18;

let isCardOpen = false;
let isHovering = false;

orbitWords.forEach((word, idx) => {

    const div = document.createElement("div");

    div.className = "orbit-word";

    div.textContent = word.text;

    word.element = div;

    word.angle = (idx / orbitWords.length) * Math.PI * 2;

    orbitUI.appendChild(div);

    div.addEventListener("click", () => {
        openCard(word.cardKey);
    });

    div.addEventListener("mouseenter", () => {
        isHovering = true;
console.log("hover ON");
    });

    div.addEventListener("mouseleave", () => {
        isHovering = false;
console.log("hover OFF");
    });

});

function updateOrbitWords(delta) {

    for (const word of orbitWords) {

        if (!isHovering) {
    word.angle += ORBIT_SPEED * delta;
console.log("rotating, isHovering =", isHovering);
}

        const x = Math.cos(word.angle) * ORBIT_RADIUS;
        const z = Math.sin(word.angle) * ORBIT_RADIUS;
        const y = ORBIT_CENTER_Y;

        const pos = new THREE.Vector3(x, y, z);
        pos.project(camera);

        const behindCamera = pos.z > 1;

        const screenX = (pos.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (-pos.y * 0.5 + 0.5) * window.innerHeight;

        word.element.style.left = screenX + "px";
        word.element.style.top = screenY + "px";
        word.element.style.transform = "translate(-50%,-50%)";

        if (behindCamera || isCardOpen || heartFormStartTime === null) {
    word.element.style.opacity = "0";
    word.element.style.pointerEvents = "none";
} else {
    const depthFade = THREE.MathUtils.clamp(1 - (pos.z + 0.6), 7, 1);
    word.element.style.opacity = String(depthFade);
    word.element.style.pointerEvents = "auto";
}
    }

}

const cardOverlay = document.getElementById("card-overlay");
const cardTitle = document.getElementById("card-title");
const cardContent = document.getElementById("card-content");
const closeCardBtn = document.getElementById("close-card");

function openCard(key) {

    const data = cards[key];
    if (!data) return;

    cardTitle.textContent = data.title;
    cardContent.textContent = data.content;

    cardOverlay.style.display = "flex";

    cardOverlay.classList.remove("show");
    requestAnimationFrame(() => {
        cardOverlay.classList.add("show");
    });

    isCardOpen = true;

}

function closeCard() {

    cardOverlay.classList.remove("show");

    isCardOpen = false;

    setTimeout(() => {
        if (!isCardOpen) {
            cardOverlay.style.display = "none";
        }
    }, 300);

}

closeCardBtn.addEventListener("click", closeCard);

cardOverlay.addEventListener("click", (e) => {
    if (e.target === cardOverlay) {
        closeCard();
    }
});
 
animate();

const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("startBtn");
const music = document.getElementById("music");

music.volume = 0.3;

startBtn.addEventListener("click", () => {

    music.play();

    startScreen.style.opacity = "0";

    heartFormStartTime = clock.getElapsedTime();

    setTimeout(() => {

        startScreen.style.display = "none";

    }, 700);

});

scene.add(bgStars);
// ===== نجوم أرضية تحت المجرة =====

// ===== Pink Floor Stars =====

const floorGeometry = new THREE.BufferGeometry();
const floorCount = 12000;

const floorPositions = new Float32Array(floorCount * 3);

for (let i = 0; i < floorCount; i++) {

    const i3 = i * 3;

   const angle = Math.random() * Math.PI * 2;
const radius = Math.sqrt(Math.random()) * 90;

floorPositions[i3] = Math.cos(angle) * radius;
floorPositions[i3 + 2] = Math.sin(angle) * radius;
    // تحت المجرة
    floorPositions[i3 + 1] = -16 + (Math.random() - 0.5) * 1.2;
    

}

floorGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(floorPositions, 3)
);

const floorMaterial = new THREE.PointsMaterial({
    color: 0xff8fd8,
    size: 0.2,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const floorStars = new THREE.Points(
    floorGeometry,
    floorMaterial
);

scene.add(floorStars);