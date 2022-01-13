'use strict';

const animBorderWidth = 5;
const squareSide = 20;
const radius = 1;
let squareInterval1;
let squareInterval2;

class Circle {
    constructor(dx, dy, el) {
        this.dx = dx;
        this.dy = dy;
        this.el = el;
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
            const angle =
                Math.random() * (Math.PI * (3 / 2) - Math.PI) + Math.PI;
            this.dx = Math.cos(angle) * radius;
            this.dy = -Math.sin(angle) * radius;
        }
    }
}

const playButton = document.querySelector('.play-button');
const closeButton = document.querySelector('.close-button');
const startButton = document.querySelector('.start-button');
const stopButton = document.querySelector('.stop-button');
const reloadButton = document.querySelector('.reload-button');
const circle1 = new Circle(0, 0, document.querySelector('.circle1'));
const circle2 = new Circle(0, 0, document.querySelector('.circle2'));
const work = document.querySelector('.work');
const anim = document.querySelector('.anim');
const topArea = document.querySelector('.texture-1');
const bottomArea = document.querySelector('.texture-2');

const checkCirclesArea = () => {
    // check top area
    const topBoundes = topArea.getBoundingClientRect();
    if (circle1.bottom >= topBoundes.bottom && circle2.bottom >= topBoundes.bottom) {
        alert("works");
    }
    // check bottom area
    const bottomBoundes = bottomArea.getBoundingClientRect();
    if (circle1.top <= bottomBoundes.top && circle2.top <= bottomArea.top) {
        alert('works');
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
    playButton.disabled = true;
    startButton.style.display = 'block';
    stopButton.style.display = 'none';
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
    const end = rect.right - animBorderWidth - squareSide;

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
    clearInterval(squareInterval1);
    clearInterval(squareInterval2);
    circle1.dx = 0;
    circle1.dy = 0;
    circle2.dx = 0;
    circle2.dy = 0;
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
        object.dx = -object.getdx();
    }

    if (objRect.top < animRect.top + animBorderWidth - 1) {
        object.dy = -object.getdy();
    }

    if (objRect.bottom > animRect.bottom - animBorderWidth + 1) {
        object.dy = -object.getdy();
    }

    if (objRect.left < animRect.left + animBorderWidth - 1) {
        object.dx = -object.getdx();
    }

    if (calcDistance() <= squareSide) {
        circle1.dx = -circle1.dx;
        circle1.dy = -circle1.dy;
        circle2.dx = -circle2.dx;
        circle2.dy = -circle2.dy;
    }
    checkCirclesArea();
    moveObject(object);
};

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    reloadButton.style.display = 'none';
    stopButton.style.display = 'block';

    circle1.dx = 0;
    circle1.dy = 0;
    circle2.dx = 0;
    circle2.dy = 0;

    circle1.calcAngle();
    circle2.calcAngle();

    squareInterval1 = setInterval(controlMovement, 1, circle1);
    squareInterval2 = setInterval(controlMovement, 1, circle2);
});

stopButton.addEventListener('click', () => {
    startButton.style.display = 'block';
    reloadButton.style.display = 'none';
    stopButton.style.display = 'none';
    clearInterval(squareInterval1);
    clearInterval(squareInterval2);

    circle1.dx = 0;
    circle1.dy = 0;
    circle2.dx = 0;
    circle2.dy = 0;
});

reloadButton.addEventListener('click', () => {
    startButton.style.display = 'block';
    stopButton.style.display = 'none';
    reloadButton.style.display = 'none';

    const rect = anim.getBoundingClientRect();

    circle1.style.top = `${rect.top + animBorderWidth}px`;
    const startLoc1 =
        (rect.right - animBorderWidth - squareSide) * Math.random();
    circle1.style.left = `${startLoc1}px`;

    circle2.style.top = `${rect.bottom - animBorderWidth - squareSide}px`;
    const startLoc2 =
        (rect.right - animBorderWidth - squareSide) * Math.random();
    circle2.style.left = `${startLoc2}px`;

    circle1.dx = 0;
    circle1.dy = 0;
    circle2.dx = 0;
    circle2.dy = 0;
});
