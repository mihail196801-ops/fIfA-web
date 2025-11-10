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
let playerBalance = 1000000; // Баланс игрока (в монетах)

// Список игроков с их характеристиками и позициями
const playerData = [
  // Команда 1 (домашняя)
  { id: 'ronaldo', name: 'Cristiano Ronaldo', rating: 97, position: 'ST', pac: 93, sho: 99, pas: 90, dri: 94, def: 75, phy: 99, team: 'Al Nassr', nationality: 'Portugal', model: 'models/player1.glb', price: 1800000 },
  { id: 'messi', name: 'Lionel Messi', rating: 97, position: 'CAM', pac: 94, sho: 92, pas: 97, dri: 98, def: 80, phy: 87, team: 'Inter Miami', nationality: 'Argentina', model: 'models/player2.glb', price: 1600000 },
  { id: 'kane', name: 'Kane', rating: 98, position: 'CM', pac: 93, sho: 96, pas: 98, dri: 94, def: 92, phy: 93, team: 'Bayern Munich', nationality: 'England', model: 'models/player1.glb', price: 1900000 },
  { id: 'griezmann', name: 'Griezmann', rating: 98, position: 'CAM', pac: 92, sho: 94, pas: 97, dri: 98, def: 80, phy: 87, team: 'Atlético Madrid', nationality: 'France', model: 'models/player2.glb', price: 1500000 },
  { id: 'konate', name: 'Konaté', rating: 98, position: 'GK', pac: 98, sho: 97, pas: 95, dri: 94, def: 85, phy: 94, team: 'Liverpool', nationality: 'France', model: 'models/goalkeeper.glb', price: 400000 },
  { id: 'rodri', name: 'Rodri', rating: 98, position: 'CB', pac: 93, sho: 80, pas: 96, dri: 93, def: 98, phy: 95, team: 'Man City', nationality: 'Spain', model: 'models/player1.glb', price: 1700000 },
  { id: 'mcTominay', name: 'McTominay', rating: 98, position: 'ST', pac: 93, sho: 99, pas: 90, dri: 94, def: 75, phy: 99, team: 'Man Utd', nationality: 'Scotland', model: 'models/player2.glb', price: 300000 },
  { id: 'hansen', name: 'Hansen', rating: 97, position: 'RW', pac: 96, sho: 95, pas: 95, dri: 97, def: 58, phy: 86, team: 'Chelsea', nationality: 'Denmark', model: 'models/player1.glb', price: 400000 },
  { id: 'viniJr', name: 'Vini Jr.', rating: 97, position: 'LW', pac: 99, sho: 91, pas: 90, dri: 98, def: 38, phy: 78, team: 'Real Madrid', nationality: 'Brazil', model: 'models/player2.glb', price: 1200000 },
  { id: 'salah', name: 'Salah', rating: 97, position: 'RW', pac: 97, sho: 95, pas: 92, dri: 97, def: 60, phy: 85, team: 'Liverpool', nationality: 'Egypt', model: 'models/player1.glb', price: 700000 },
  { id: 'pelé', name: 'Pelé', rating: 97, position: 'CAM', pac: 95, sho: 97, pas: 93, dri: 96, def: 61, phy: 82, team: 'Santos', nationality: 'Brazil', model: 'models/player2.glb', price: 2300000 },

  // Команда 2 (Гостевая)
  { id: 'mbappe', name: 'Mbappé', rating: 91, position: 'ST', pac: 97, sho: 90, pas: 80, dri: 92, def: 36, phy: 78, team: 'Real Madrid', nationality: 'France', model: 'models/player1.glb', price: 1300000 },
  { id: 'dembele', name: 'Dembélé', rating: 97, position: 'RW', pac: 99, sho: 90, pas: 94, dri: 97, def: 55, phy: 75, team: 'Barcelona', nationality: 'France', model: 'models/player2.glb', price: 1300000 },
  { id: 'cruyff', name: 'Cruyff', rating: 98, position: 'LM', pac: 96, sho: 92, pas: 98, dri: 99, def: 80, phy: 86, team: 'Ajax', nationality: 'Netherlands', model: 'models/player1.glb', price: 4200000 },
  { id: 'maradona', name: 'Maradona', rating: 98, position: 'RW', pac: 94, sho: 94, pas: 97, dri: 99, def: 45, phy: 85, team: 'Napoli', nationality: 'Argentina', model: 'models/player2.glb', price: 2700000 },
  { id: 'vanDijk', name: 'van Dijk', rating: 97, position: 'CB', pac: 89, sho: 68, pas: 81, dri: 80, def: 97, phy: 96, team: 'Liverpool', nationality: 'Netherlands', model: 'models/player1.glb', price: 1900000 },
  { id: 'tah', name: 'Tah', rating: 97, position: 'CB', pac: 90, sho: 70, pas: 83, dri: 85, def: 97, phy: 95, team: 'Bayer Leverkusen', nationality: 'Germany', model: 'models/player2.glb', price: 270000 },
  { id: 'bastoni', name: 'Bastoni', rating: 97, position: 'CB', pac: 89, sho: 55, pas: 87, dri: 90, def: 97, phy: 96, team: 'Inter Milan', nationality: 'Italy', model: 'models/player1.glb', price: 260000 },
  { id: 'osimhen', name: 'Osimhen', rating: 97, position: 'ST', pac: 97, sho: 97, pas: 81, dri: 93, def: 53, phy: 92, team: 'Napoli', nationality: 'Nigeria', model: 'models/player2.glb', price: 280000 },
  { id: 'wilson', name: 'Wilson', rating: 97, position: 'ST', pac: 98, sho: 95, pas: 87, dri: 98, def: 54, phy: 93, team: 'Arsenal', nationality: 'England', model: 'models/player1.glb', price: 390000 },
  { id: 'retgui', name: 'Retegui', rating: 97, position: 'ST', pac: 96, sho: 97, pas: 89, dri: 95, def: 60, phy: 94, team: 'Juventus', nationality: 'Italy', model: 'models/player2.glb', price: 350000 },
  { id: 'shaw', name: 'Shaw', rating: 97, position: 'ST', pac: 94, sho: 97, pas: 86, dri: 93, def: 43, phy: 96, team: 'Man Utd', nationality: 'England', model: 'models/player1.glb', price: 430000 }
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

// Управление WASD
let keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

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

  // Камера от трибун
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 30, 40); // Высота трибун
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

      // Управление WASD
      if (currentControlledPlayer) {
        let speed = 0.1;
        if (keys.w) currentControlledPlayer.position.z -= speed;
        if (keys.s) currentControlledPlayer.position.z += speed;
        if (keys.a) currentControlledPlayer.position.x -= speed;
        if (keys.d) currentControlledPlayer.position.x += speed;
      }
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
    // Клавиши WASD
    window.addEventListener('keydown', (e) => {
        if (e.key === 'w') keys.w = true;
        if (e.key === 's') keys.s = true;
        if (e.key === 'a') keys.a = true;
        if (e.key === 'd') keys.d = true;
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'w') keys.w = false;
        if (e.key === 's') keys.s = false;
        if (e.key === 'a') keys.a = false;
        if (e.key === 'd') keys.d = false;
    });

    // Кнопки UI (создаем динамически)
    createButtons();

    // Джойстик — убираем, так как управляем WASD
    // document.getElementById('joystick').remove();
}

