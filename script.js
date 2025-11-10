// =================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// =================================

// Three.js
let scene, camera, renderer, controls;
let stadium, ballMesh, ballBody;
let players = []; // Массив всех 22 игроков
let currentControlledPlayer = null;
let clock = new THREE.Clock();
let mixer = null; // Для анимаций
let actions = {}; // Хранение анимаций
let activeAction = null;

// Cannon.js
let world;

// Игровые переменные
let isPlaying = false;
let scoreHome = 0;
let scoreAway = 0;
let matchTime = 90; // в минутах
let extraTime = 0;
let isExtraTime = false;
let isPenaltyShootout = false;
let attempts = 0;
let points = 0;

// Список игроков с их характеристиками и позициями
const playerData = [
  // Команда 1 (Домашняя)
  { id: 'ronaldo', name: 'Cristiano Ronaldo', rating: 97, position: 'ST', pac: 93, sho: 99, pas: 90, dri: 94, def: 75, phy: 99, team: 'Al Nassr', nationality: 'Portugal', model: 'models/player1.glb' },
  { id: 'messi', name: 'Lionel Messi', rating: 97, position: 'CAM', pac: 94, sho: 92, pas: 97, dri: 98, def: 80, phy: 87, team: 'Inter Miami', nationality: 'Argentina', model: 'models/player2.glb' },
  { id: 'kane', name: 'Kane', rating: 98, position: 'CM', pac: 93, sho: 96, pas: 98, dri: 94, def: 92, phy: 93, team: 'Bayern Munich', nationality: 'England', model: 'models/player1.glb' },
  { id: 'griezmann', name: 'Griezmann', rating: 98, position: 'CAM', pac: 92, sho: 94, pas: 97, dri: 98, def: 80, phy: 87, team: 'Atlético Madrid', nationality: 'France', model: 'models/player2.glb' },
  { id: 'konate', name: 'Konaté', rating: 98, position: 'GK', pac: 98, sho: 97, pas: 95, dri: 94, def: 85, phy: 94, team: 'Liverpool', nationality: 'France', model: 'models/goalkeeper.glb' },
  { id: 'rodri', name: 'Rodri', rating: 98, position: 'CB', pac: 93, sho: 80, pas: 96, dri: 93, def: 98, phy: 95, team: 'Man City', nationality: 'Spain', model: 'models/player1.glb' },
  { id: 'mcTominay', name: 'McTominay', rating: 98, position: 'ST', pac: 93, sho: 99, pas: 90, dri: 94, def: 75, phy: 99, team: 'Man Utd', nationality: 'Scotland', model: 'models/player2.glb' },
  { id: 'hansen', name: 'Hansen', rating: 97, position: 'RW', pac: 96, sho: 95, pas: 95, dri: 97, def: 58, phy: 86, team: 'Chelsea', nationality: 'Denmark', model: 'models/player1.glb' },
  { id: 'viniJr', name: 'Vini Jr.', rating: 97, position: 'LW', pac: 99, sho: 91, pas: 90, dri: 98, def: 38, phy: 78, team: 'Real Madrid', nationality: 'Brazil', model: 'models/player2.glb' },
  { id: 'salah', name: 'Salah', rating: 97, position: 'RW', pac: 97, sho: 95, pas: 92, dri: 97, def: 60, phy: 85, team: 'Liverpool', nationality: 'Egypt', model: 'models/player1.glb' },
  { id: 'pelé', name: 'Pelé', rating: 97, position: 'CAM', pac: 95, sho: 97, pas: 93, dri: 96, def: 61, phy: 82, team: 'Santos', nationality: 'Brazil', model: 'models/player2.glb' },

  // Команда 2 (Гостевая)
  { id: 'mbappe', name: 'Mbappé', rating: 91, position: 'ST', pac: 97, sho: 90, pas: 80, dri: 92, def: 36, phy: 78, team: 'Real Madrid', nationality: 'France', model: 'models/player1.glb' },
  { id: 'dembele', name: 'Dembélé', rating: 97, position: 'RW', pac: 99, sho: 90, pas: 94, dri: 97, def: 55, phy: 75, team: 'Barcelona', nationality: 'France', model: 'models/player2.glb' },
  { id: 'cruyff', name: 'Cruyff', rating: 98, position: 'LM', pac: 96, sho: 92, pas: 98, dri: 99, def: 80, phy: 86, team: 'Ajax', nationality: 'Netherlands', model: 'models/player1.glb' },
  { id: 'maradona', name: 'Maradona', rating: 98, position: 'RW', pac: 94, sho: 94, pas: 97, dri: 99, def: 45, phy: 85, team: 'Napoli', nationality: 'Argentina', model: 'models/player2.glb' },
  { id: 'vanDijk', name: 'van Dijk', rating: 97, position: 'CB', pac: 89, sho: 68, pas: 81, dri: 80, def: 97, phy: 96, team: 'Liverpool', nationality: 'Netherlands', model: 'models/player1.glb' },
  { id: 'tah', name: 'Tah', rating: 97, position: 'CB', pac: 90, sho: 70, pas: 83, dri: 85, def: 97, phy: 95, team: 'Bayer Leverkusen', nationality: 'Germany', model: 'models/player2.glb' },
  { id: 'bastoni', name: 'Bastoni', rating: 97, position: 'CB', pac: 89, sho: 55, pas: 87, dri: 90, def: 97, phy: 96, team: 'Inter Milan', nationality: 'Italy', model: 'models/player1.glb' },
  { id: 'osimhen', name: 'Osimhen', rating: 97, position: 'ST', pac: 97, sho: 97, pas: 81, dri: 93, def: 53, phy: 92, team: 'Napoli', nationality: 'Nigeria', model: 'models/player2.glb' },
  { id: 'wilson', name: 'Wilson', rating: 97, position: 'ST', pac: 98, sho: 95, pas: 87, dri: 98, def: 54, phy: 93, team: 'Arsenal', nationality: 'England', model: 'models/player1.glb' },
  { id: 'retgui', name: 'Retegui', rating: 97, position: 'ST', pac: 96, sho: 97, pas: 89, dri: 95, def: 60, phy: 94, team: 'Juventus', nationality: 'Italy', model: 'models/player2.glb' },
  { id: 'shaw', name: 'Shaw', rating: 97, position: 'ST', pac: 94, sho: 97, pas: 86, dri: 93, def: 43, phy: 96, team: 'Man Utd', nationality: 'England', model: 'models/player1.glb' }
];

