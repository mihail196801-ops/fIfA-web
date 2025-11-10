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
let quests = [
  { id: 'quest1', name: 'Забей 5 голов', reward: 50000, completed: false },
  { id: 'quest2', name: 'Сделай 10 пасов', reward: 30000, completed: false },
  { id: 'quest3', name: 'Выиграй матч', reward: 100000, completed: false }
];

// Список игроков с их характеристиками и позициями
const playerData = [
  // Команда 1 (домашняя) - красный цвет
  { id: 'ronaldo', name: 'Cristiano Ronaldo', rating: 97, position: 'ST', pac: 93, sho: 99, pas: 90, dri: 94, def: 75, phy: 99, team: 'Al Nassr', nationality: 'Portugal', model: 'models/player1.glb', price: 1800000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p184758707.png?fm=png&ixlib=java-2.1.0&verzion=2&w=100&s=ff8bfad1cf1fa5876da738ff69749703' },
  { id: 'messi', name: 'Lionel Messi', rating: 97, position: 'CAM', pac: 94, sho: 92, pas: 97, dri: 98, def: 80, phy: 87, team: 'Inter Miami', nationality: 'Argentina', model: 'models/player2.glb', price: 1600000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p134470099.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=a2af0c196cda265978c6316532b0e7c2' },
  { id: 'kane', name: 'Kane', rating: 98, position: 'CM', pac: 93, sho: 96, pas: 98, dri: 94, def: 92, phy: 93, team: 'Bayern Munich', nationality: 'England', model: 'models/player1.glb', price: 1900000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p201528718.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=3b3f15d18d4efd7d25aee4f0a6ffa9ce' },
  { id: 'griezmann', name: 'Griezmann', rating: 98, position: 'CAM', pac: 92, sho: 94, pas: 97, dri: 98, def: 80, phy: 87, team: 'Atlético Madrid', nationality: 'France', model: 'models/player2.glb', price: 1500000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p151189709.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=c9237669d27d934cfdbdb3ede5e9a48a' },
  { id: 'konate', name: 'Konaté', rating: 98, position: 'GK', pac: 98, sho: 97, pas: 95, dri: 94, def: 85, phy: 94, team: 'Liverpool', nationality: 'France', model: 'models/goalkeeper.glb', price: 400000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p84123758.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=dd74d4fdfc9aec8e4f69b85e5bacb65d' },
  { id: 'rodri', name: 'Rodri', rating: 98, position: 'CB', pac: 93, sho: 80, pas: 96, dri: 93, def: 98, phy: 95, team: 'Man City', nationality: 'Spain', model: 'models/player1.glb', price: 1700000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p100895162.png?fm=png&ixlib=java-2.1.0&w=100&s=aa9907356943a4ebbd9562d56ea2d902' },
  { id: 'mcTominay', name: 'McTominay', rating: 98, position: 'ST', pac: 93, sho: 99, pas: 90, dri: 94, def: 75, phy: 99, team: 'Man Utd', nationality: 'Scotland', model: 'models/player2.glb', price: 300000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p134454966.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=3ad0b92e50457218de6b767ec7f42927' },
  { id: 'hansen', name: 'Hansen', rating: 97, position: 'RW', pac: 96, sho: 95, pas: 95, dri: 97, def: 58, phy: 86, team: 'Chelsea', nationality: 'Denmark', model: 'models/player1.glb', price: 400000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p117667614.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=13e5c4cdaea9fecc5140e7b870f4f47d' },
  { id: 'viniJr', name: 'Vini Jr.', rating: 97, position: 'LW', pac: 99, sho: 91, pas: 90, dri: 98, def: 38, phy: 78, team: 'Real Madrid', nationality: 'Brazil', model: 'models/player2.glb', price: 1200000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p151233738.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=f8c64d1a5945b0b88248bb5cfbdda9d2' },
  { id: 'salah', name: 'Salah', rating: 97, position: 'RW', pac: 97, sho: 95, pas: 92, dri: 97, def: 60, phy: 85, team: 'Liverpool', nationality: 'Egypt', model: 'models/player1.glb', price: 700000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p184758707.png?fm=png&ixlib=java-2.1.0&verzion=2&w=100&s=ff8bfad1cf1fa5876da738ff69749703' },
  { id: 'pelé', name: 'Pelé', rating: 97, position: 'CAM', pac: 95, sho: 97, pas: 93, dri: 96, def: 61, phy: 82, team: 'Santos', nationality: 'Brazil', model: 'models/player2.glb', price: 2300000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p67345931.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=b0886397ad875c66853acc4946487382' },

  // Команда 2 (Гостевая) - синий цвет
  { id: 'mbappe', name: 'Mbappé', rating: 91, position: 'ST', pac: 97, sho: 90, pas: 80, dri: 92, def: 36, phy: 78, team: 'Real Madrid', nationality: 'France', model: 'models/player1.glb', price: 1300000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p151233738.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=f8c64d1a5945b0b88248bb5cfbdda9d2' },
  { id: 'dembele', name: 'Dembélé', rating: 97, position: 'RW', pac: 99, sho: 90, pas: 94, dri: 97, def: 55, phy: 75, team: 'Barcelona', nationality: 'France', model: 'models/player2.glb', price: 1300000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p151226387.png?fm=png&ixlib=java-2.1.0&verzion=2&w=100&s=34fecc4cd5fe05825cc8debee8c65735' },
  { id: 'cruyff', name: 'Cruyff', rating: 98, position: 'LM', pac: 96, sho: 92, pas: 98, dri: 99, def: 80, phy: 86, team: 'Ajax', nationality: 'Netherlands', model: 'models/player1.glb', price: 4200000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p84076125.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=842a17dcdcb173a4725f9bccdee1b5a5' },
  { id: 'maradona', name: 'Maradona', rating: 98, position: 'RW', pac: 94, sho: 94, pas: 97, dri: 99, def: 45, phy: 85, team: 'Napoli', nationality: 'Argentina', model: 'models/player2.glb', price: 2700000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p201516634.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=53077f92c06616402396bb917ea8c9ed' },
  { id: 'vanDijk', name: 'van Dijk', rating: 97, position: 'CB', pac: 89, sho: 68, pas: 81, dri: 80, def: 97, phy: 96, team: 'Liverpool', nationality: 'Netherlands', model: 'models/player1.glb', price: 1900000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p117643888.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=c55459ae566e913edeb4f697f20938c7' },
  { id: 'tah', name: 'Tah', rating: 97, position: 'CB', pac: 90, sho: 70, pas: 83, dri: 85, def: 97, phy: 95, team: 'Bayer Leverkusen', nationality: 'Germany', model: 'models/player2.glb', price: 270000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p117653843.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=88367289084962fd87ca4d73464d1adf' },
  { id: 'bastoni', name: 'Bastoni', rating: 97, position: 'CB', pac: 89, sho: 55, pas: 87, dri: 90, def: 97, phy: 96, team: 'Inter Milan', nationality: 'Italy', model: 'models/player1.glb', price: 260000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p84123463.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=988fb90ef66abd978e99c6b3019c2cbd' },
  { id: 'osimhen', name: 'Osimhen', rating: 97, position: 'ST', pac: 97, sho: 97, pas: 81, dri: 93, def: 53, phy: 92, team: 'Napoli', nationality: 'Nigeria', model: 'models/player2.glb', price: 280000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p117672805.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=112efdc268fa9be33212f948fe34a417' },
  { id: 'wilson', name: 'Wilson', rating: 97, position: 'ST', pac: 98, sho: 95, pas: 87, dri: 98, def: 54, phy: 93, team: 'Arsenal', nationality: 'England', model: 'models/player1.glb', price: 390000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p100927308.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=6e74c0a202dbc73c3023566c5d5646a5' },
  { id: 'retgui', name: 'Retegui', rating: 97, position: 'ST', pac: 96, sho: 97, pas: 89, dri: 95, def: 60, phy: 94, team: 'Juventus', nationality: 'Italy', model: 'models/player2.glb', price: 350000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p117682362.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=75d26deafe25fc91c82deef48e6aab91' },
  { id: 'shaw', name: 'Shaw', rating: 97, position: 'ST', pac: 94, sho: 97, pas: 86, dri: 93, def: 43, phy: 96, team: 'Man Utd', nationality: 'England', model: 'models/player1.glb', price: 430000, avatar: 'https://cdn3.futbin.com/content/fifa25/img/players/p134463947.png?fm=png&ixlib=java-2.1.0&verzion=1&w=100&s=82823ce25d9b7ffff57737e554f40391' }
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

// Удары
let isShooting = false;
let shootStartPos = null;
let shootEndPos = null;

// Камера
let orbitControls = null;

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

    // Масштабируем стадион до реальных размеров
    // Стандартное поле: 105м x 68м
    const fieldWidth = 105;
    const fieldHeight = 68;

    // Предположим, что ваша модель стадиона имеет ширину ~10 единиц в Three.js
    // Нам нужно масштабировать ее так, чтобы ширина была 105 метров
    const scaleFactor = fieldWidth / 10; // Примерный масштаб

    stadium.scale.set(scaleFactor, scaleFactor, scaleFactor);
    stadium.position.set(0, 0, 0);
    scene.add(stadium);
  });

  // Загрузка мяча
  loader.load('models/ball.glb', (gltf) => {
    ballMesh = gltf.scene;

    // Масштабируем мяч до реального размера (диаметр 0.22 метра)
    const realBallDiameter = 0.22; // метры
    // Предположим, что ваша модель мяча имеет диаметр ~1 единица в Three.js
    const ballScale = realBallDiameter / 1;

    ballMesh.scale.set(ballScale, ballScale, ballScale);
    ballMesh.position.set(0, realBallDiameter/2, 0); // Позиция по Y = радиус
    scene.add(ballMesh);

    // Физическое тело мяча
    ballBody = new CANNON.Body({
      mass: 0.45, // кг
      shape: new CANNON.Sphere(realBallDiameter/2), // радиус 0.11 метра
      position: new CANNON.Vec3(0, realBallDiameter/2, 0),
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

      // Масштабируем игрока до реальной высоты (~1.8 метра)
      const realPlayerHeight = 1.8; // метры
      // Предположим, что ваша модель игрока имеет высоту ~1.8 единиц в Three.js
      // Если нет, вам нужно измерить высоту модели и масштабировать соответственно
      const playerScale = realPlayerHeight / 1.8; // Примерный масштаб

      player.scale.set(playerScale, playerScale, playerScale);
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

    // Удары
    document.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // ЛКМ
        isShooting = true;
        shootStartPos = getMousePosition(e);
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) { // ЛКМ
        isShooting = false;
        shootEndPos = getMousePosition(e);
        if (shootStartPos && shootEndPos) {
          performShot(shootStartPos, shootEndPos);
        }
        shootStartPos = null;
        shootEndPos = null;
      }
    });

    // Камера
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.25;
    orbitControls.enableZoom = true;

    // Кнопки UI (создаем динамически)
    createButtons();

    // Джойстик — убираем, так как управляем WASD
    // document.getElementById('joystick').remove();
}

function getMousePosition(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: -((event.clientY - rect.top) / rect.height) * 2 + 1
  };
}

function performShot(startPos, endPos) {
  if (!isPlaying) return;
  attempts++;

  // Расчет направления удара
  const direction = new THREE.Vector3(endPos.x - startPos.x, 0, endPos.y - startPos.y);
  direction.normalize();

  // Прикладываем импульс к мячу
  const force = 10; // Сила удара
  ballBody.applyImpulse(new CANNON.Vec3(direction.x * force, 0, direction.z * force), ballBody.position);

  // Шанс забить
  if (Math.random() > 0.3) { // 70% шанс
    scoreGoal();
  } else {
    playWhistleSound(); // Промах
  }
  updateHUD();
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

function showQuests() {
  document.getElementById('homeScreen').classList.remove('active');
  document.getElementById('questsScreen').classList.add('active');
  loadQuests();
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
    img.src = data.avatar;
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
    img.src = data.avatar;
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
// КВЕСТЫ
// =================================

function loadQuests() {
  const container = document.querySelector('.quests-container');
  container.innerHTML = '';

  for (const quest of quests) {
    const questCard = document.createElement('div');
    questCard.className = 'quest-card';

    const name = document.createElement('div');
    name.className = 'quest-name';
    name.textContent = quest.name;

    const reward = document.createElement('div');
    reward.className = 'quest-reward';
    reward.textContent = `Награда: ${quest.reward} монет`;

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = quest.completed ? 'Выполнено' : 'Выполнить';
    completeBtn.disabled = quest.completed;
    completeBtn.onclick = () => {
      if (!quest.completed) {
        quest.completed = true;
        playerBalance += quest.reward;
        alert(`Квест "${quest.name}" выполнен! Получено ${quest.reward} монет.`);
        updateHUD();
        completeBtn.textContent = 'Выполнено';
        completeBtn.disabled = true;
      }
    };

    questCard.appendChild(name);
    questCard.appendChild(reward);
    questCard.appendChild(completeBtn);

    container.appendChild(questCard);
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

  // OrbitControls
  const orbitScript = document.createElement('script');
  orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
  document.head.appendChild(orbitScript);
}

document.addEventListener('DOMContentLoaded', loadLibraries);