function createButtons() {
  // Создаем контейнер для кнопок
  const buttonsContainer = document.createElement('div');
  buttonsContainer.id = 'buttonsContainer';
  buttonsContainer.style.position = 'absolute';
  buttonsContainer.style.bottom = '20px';
  buttonsContainer.style.right = '20px';
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.gap = '10px';

  // Кнопка "Удар"
  const shootBtn = createButton('SHOOT', 'https://cdn2.futbin.com/https%3A%2F%2Fcdn.futbin.com%2Fdesign%2Fimg%2Fcoins_big.png?fm=png&ixlib=java-2.1.0&w=20&s=723885ca3b3ab1cf3cb11c53f9408968');
  shootBtn.onclick = () => {
    if (!isPlaying) return;
    attempts++;
    if (Math.random() > 0.3) { // 70% шанс
      scoreGoal();
    } else {
      playWhistleSound(); // Промах
    }
    updateHUD();
  };

  // Кнопка "Пас"
  const passBtn = createButton('PASS', 'https://www.futbin.com/design2/img/static/filters/foot-right.svg');
  passBtn.onclick = () => {
    console.log("Пас!");
    if (mixer && actions['pass']) {
      actions['pass'].reset().play();
    }
  };

  // Кнопка "Проникающий пас"
  const throughBtn = createButton('THROUGH', 'https://www.futbin.com/design2/img/static/filters/foot-left.svg');
  throughBtn.onclick = () => {
    console.log("Проникающий пас!");
  };

  // Кнопка "Спринт и навык"
  const sprintBtn = createButton('SPRINT & SKILL', 'https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-effect-271.mp3');
  sprintBtn.onclick = () => {
    console.log("Спринт!");
    if (mixer && actions['sprint']) {
      actions['sprint'].reset().play();
    }
  };

  buttonsContainer.appendChild(shootBtn);
  buttonsContainer.appendChild(passBtn);
  buttonsContainer.appendChild(throughBtn);
  buttonsContainer.appendChild(sprintBtn);

  document.body.appendChild(buttonsContainer);
}

