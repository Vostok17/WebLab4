'use strict';

const animBorderWidth = 5;
const squareSide = 20;
const radius = 1;
let squareInterval1;
let squareInterval2;

class Circle {
    constructor(x, y, dx, dy, el, name) {
        this.dx = dx;
        this.dy = dy;
        this.el = el;
        this.name = name;
        if (name === 'green circle') {
            this.pos = Math.PI;
        }
        else {
            this.pos = 0;
        }
        this.x = x;
        this.y = y;
    }

    setdx(dx) {
        this.dx = dx;
    }

    setdy(dy) {
        this.dy = dy;
    }

    getdx() {
        return this.dx;
    }

    getdy() {
        return this.dy;
    }

    getEl() {
        return this.el;
    }

    calcAngle() {
        if (!this.dx && !this.dy) {
            const angle = Math.random() * Math.PI + this.pos;
            this.dx = Math.cos(angle) * radius;
            this.dy = -Math.sin(angle) * radius;
        }
    }
}

const playButton = document.querySelector('.play-button');
const closeButton = document.querySelector('.close-button');
const startButton = document.querySelector('.start-button');
const reloadButton = document.querySelector('.reload-button');
const logText = document.querySelector('.log-text');
const logBlock = document.querySelector('.text-2');
const circle1 = new Circle(0,0,0, 0, document.querySelector('.circle1'), 'green circle');
const circle2 = new Circle(0,0,0, 0, document.querySelector('.circle2'), 'orange circle');
const work = document.querySelector('.work');
const animEl = document.querySelector('.anim');
const anim = animEl.getContext('2d');
let statusT = '';

const recordLog = message => {
    logText.innerHTML = message;
    const date = JSON.stringify(new Date());
    const logs = JSON.parse(localStorage.getItem('logs')) ?? [];
    logs.push(`${date}: ${message}`);
    localStorage.setItem('logs', JSON.stringify(logs));
};
  
const emptyLog = () => {
const logs = JSON.parse(localStorage.getItem('logs')) ?? [];
logBlock.innerHTML = logs.join('<br>');
localStorage.removeItem('logs');
};


animEl.setAttribute(
    'width',
    window.innerWidth * 0.4 -
        5 * 2 +
        'px'
);

animEl.setAttribute(
    'height',
    window.innerHeight * 0.8 -
        5 +
        'px'
);

let x, y;
localStorage.clear();

playButton.addEventListener('click', () => {
    recordLog('Play button pressed');
    recordLog('Work field shown');
    
    playButton.disabled = true;
    startButton.style.display = 'block';
    reloadButton.style.display = 'none';
    work.style.display = 'block';
  
    anim.beginPath();
    anim.clearRect(0, 0, animEl.width, animEl.height);
    x = 10 + (animEl.width - 20) * Math.random();
    y = 10;
    anim.arc(x, y, 10, 0, Math.PI*2);
    anim.fillStyle = "green";
    anim.fill();
    anim.closePath();

    circle1.x = x;
    circle1.y = y;

    anim.beginPath();
    anim.fillStyle = "orange";
    x = (animEl.width - 20) * Math.random();
    y = animEl.height - 10;
    anim.arc(x, y, 10, 0, Math.PI*2)
    anim.fill();
    anim.closePath();

    circle2.x = x;
    circle2.y = y;
});

closeButton.addEventListener('click', () => {
    work.style.display = 'none';
    playButton.disabled = false;
    startButton.disabled = false;
    clearInterval(squareInterval1);
    clearInterval(squareInterval2);
    circle1.dx = 0;
    circle1.dy = 0;
    circle2.dx = 0;
    circle2.dy = 0;
    recordLog('Close button pressed');
    recordLog('Work field closed');
    emptyLog();
});

startButton.addEventListener('click', () => {
    recordLog('Start botton pressed');
    startButton.disabled = true;
    reloadButton.style.display = 'none';

    circle1.dx = 0;
    circle1.dy = 0;
    circle2.dx = 0;
    circle2.dy = 0;

    circle1.calcAngle();
    circle2.calcAngle();

    squareInterval1 = setInterval(controlMovement, 1);
});

