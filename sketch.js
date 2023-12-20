let imgFundo, imgFly, imgHit;
let fundo, bird, canos, placar, go;
let gameOver, gameStart;
let score, hiScore;

const velCano = -4;

function preload() {
    imgFundo = loadImage('./assets/bg.png');
    imgFly = loadImage('./assets/chickFly.png');
    imgHit = loadImage('./assets/chickGotHit.png');
}

function setup() {
    new Canvas(360, 640);
    frameRate(60);

    initialize();
    
    hiScore = localStorage.getItem("hiScore");
    if (!hiScore) {
        hiScore = 0;
    }

    fundo = new Group();
    fundo.layer = 0;
    fundo.addAni(imgFundo);
    fundo.collider = "n";
    fundo.y = height / 2;
    for (let i = 0; i < 3; i++) {
        const f = new fundo.Sprite();
        f.x = width * i + width / 2;
    }

    // canos
    criaCanos();

    bird = new Sprite();
    bird.addAni('fly', imgFly, { frameSize: [110, 87], frames: 4 });
    bird.addAni('hit', imgHit, { frameSize: [117, 98], frames: 2 });
    bird.radius = 20;
    initializeBird();
    bird.bounciness = 0;
    // bird.debug = true;

    criaPlacar();
}

function draw() {
    if (kb.pressed(' ') && !gameOver) {
        if (!gameStart) {
            // início do jogo
            gameStart = true;
            fundo.vel.x = -3;
            canos.vel.x = velCano;
            world.gravity.y = 14;
        }
        // sobe passaro
        bird.vel.y = -7;
    }
    if (gameStart && !gameOver) {
        moveFundo();
        moveCanos();
    }
    bird.y = constrain(bird.y, bird.radius, height - bird.radius);
    if (bird.vel.y > 0) {
        bird.rotateTo(15, 3);
    } else if ((bird.vel.y === 0)) {
        bird.rotateTo(0, 3);
    } else {
        bird.rotateTo(-15, 3);
    }
    bird.collides(canos, bateu);

    if (gameOver && kb.pressed("enter")) {
        initialize();
        go.remove();
        escrevePlacar();
        initializeBird();
        canos.removeAll();
        criaCanos();
    }
}

function initialize() {
    gameStart = false;
    gameOver = false;

    score = 0;

    world.gravity.y = 0;
}

function initializeBird() {
    bird.changeAni('fly');
    bird.ani.scale = 0.5;
    bird.x = bird.radius + 20;
    bird.y = height / 2;
    bird.vel.x = 0;
    bird.vel.y = 0;
}

function moveFundo() {
    for (let i = 0; i < fundo.length; i++) {
        const f = fundo[i];
        if (f.x < -width) {
            f.remove();
            const uf = fundo[fundo.length - 1];
            const nf = new fundo.Sprite();
            nf.x = uf.x + nf.w;
        }
    }
}

function moveCanos() {
    const cima = canos[0];
    if (cima.x < -cima.w) {
        const baixo = canos[1];
        cima.remove();
        baixo.remove();
        const ultimo = canos[canos.length - 1];
        criaPipes(ultimo.x + width / 2);
        canos.vel.x = velCano;
        pontua();
    }
}

function pontua() {
    if (!gameOver) {
        score++;
        if (score > hiScore) {
            hiScore = score;
            localStorage.setItem("hiScore", hiScore);
        }        
        escrevePlacar();
    }
    // console.log(score, hiScore);
}

function criaCanos() {
    canos = new Group();
    canos.layer = 5;
    canos.bounciness = 0;
    for (let i = 0; i < 3; i++) {
        criaPipes(i * width / 2 + width);
    }
}

function criaPipes(x) {
    const gap = new Sprite();
    gap.collider = 'n';
    gap.h = 160;
    gap.y = random(gap.h, height - gap.h);
    gap.x = x;

    const pipe = new canos.Group();
    pipe.collider = 'k';
    pipe.w = 30;
    pipe.h = height;
    pipe.x = x;
    pipe.color = "red";
    pipe.strokeWeight = 0;
    // cano de cima
    const cima = new pipe.Sprite();
    cima.y = gap.y - (pipe.h / 2 + gap.h / 2);
    // cano de baixo
    const baixo = new pipe.Sprite();
    baixo.y = gap.y + (pipe.h / 2 + gap.h / 2);

    gap.remove();
}

function criaPlacar() {
    placar = new Group();
    placar.collider = 'n';
    placar.w = width / 2;
    placar.h = 50;
    placar.y = placar.h / 2;
    placar.textSize = 24;
    placar.color = "#ffffffaa";
    placar.strokeWeight = 0;

    const s = new placar.Sprite();
    s.x = placar.w / 2;
    const hs = new placar.Sprite();
    hs.x = width - placar.w / 2;
    escrevePlacar();
}

function escrevePlacar() {
    placar[0].text = "Score: " + score;
    placar[1].text = "HiScore: " + hiScore;
}

function bateu(gainha, cano) {
    gainha.changeAni("hit");
    gainha.ani.scale = 0.5;
    canos.vel.x = 0;
    fundo.vel.x = 0;
    gameOver = true;
    cano.color = "purple";
    go = new Sprite();
    go.w = width * 0.8;
    go.h = height / 2;
    go.collider = "n";
    go.color = "#ffffffaa";
    go.textSize = 20;
    go.strokeWeight = 0;
    go.text = "Aperte ENTER para reiniciar";
}