function createButton(text, iconUrl) {
  const btn = document.createElement('button');
  btn.style.padding = '10px 20px';
  btn.style.fontSize = '1em';
  btn.style.backgroundColor = 'rgba(255,255,255,0.2)';
  btn.style.border = '2px solid rgba(255,255,255,0.3)';
  btn.style.borderRadius = '10px';
  btn.style.cursor = 'pointer';
  btn.style.transition = 'background 0.2s';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.gap = '5px';
  btn.style.fontWeight = 'bold';

  btn.onmouseover = () => {
    btn.style.backgroundColor = 'rgba(255,255,255,0.3)';
  };

  btn.onmouseout = () => {
    btn.style.backgroundColor = 'rgba(255,255,255,0.2)';
  };

  const icon = document.createElement('img');
  icon.src = iconUrl;
  icon.style.width = '20px';
  icon.style.height = '20px';

  const textNode = document.createTextNode(text);

  btn.appendChild(icon);
  btn.appendChild(textNode);

  return btn;
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
  document.getElementById('homeScreen').classList.remove('active');
  document.getElementById('marketScreen').classList.add('active');
  loadMarket();
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
  document.getElementById('balance').textContent = playerBalance;
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
// РЫНОК
// =================================

function loadMarket() {
  const container = document.querySelector('.market-container');
  container.innerHTML = '';

  for (const data of playerData) {
    const marketCard = document.createElement('div');
    marketCard.className = 'market-card';

    // Изображение игрока
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
    name.className = 'market-player-name';
    name.textContent = data.name;

    const rating = document.createElement('div');
    rating.className = 'market-player-rating';
    rating.textContent = data.rating;

    const price = document.createElement('div');
    price.className = 'market-player-price';
    price.textContent = `${data.price} coins`;

    const buyBtn = document.createElement('button');
    buyBtn.className = 'buy-btn';
    buyBtn.textContent = 'Купить';
    buyBtn.onclick = () => {
      if (playerBalance >= data.price) {
        playerBalance -= data.price;
        alert(`Вы купили ${data.name} за ${data.price} монет!`);
        updateHUD();
      } else {
        alert(`Недостаточно средств! Нужно ${data.price}, у вас ${playerBalance}`);
      }
    };

    marketCard.appendChild(img);
    marketCard.appendChild(name);
    marketCard.appendChild(rating);
    marketCard.appendChild(price);
    marketCard.appendChild(buyBtn);

    container.appendChild(marketCard);
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
