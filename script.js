// Глобальные переменные
let scene, camera, renderer, controls;
let stadium, ball, player1, player2, goalkeeper;
let isPlaying = false;
let attempts = 0;
let points = 0;
let currentControlledPlayer = null;

// Инициализация Three.js
function init3D() {
  // Создаем сцену
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00ff00);

  // Камера
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 20);

  // Рендерер
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // Освещение
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Загрузка моделей
  const loader = new THREE.GLTFLoader();

  loader.load('models/stadium.glb', (gltf) => {
    stadium = gltf.scene;
    stadium.scale.set(1, 1, 1);
    stadium.position.set(0, 0, 0);
    scene.add(stadium);
  });

  loader.load('models/ball.glb', (gltf) => {
    ball = gltf.scene;
    ball.scale.set(0.5, 0.5, 0.5);
    ball.position.set(0, 0.5, 0);
    scene.add(ball);
  });

  loader.load('models/player1.glb', (gltf) => {
    player1 = gltf.scene;
    player1.scale.set(0.8, 0.8, 0.8);
    player1.position.set(-5, 0, 0);
    player1.castShadow = true;
    scene.add(player1);
    currentControlledPlayer = player1; // По умолчанию управляем Роналду
  });

  loader.load('models/player2.glb', (gltf) => {
    player2 = gltf.scene;
    player2.scale.set(0.8, 0.8, 0.8);
    player2.position.set(5, 0, 0);
    player2.castShadow = true;
    scene.add(player2);
  });

  loader.load('models/goalkeeper.glb', (gltf) => {
    goalkeeper = gltf.scene;
    goalkeeper.scale.set(0.8, 0.8, 0.8);
    goalkeeper.position.set(0, 0, 10);
    goalkeeper.castShadow = true;
    scene.add(goalkeeper);
  });

  // Анимация
  function animate() {
    requestAnimationFrame(animate);
    if (isPlaying) {
      // Здесь можно добавить логику движения мяча и игроков
      // Пока просто вращаем мяч
      if (ball) ball.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
  }

  animate();

  // Обработка ресайза окна
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Переключение экранов
function switchToGameplay() {
  document.getElementById('homeScreen').classList.remove('active');
  document.getElementById('gameplayScreen').classList.add('active');
  isPlaying = true;
  resetGame();
  init3D(); // Инициализируем 3D только при переходе на игру
}

function showClub() {
  document.getElementById('homeScreen').classList.remove('active');
  document.getElementById('clubScreen').classList.add('active');
  loadPlayerCards();
}

function showMarket() {
  alert("Магазин пока не реализован!");
}

// Сброс игры
function resetGame() {
  attempts = 0;
  points = 0;
  updateHUD();
}

// Обновление HUD
function updateHUD() {
  document.getElementById('attempts').textContent = `${attempts}/99`;
  document.getElementById('points').textContent = points;
}

// Загрузка карточек игроков из Futbin
function loadPlayerCards() {
  const playerData = [
    {
      name: "Konaté",
      rating: 98,
      image: "https://cdn3.futbin.com/content/fifa25/img/players/p84123758.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=dd74d4fdfc9aec8e4f69b85e5bacb65d",
      team: "Liverpool"
    },
    {
      name: "Griezmann",
      rating: 98,
      image: "https://cdn3.futbin.com/content/fifa25/img/players/p151189709.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=c9237669d27d934cfdbdb3ede5e9a48a",
      team: "Atlético Madrid"
    },
    {
      name: "Cristiano Ronaldo",
      rating: 97,
      image: "https://cdn3.futbin.com/content/fifa25/img/players/p184758707.png?fm=png&ixlib=java-2.1.0&verzion=2&w=100&s=ff8bfad1cf1fa5876da738ff69749703",
      team: "Al Nassr"
    },
    {
      name: "Lionel Messi",
      rating: 97,
      image: "https://cdn3.futbin.com/content/fifa25/img/players/p134470099.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=a2af0c196cda265978c6316532b0e7c2",
      team: "Inter Miami"
    }
  ];

  const container = document.querySelector('.player-cards');
  container.innerHTML = '';

  playerData.forEach(player => {
    const card = document.createElement('div');
    card.className = 'player-card';

    const img = document.createElement('img');
    img.src = player.image;
    img.alt = player.name;

    const name = document.createElement('div');
    name.className = 'player-name';
    name.textContent = player.name;

    const rating = document.createElement('div');
    rating.className = 'player-rating';
    rating.textContent = player.rating;

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(rating);

    // Если это лучший игрок матча — добавляем золотой мяч
    if (player.name === "Cristiano Ronaldo") {
      const goldenBall = document.createElement('img');
      goldenBall.src = 'models/golden_ball.glb'; // Замените на реальный путь к изображению или 3D модель
      goldenBall.className = 'golden-ball';
      card.appendChild(goldenBall);
    }

    container.appendChild(card);
  });
}

// Обработчики кнопок управления
document.getElementById('shootBtn').addEventListener('click', () => {
  if (!isPlaying) return;
  attempts++;
  if (Math.random() > 0.3) { // 70% шанс забить
    points++;
    playGoalSound();
  }
  updateHUD();
});

document.getElementById('passBtn').addEventListener('click', () => {
  console.log("Пас!");
});

document.getElementById('throughBtn').addEventListener('click', () => {
  console.log("Проникающий пас!");
});

document.getElementById('sprintBtn').addEventListener('click', () => {
  console.log("Спринт и навык!");
});

document.getElementById('joystick').addEventListener('touchstart', handleTouchStart);
document.getElementById('joystick').addEventListener('touchmove', handleTouchMove);
document.getElementById('joystick').addEventListener('touchend', handleTouchEnd);

let joystickCenter = { x: 0, y: 0 };
let stickPosition = { x: 0, y: 0 };

function handleTouchStart(e) {
  e.preventDefault();
  const rect = e.target.getBoundingClientRect();
  joystickCenter.x = rect.left + rect.width / 2;
  joystickCenter.y = rect.top + rect.height / 2;
  moveStick(e.touches[0]);
}

function handleTouchMove(e) {
  e.preventDefault();
  moveStick(e.touches[0]);
}

function handleTouchEnd(e) {
  e.preventDefault();
  const stick = document.querySelector('.stick');
  stick.style.transform = 'translate(0, 0)';
  stickPosition = { x: 0, y: 0 };
}

function moveStick(touch) {
  const stick = document.querySelector('.stick');
  const deltaX = touch.clientX - joystickCenter.x;
  const deltaY = touch.clientY - joystickCenter.y;
  const maxDistance = 30;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  if (distance > maxDistance) {
    const angle = Math.atan2(deltaY, deltaX);
    stickPosition.x = Math.cos(angle) * maxDistance;
    stickPosition.y = Math.sin(angle) * maxDistance;
  } else {
    stickPosition.x = deltaX;
    stickPosition.y = deltaY;
  }

  stick.style.transform = `translate(${stickPosition.x}px, ${stickPosition.y}px)`;

  // Здесь можно добавить логику перемещения игрока по полю
  if (currentControlledPlayer) {
    currentControlledPlayer.position.x += stickPosition.x * 0.01;
    currentControlledPlayer.position.z -= stickPosition.y * 0.01;
  }
}

function playGoalSound() {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-effect-271.mp3');
  audio.play().catch(e => console.log("Звук не воспроизвелся"));
}

// Инициализация при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  init3D();
});