// Стартовые позиции игроков (в метрах, относительно центра поля)
const startingPositions = [
  // Команда 1 (домашняя) - красный цвет
  { x: 0, z: -40 }, // GK
  { x: -10, z: -30 }, // LB
  { x: 10, z: -30 }, // RB
  { x: -5, z: -25 }, // LCB
  { x: 5, z: -25 }, // RCB
  { x: -15, z: -15 }, // LM
  { x: 15, z: -15 }, // RM
  { x: -5, z: -10 }, // LCM
  { x: 5, z: -10 }, // RCM
  { x: 0, z: -5 }, // ST
  { x: 0, z: -15 }, // CAM

  // Команда 2 (гостевая) - синий цвет
  { x: 0, z: 40 }, // GK
  { x: -10, z: 30 }, // LB
  { x: 10, z: 30 }, // RB
  { x: -5, z: 25 }, // LCB
  { x: 5, z: 25 }, // RCB
  { x: -15, z: 15 }, // LM
  { x: 15, z: 15 }, // RM
  { x: -5, z: 10 }, // LCM
  { x: 5, z: 10 }, // RCM
  { x: 0, z: 5 }, // ST
  { x: 0, z: 15 } // CAM
];

// =================================
// ИНИЦИАЛИЗАЦИЯ
// =================================

function init() {
  init3D();
  setupEventListeners();
}