reloadButton.addEventListener('click', () => {
    recordLog('Reload button pressed');
  
    startButton.style.display = 'block';
    stopButton.style.display = 'none';
    reloadButton.style.display = 'none';
  
    anim.beginPath();
    anim.clearRect(0, 0, animEl.width, animEl.height);
    x = 10 + (animEl.width - 20) * Math.random();
    y = 10;
    anim.arc(x, y, 10, 0, Math.PI*2);
    anim.fillStyle = "green";
    anim.fill();
    anim.closePath();

    circle1.x = x;
    circle1.y = y;

    anim.beginPath();
    anim.fillStyle = "orange";
    x = (animEl.width - 20) * Math.random();
    y = animEl.height - 10;
    anim.arc(x, y, 10, 0, Math.PI*2)
    anim.fill();
    anim.closePath();

    circle2.x = x;
    circle2.y = y;
});


const moveObject = () => {
    anim.clearRect(0, 0, animEl.width, animEl.height);
    anim.beginPath();
    circle1.x += circle1.dx;
    circle1.y += circle1.dy;
    anim.arc(circle1.x, circle1.y, 10, 0, Math.PI*2);
    anim.fillStyle = "green";
    anim.fill();
    anim.closePath();

    anim.beginPath();
    anim.fillStyle = "orange";
    circle2.x += circle2.dx;
    circle2.y += circle2.dy;
    anim.arc(circle2.x, circle2.y, 10, 0, Math.PI*2)
    anim.fill();
    anim.closePath();
};

const controlMovement = () => {

    if (circle1.x + circle1.dx > animEl.width - 5) {
        recordLog(`The green circle bumped into the right panel`);
        circle1.dx = -circle1.dx;
    }
    if (circle1.y + circle1.dy > animEl.height - 5) {
        recordLog(`The green circle square bumped into the top panel`);
        circle1.dy = -circle1.dy;
    }
  
    if (circle1.y + circle1.dy < 5) {
        recordLog(`The green circle square bumped into the bottom panel`);
        circle1.dy = -circle1.dy;
    }
  
    if (circle1.x + circle1.dx < 5) {
        recordLog(`The green circle square bumped into the left panel`);
        circle1.dx = -circle1.dx;
    }

    if (circle2.x + circle2.dx > animEl.width - 5) {
        recordLog(`The orange circle bumped into the right panel`);
        circle2.dx = -circle2.dx;
    }
    if (circle2.y + circle2.dy > animEl.height - 5) {
        recordLog(`The orange circle square bumped into the top panel`);
        circle2.dy = -circle2.dy;
    }

    if (circle2.y + circle2.dy < 5) {
        recordLog(`The orange circle square bumped into the bottom panel`);
        circle2.dy = -circle2.dy;
    }

    if (circle2.x + circle2.dx < 5) {
        recordLog(`The orange circle square bumped into the left panel`);
        circle2.dx = -circle2.dx;
    }

    if (calcDistance() <= 20) {
        recordLog('Circles bumped');
        circle1.dx = -circle1.dx;
        circle1.dy = -circle1.dy;
        circle2.dx = -circle2.dx;
        circle2.dy = -circle2.dy;
    }
    checkCirclesArea();
    moveObject();
};

const checkCirclesArea = () => {
    const sideFlow = animEl.height / 2;
    // check top area
    if (circle1.y + 10 <= sideFlow && circle2.y + 10 <= sideFlow) {
        if (statusT === 'bottom' || statusT === '') {
            statusT = 'top';
            recordLog('The circles on bottom field');
        }  
        startButton.style.display = 'none';
        reloadButton.style.display = 'block';

    }
    // check bottom area
    if (circle1.y - 10 >= sideFlow && circle2.y - 10 >= sideFlow ) {
        if (statusT === 'top' || statusT === '') {
            statusT = 'bottom';
            recordLog('The circles on bottom field');
        }   
        startButton.style.display = 'none';
        reloadButton.style.display = 'block';
    }
}

const calcDistance = () => {
    return Math.sqrt(Math.pow(circle2.x - circle1.x, 2) + Math.pow(circle2.y - circle1.y, 2),
    );
};