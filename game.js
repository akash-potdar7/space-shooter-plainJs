const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');

let score = 0;
let lives = 3;
const keys = {};
const bullets = [];
const enemies = [];
const enemyBullets = [];
const asteroids = [];

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function createBullet(x, y) {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${x}px`;
    bullet.style.top = `${y}px`;
    gameArea.appendChild(bullet);
    bullets.push(bullet);
}

function createEnemy() {
    const x = Math.random() * (window.innerWidth - 50);
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = `${x}px`;
    enemy.style.top = '0px';
    enemy.dataset.speed = 2;
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

function createAsteroid() {
    const x = Math.random() * (window.innerWidth - 50);
    const asteroid = document.createElement('div');
    asteroid.className = 'asteroid';
    asteroid.style.left = `${x}px`;
    asteroid.style.top = '0px';
    asteroid.dataset.speed = 1;
    gameArea.appendChild(asteroid);
    asteroids.push(asteroid);
}

function createEnemyBullet(x, y) {
    const bullet = document.createElement('div');
    bullet.className = 'enemyBullet';
    bullet.style.left = `${x}px`;
    bullet.style.top = `${y}px`;
    gameArea.appendChild(bullet);
    enemyBullets.push(bullet);
}

function spawnObjects() {
    setInterval(createEnemy, 1000);
    setInterval(createAsteroid, 1500);
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateLives() {
    livesDisplay.textContent = `Lives: ${lives}`;
}

function increaseDifficulty() {
    setInterval(() => {
        enemies.forEach(enemy => {
            const currentSpeed = parseFloat(enemy.dataset.speed);
            enemy.dataset.speed = currentSpeed + 0.5;
        });
        asteroids.forEach(asteroid => {
            const currentSpeed = parseFloat(asteroid.dataset.speed);
            asteroid.dataset.speed = currentSpeed + 0.5;
        });
    }, 10000);
}

function checkCollision(rect1, rect2) {
    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

function runGame() {
    console.log("RP:runGame()");
    if (keys['ArrowLeft'] && player.offsetLeft > 0) {
        player.style.left = `${player.offsetLeft - 5}px`;
    }
    if (keys['ArrowRight'] && player.offsetLeft < window.innerWidth - player.offsetWidth) {
        player.style.left = `${player.offsetLeft + 5}px`;
    }
    if (keys['Space']) {
        const bulletX = player.offsetLeft - 2
        const bulletY = player.offsetTop;
        createBullet(bulletX, bulletY);
    }

    bullets.forEach((bullet, index) => {
        bullet.style.top = `${bullet.offsetTop - 7}px`;
        if (bullet.offsetTop + bullet.offsetHeight < 0) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });

    enemies.forEach((enemy, enemyIndex) => {
        const speed = parseFloat(enemy.dataset.speed);
        enemy.style.top = `${enemy.offsetTop + speed}px`;
        if (enemy.offsetTop > window.innerHeight) {
            enemy.remove();
            enemies.splice(enemyIndex, 1);
        }

        // Enemy shooting logic
        if (Math.random() < 0.02) { // Adjust probability for how often enemies shoot
            createEnemyBullet(enemy.offsetLeft + enemy.offsetWidth / 2 - 2.5, enemy.offsetTop + enemy.offsetHeight);
        }

        enemyBullets.forEach((bullet, bulletIndex) => {
            bullet.style.top = `${bullet.offsetTop + 5}px`;
            if (bullet.offsetTop > window.innerHeight) {
                bullet.remove();
                enemyBullets.splice(bulletIndex, 1);
            }

            if (checkCollision(bullet.getBoundingClientRect(), player.getBoundingClientRect())) {
                bullet.remove();
                enemyBullets.splice(bulletIndex, 1);
                lives--;
                updateLives();
                if (lives <= 0) {
                    alert('Game Over');
                    window.location.reload();
                }
            }
        });

        bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet.getBoundingClientRect(), enemy.getBoundingClientRect())) {
                bullet.remove();
                enemy.remove();
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10;
                updateScore();
            }
        });

        if (checkCollision(player.getBoundingClientRect(), enemy.getBoundingClientRect())) {
            enemy.remove();
            enemies.splice(enemyIndex, 1);
            lives--;
            updateLives();
            if (lives <= 0) {
                alert('Game Over');
                window.location.reload();
            }
        }
    });

    asteroids.forEach((asteroid, asteroidIndex) => {
        const speed = parseFloat(asteroid.dataset.speed);
        asteroid.style.top = `${asteroid.offsetTop + speed}px`;
        if (asteroid.offsetTop > window.innerHeight) {
            asteroid.remove();
            asteroids.splice(asteroidIndex, 1);
        }

        bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet.getBoundingClientRect(), asteroid.getBoundingClientRect())) {
                bullet.remove();
                asteroid.remove();
                bullets.splice(bulletIndex, 1);
                asteroids.splice(asteroidIndex, 1);
                score += 5;
                updateScore();
            }
        });

        if (checkCollision(player.getBoundingClientRect(), asteroid.getBoundingClientRect())) {
            asteroid.remove();
            asteroids.splice(asteroidIndex, 1);
            lives--;
            updateLives();
            if (lives <= 0) {
                alert('Game Over');
                window.location.reload();
            }
        }
    });

    requestAnimationFrame(runGame);
}

spawnObjects();
increaseDifficulty();
runGame();