function init3D() {
  // Создаем сцену
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x22aa22); // Зеленое поле

  // Камера
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 15, 25);
  camera.lookAt(0, 0, 0);

  // Рендерер
  const canvas = document.getElementById('gameCanvas');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // Освещение
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Физика (Cannon.js)
  world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;

  // Загрузка стадиона
  const loader = new THREE.GLTFLoader();

  loader.load('models/stadium.glb', (gltf) => {
    stadium = gltf.scene;
    stadium.scale.set(1, 1, 1);
    stadium.position.set(0, 0, 0);
    scene.add(stadium);
  });

  // Загрузка мяча
  loader.load('models/ball.glb', (gltf) => {
    ballMesh = gltf.scene;
    ballMesh.scale.set(0.5, 0.5, 0.5); // Масштабируем мяч
    ballMesh.position.set(0, 0.5, 0);
    scene.add(ballMesh);

    // Физическое тело мяча
    ballBody = new CANNON.Body({
      mass: 0.45,
      shape: new CANNON.Sphere(0.5), // радиус 0.5 метра
      position: new CANNON.Vec3(0, 0.5, 0),
      linearDamping: 0.01,
      angularDamping: 0.01,
    });
    world.addBody(ballBody);

    // Связываем mesh и body
    ballMesh.position.copy(ballBody.position);
  });

  // Загрузка игроков
  for (let i = 0; i < playerData.length; i++) {
    const data = playerData[i];
    const pos = startingPositions[i];

    loader.load(data.model, (gltf) => {
      const player = gltf.scene;
      player.scale.set(0.8, 0.8, 0.8); // Масштабируем игрока
      player.position.set(pos.x, 0, pos.z);
      player.castShadow = true;

      // Цветовая маркировка команд
      if (i < 11) {
        // Команда 1 - красная
        player.traverse((child) => {
          if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if (mat.color) mat.color.set(0xff0000);
              });
            } else {
              if (child.material.color) child.material.color.set(0xff0000);
            }
          }
        });
      } else {
        // Команда 2 - синяя
        player.traverse((child) => {
          if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if (mat.color) mat.color.set(0x0000ff);
              });
            } else {
              if (child.material.color) child.material.color.set(0x0000ff);
            }
          }
        });
      }

      scene.add(player);
      players.push(player);

      // Если это первый игрок, делаем его управляемым
      if (i === 0) {
        currentControlledPlayer = player;
      }

      // Инициализация анимаций
      if (gltf.animations && gltf.animations.length) {
        if (!mixer) mixer = new THREE.AnimationMixer(player);
        gltf.animations.forEach(clip => {
          actions[clip.name] = mixer.clipAction(clip);
        });
      }
    });
  }

  // Анимация и рендеринг
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (isPlaying) {
      // Обновляем физику
      world.step(1/60);

      // Синхронизируем позиции
      if (ballMesh && ballBody) {
        ballMesh.position.copy(ballBody.position);
        ballMesh.quaternion.copy(ballBody.quaternion);
      }

      // Обновляем анимации
      if (mixer) mixer.update(delta);
    }

    renderer.render(scene, camera);
  }

  animate();

  // Обработка ресайза
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function setupEventListeners() {
    // Кнопки UI
    document.getElementById('shootBtn').addEventListener('click', () => {
        if (!isPlaying) return;
        attempts++;
        if (Math.random() > 0.3) { // 70% шанс
            scoreGoal();
        } else {
            playWhistleSound(); // Промах
        }
        updateHUD();
    });

    document.getElementById('passBtn').addEventListener('click', () => {
        console.log("Пас!");
        if (mixer && actions['pass']) {
            actions['pass'].reset().play();
        }
    });

    document.getElementById('throughBtn').addEventListener('click', () => {
        console.log("Проникающий пас!");
    });

    document.getElementById('sprintBtn').addEventListener('click', () => {
        console.log("Спринт!");
        if (mixer && actions['sprint']) {
            actions['sprint'].reset().play();
        }
    });

    // Джойстик
    const joystick = document.getElementById('joystick');
    let joystickCenter = { x: 0, y: 0 };
    let stickPosition = { x: 0, y: 0 };

    joystick.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = joystick.getBoundingClientRect();
        joystickCenter.x = rect.left + rect.width / 2;
        joystickCenter.y = rect.top + rect.height / 2;
        moveStick(e.touches[0]);
    });

    joystick.addEventListener('touchmove', (e) => {
        e.preventDefault();
        moveStick(e.touches[0]);
    });

    joystick.addEventListener('touchend', (e) => {
        e.preventDefault();
        const stick = document.querySelector('.stick');
        stick.style.transform = 'translate(0, 0)';
        stickPosition = { x: 0, y: 0 };
    });

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

        // Перемещение игрока
        if (currentControlledPlayer) {
            currentControlledPlayer.position.x += stickPosition.x * 0.01;
            currentControlledPlayer.position.z -= stickPosition.y * 0.01;
            // Также перемещаем физическое тело игрока, если оно есть
        }
    }
}

