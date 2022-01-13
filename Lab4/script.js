'use strict';

const animBorderWidth = 5;
const squareSide = 20;
const radius = 1;
let squareInterval1;
let squareInterval2;

class Circle {
    constructor(dx, dy, el, name) {
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
const circle1 = new Circle(0, 0, document.querySelector('.circle1'), 'green circle');
const circle2 = new Circle(0, 0, document.querySelector('.circle2'), 'orange circle');
const work = document.querySelector('.work');
const anim = document.querySelector('.anim');
const topArea = document.querySelector('.texture-1');
const bottomArea = document.querySelector('.texture-2');
const logText = document.querySelector('.log-text');
const logBlock = document.querySelector('.text-2');
let statusT = '';

const recordLog = (message) => {
    logText.innerHTML = message;
    const date = JSON.stringify(new Date());
    const logs = JSON.parse(localStorage.getItem('logs')) ?? [];
    logs.push(`${date}: ${message}`);
    localStorage.setItem('logs', JSON.stringify(logs));
}

const emptyLog = () => {
    const logs = JSON.parse(localStorage.getItem('logs')) ?? [];
    logBlock.innerHTML = logs.join('<br>');
    localStorage.removeItem('logs');
}

const checkCirclesArea = () => {
    const circle1Boundes = circle1.el.getBoundingClientRect();
    const circle2Boundes = circle2.el.getBoundingClientRect();
    // check top area
    const topBoundes = topArea.getBoundingClientRect();
    if (circle1Boundes.bottom <= topBoundes.bottom && circle2Boundes.bottom <= topBoundes.bottom) {
        if (statusT === 'bottom' || statusT === '') {
            statusT = 'top';
            recordLog('The circles on bottom field');
        }  
        startButton.style.display = 'none';
        reloadButton.style.display = 'block';

    }
    // check bottom area
    const bottomBoundes = bottomArea.getBoundingClientRect();
    if (circle1Boundes.top >= bottomBoundes.top && circle2Boundes.top >= bottomBoundes.top) {
        if (statusT === 'top' || statusT === '') {
            statusT = 'bottom';
            recordLog('The circles on bottom field');
        }   
        startButton.style.display = 'none';
        reloadButton.style.display = 'block';
    }
}

const calcDistance = () => {
    const centre1x = parseInt(circle1.el.style.top) + squareSide / 2;
    const centre1y = parseInt(circle1.el.style.left) + squareSide / 2;

    const centre2x = parseInt(circle2.el.style.top) + squareSide / 2;
    const centre2y = parseInt(circle2.el.style.left) + squareSide / 2;

    return Math.sqrt(
        Math.pow(centre2x - centre1x, 2) + Math.pow(centre2y - centre1y, 2),
    );
};

playButton.addEventListener('click', () => {
    recordLog('Play button pressed');
    recordLog('Work field shown');

    playButton.disabled = true;
    startButton.style.display = 'block';
    reloadButton.style.display = 'none';
    work.style.display = 'block';
    circle1.el.style.display = 'block';
    circle2.el.style.display = 'block';

    circle1.dx = 0;
    circle1.dy = 0;
    circle2.dx = 0;
    circle2.dy = 0;

    const rect = anim.getBoundingClientRect();

    const start = rect.left + animBorderWidth + 1;
    const end = rect.right - animBorderWidth - squareSide - 1;

    circle1.el.style.top = `${rect.top + animBorderWidth}px`;
    const startLoc1 = start + (end - start) * Math.random();
    circle1.el.style.left = `${startLoc1}px`;

    circle2.el.style.top = `${rect.bottom - animBorderWidth - squareSide}px`;
    const startLoc2 = start + (end - start) * Math.random();
    circle2.el.style.left = `${startLoc2}px`;
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

const moveObject = object => {
    const rect = object.getEl().getBoundingClientRect();
    const x = rect.left + object.getdx();
    const y = rect.top + object.getdy();
    object.getEl().style.top = `${y}px`;
    object.getEl().style.left = `${x}px`;
};

const controlMovement = object => {
    const objRect = object.el.getBoundingClientRect();
    const animRect = anim.getBoundingClientRect();

    if (objRect.right > animRect.right - animBorderWidth + 1) {
        recordLog(`The ${object.name} bumped into the right panel`);
        object.dx = -object.getdx();      
    }

    if (objRect.top < animRect.top + animBorderWidth - 1) {
        recordLog(`The ${object.name} square bumped into the top panel`);
        object.dy = -object.getdy();  
    }

    if (objRect.bottom > animRect.bottom - animBorderWidth + 1) {
        recordLog(`The ${object.name} square bumped into the bottom panel`);
        object.dy = -object.getdy();  
    }

    if (objRect.left < animRect.left + animBorderWidth - 1) {   
        recordLog(`The ${object.name} square bumped into the left panel`);
        object.dx = -object.getdx();
    }

    if (calcDistance() + 1 <= squareSide) {
        recordLog('Circles bumped');
        circle1.dx = -circle1.dx;
        circle1.dy = -circle1.dy;
        circle2.dx = -circle2.dx;
        circle2.dy = -circle2.dy;
    }
    checkCirclesArea();
    moveObject(object);
};

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

    squareInterval1 = setInterval(controlMovement, 1, circle1);
    squareInterval2 = setInterval(controlMovement, 1, circle2);
});

reloadButton.addEventListener('click', () => {
    recordLog('Reload botton pressed');
    startButton.style.display = 'block';
    reloadButton.style.display = 'none';

    const rect = anim.getBoundingClientRect();

    const start = rect.left + animBorderWidth + 1;
    const end = rect.right - animBorderWidth - squareSide;

    circle1.el.style.top = `${rect.top + animBorderWidth}px`;
    const startLoc1 = start + (end - start) * Math.random();
    circle1.el.style.left = `${startLoc1}px`;

    circle2.el.style.top = `${rect.bottom - animBorderWidth - squareSide}px`;
    const startLoc2 = start + (end - start) * Math.random();
    circle2.el.style.left = `${startLoc2}px`;

    circle1.dx = 0;
    circle1.dy = 0;
    circle2.dx = 0;
    circle2.dy = 0;
    clearInterval(squareInterval1);
    clearInterval(squareInterval2);
    startButton.disabled = false;
});
