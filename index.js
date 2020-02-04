let viewportWidth = Math.min(window.outerWidth, window.innerWidth);
let viewportHeight = Math.min(window.outerHeight, window.innerHeight);
let viewportOrientation = window.screen.orientation
  ? window.screen.orientation.type
  : window.orientation;
const longTouchDuration = 1000;
let touchTimer;
let menuIsVisibile = true;
let color = palettes.beach[0];

let drawPattern = patterns.one;
let colorPalette = palettes.beach;
let colorMode = 'random-lines';

const startingMessage = document.querySelector('#starting-message');
let messageVisible = true;

const menu = document.querySelector('#menu');
const buttons = menu.querySelectorAll('button');

buttons.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    let target = e.target;
    if (target.dataset.palette) {
      colorPalette = palettes[target.dataset.palette];
    } else if (target.dataset.pattern) {
      drawPattern = patterns[target.dataset.pattern];
    } else {
      toggleMenu();
    }
  });

  button.addEventListener('touchend', e => {
    let target = e.changedTouches[0].target;
    if (target.dataset.palette) {
      colorPalette = palettes[target.dataset.palette];
    } else if (target.dataset.pattern) {
      drawPattern = patterns[target.dataset.pattern];
    } else {
      toggleMenu();
    }
  });
});

document.addEventListener('keydown', e => changeSettings(e));

let canvas = document.createElement('canvas');
let frame = document.querySelector('#frame');

canvas.width = viewportWidth;
canvas.height = viewportHeight;

frame.appendChild(canvas);

let context = canvas.getContext('2d');
context.lineJoin = context.lineCap = 'round';

// Set size of background gradient
let gradient = context.createLinearGradient(
  0,
  0,
  viewportWidth,
  viewportHeight
);

// Add three color stops
gradient.addColorStop(0, '#A1ACC4');
gradient.addColorStop(0.5, '#97A7C9');
gradient.addColorStop(1, '#BFD4FF');

// Set the fill style and draw a rectangle
context.fillStyle = gradient;
context.fillRect(0, 0, viewportWidth, viewportHeight);

window.onresize = adjustWindow;

let rect = canvas.getBoundingClientRect();

let isDrawing = false;
let x = 0;
let y = 0;

canvas.addEventListener('mousedown', e => {
  if (messageVisible) {
    messageVisible = false;
    startingMessage.id = 'starting-message-hidden';
  }
  if (colorMode === 'random-lines') {
    color = generateRandomColor();
  }
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  isDrawing = true;
});

canvas.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    drawPattern(context, x, y, e.clientX, e.clientY);
    x = e.clientX;
    y = e.clientY;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    drawPattern(context, x, y, e.clientX, e.clientY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

// mobile
let ongoingTouches = [];

canvas.addEventListener(
  'touchstart',
  e => {
    e.preventDefault();

    if (e.changedTouches[0].pageY < 50) {
      touchTimer = setTimeout(toggleMenu, longTouchDuration);
    }

    if (colorMode === 'random-lines') {
      color = generateRandomColor();
    }

    if (messageVisible) {
      messageVisible = false;
      startingMessage.id = 'starting-message-hidden';
    }

    let touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      ongoingTouches.push(copyTouch(touches[i]));
    }
  },
  false
);

canvas.addEventListener(
  'touchmove',
  e => {
    e.preventDefault();
    let touches = e.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      let idx = ongoingTouchIndexById(touches[i].identifier);

      if (touchTimer && touches[i].pageY > 50) clearTimeout(touchTimer);

      if (idx >= 0) {
        let x1 = ongoingTouches[idx].pageX;
        let y1 = ongoingTouches[idx].pageY;

        let x2 = touches[i].pageX;
        let y2 = touches[i].pageY;

        drawPattern(context, x1, y1, x2, y2);

        ongoingTouches.splice(idx, 1, copyTouch(touches[i]));
      }
    }
  },
  false
);

window.addEventListener('touchend', e => {
  event.preventDefault();
  if (touchTimer) clearTimeout(touchTimer);
  let touches = e.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    let idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      ongoingTouches.splice(idx, 1);
    }
  }
});