// =================================
// ИГРОВАЯ ЛОГИКА
// =================================

function switchToGameplay() {
  document.getElementById('homeScreen').classList.remove('active');
  document.getElementById('gameplayScreen').classList.add('active');
  isPlaying = true;
  resetGame();
  init(); // Инициализируем 3D только при переходе на игру
}

function showClub() {
  document.getElementById('homeScreen').classList.remove('active');
  document.getElementById('clubScreen').classList.add('active');
  loadPlayerCards();
}

function showMarket() {
  alert("Магазин пока не реализован!");
}

function resetGame() {
  scoreHome = 0;
  scoreAway = 0;
  matchTime = 90;
  extraTime = 0;
  isExtraTime = false;
  isPenaltyShootout = false;
  attempts = 0;
  points = 0;
  updateHUD();
  startMatch();
}

function updateHUD() {
  document.getElementById('score').textContent = `${scoreHome} - ${scoreAway}`;
  document.getElementById('time').textContent = isExtraTime ? `${extraTime}'` : `${matchTime}'`;
  document.getElementById('attempts').textContent = `${attempts}/99`;
  document.getElementById('points').textContent = points;
}

function startMatch() {
  let totalSeconds = matchTime * 60;
  const interval = setInterval(() => {
    totalSeconds--;
    matchTime = Math.floor(totalSeconds / 60);
    if (totalSeconds <= 0) {
      clearInterval(interval);
      if (scoreHome === scoreAway) {
        startExtraTime();
      } else {
        endMatch();
      }
    }
    updateHUD();
  }, 1000);
}

function startExtraTime() {
  isExtraTime = true;
  extraTime = 30; // 2 тайма по 15 минут
  let totalSeconds = extraTime * 60;
  const interval = setInterval(() => {
    totalSeconds--;
    extraTime = Math.floor(totalSeconds / 60);
    if (totalSeconds <= 0) {
      clearInterval(interval);
      if (scoreHome === scoreAway) {
        startPenaltyShootout();
      } else {
        endMatch();
      }
    }
    updateHUD();
  }, 1000);
}

function startPenaltyShootout() {
  isPenaltyShootout = true;
  alert("Серия пенальти! Нажмите 'Удар', чтобы пробить пенальти.");
}

function scoreGoal() {
    scoreHome++;
    points += 3;
    celebrateGoal();
    showReplay();
    updateHUD();
}

function celebrateGoal() {
  if (mixer && actions['celebrate']) {
    actions['celebrate'].reset().play();
  }
  playGoalSound();
  alert("ГООООООООЛ!");
}

function showReplay() {
  const replayDiv = document.createElement('div');
  replayDiv.className = 'replay-overlay';
  replayDiv.innerHTML = '<h3>Повтор гола</h3><img src="images/effects/replay_icon.png" alt="Replay" style="width: 50px;">';
  document.body.appendChild(replayDiv);

  setTimeout(() => {
    document.body.removeChild(replayDiv);
  }, 5000);
}

function showYellowCard(playerName) {
  playCardSound();
  alert(`${playerName} получил желтую карточку!`);
}

function showRedCard(playerName) {
  playCardSound();
  alert(`${playerName} удален с поля!`);
}

// =================================
// ЗАГРУЗКА КАРТОЧЕК ИГРОКОВ
// =================================

function loadPlayerCards() {
  const container = document.querySelector('.player-cards');
  container.innerHTML = '';

  for (const data of playerData) {
    const card = document.createElement('div');
    card.className = 'player-card';

    // Используем изображение с Futbin
    const img = document.createElement('img');
    let futbinId = 'p184758707'; // Роналду по умолчанию
    if (data.id === 'griezmann') futbinId = 'p151189709';
    if (data.id === 'konate') futbinId = 'p84123758';
    if (data.id === 'kane') futbinId = 'p201528718';
    if (data.id === 'messi') futbinId = 'p134470099';
    if (data.id === 'mbappe') futbinId = 'p151233738'; // Mbappé
    if (data.id === 'salah') futbinId = 'p184758707'; // Salah
    if (data.id === 'vanDijk') futbinId = 'p117643888'; // van Dijk

    img.src = `https://cdn3.futbin.com/content/fifa25/img/players/${futbinId}.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=12345`;
    img.alt = data.name;
    img.onerror = function() { this.src = 'images/cards/generic_player.png'; };

    const name = document.createElement('div');
    name.className = 'player-name';
    name.textContent = data.name;

    const rating = document.createElement('div');
    rating.className = 'player-rating';
    rating.textContent = data.rating;

    const stats = document.createElement('div');
    stats.className = 'player-stats';
    stats.innerHTML = `
      <div>PAC: ${data.pac}</div>
      <div>SHO: ${data.sho}</div>
      <div>PAS: ${data.pas}</div>
      <div>DRI: ${data.dri}</div>
      <div>DEF: ${data.def}</div>
      <div>PHY: ${data.phy}</div>
    `;

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(rating);
    card.appendChild(stats);

    // Золотой мяч для лучших игроков (например, Роналду или Месси)
    if (data.id === 'ronaldo' || data.id === 'messi') {
      const goldenBall = document.createElement('img');
      goldenBall.src = 'images/effects/golden_ball.png';
      goldenBall.className = 'golden-ball';
      card.appendChild(goldenBall);
    }

    container.appendChild(card);
  }
}

// =================================
// ЗВУКИ (через CDN)
// =================================

function playGoalSound() {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-goal-scored-2065.mp3');
  audio.play().catch(e => console.log("Звук гола не воспроизвелся:", e));
}

function playWhistleSound() {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-referee-whistle-2063.mp3');
  audio.play().catch(e => console.log("Свисток не воспроизвелся:", e));
}

function playCardSound() {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-show-wrong-answer-buzz-950.mp3');
  audio.play().catch(e => console.log("Звук карточки не воспроизвелся:", e));
}

// =================================
// ЗАВЕРШЕНИЕ МАТЧА
// =================================

function endMatch() {
  isPlaying = false;
  alert(`Матч окончен! Счет: ${scoreHome} - ${scoreAway}`);
  document.getElementById('homeScreen').classList.add('active');
  document.getElementById('gameplayScreen').classList.remove('active');
}

// =================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// =================================

function loadLibraries() {
  const threeScript = document.createElement('script');
  threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  document.head.appendChild(threeScript);

  const gltfScript = document.createElement('script');
  gltfScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
  gltfScript.onload = () => {
    const cannonScript = document.createElement('script');
    cannonScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js';
    cannonScript.onload = () => {
        console.log("Библиотеки загружены, инициализация...");
        init();
    };
    document.head.appendChild(cannonScript);
  };
  document.head.appendChild(gltfScript);
}

document.addEventListener('DOMContentLoaded', loadLibraries);
