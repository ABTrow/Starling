// set values to help with later canvas resizing
let viewportWidth = Math.min(window.outerWidth, window.innerWidth);
let viewportHeight = Math.min(window.outerHeight, window.innerHeight);
let viewportOrientation = window.screen.orientation
  ? window.screen.orientation.type
  : window.orientation;

// declare variables to prevent errors
let canvas, context;
let color, colorPalette, colorMode, drawPattern;

const menu = document.querySelector('#menu-options');
let menuIsVisibile = true;

// set up event listeners on menu buttons
const tabSelectors = document.querySelectorAll('.tab-selector');
const tabs = document.querySelectorAll('.tab');
tabSelectors.forEach(tab => {
  tab.addEventListener('click', e => setActiveTab(e.target.dataset.tab));
  tab.addEventListener('touchend', e => setActiveTab(e.target.dataset.tab));
});
let activeTab = 'colors';

let clearButton = document.querySelector('#clear-canvas');
clearButton.addEventListener('click', () => resetCanvas(canvas, context));
clearButton.addEventListener('touchend', () => resetCanvas(canvas, context));

const hideMenu = document.querySelector('#hide-menu');
hideMenu.addEventListener('click', toggleMenu);
hideMenu.addEventListener('touchend', toggleMenu);

const paletteButtons = document.querySelector('#palette-buttons');
paletteButtons.addEventListener('click', e => setPalette(e.target.value));
paletteButtons.addEventListener('touchend', e => setPalette(e.target.value));

const modeButtons = document.querySelector('#mode-buttons');
modeButtons.addEventListener('click', e => setColorMode(e.target.value));
modeButtons.addEventListener('touchend', e => setColorMode(e.target.value));

const paintbox = menu.querySelector('#paintbox');

const patternSelectors = document.querySelectorAll('.pattern-selector');
patternSelectors.forEach(selector => {
  selector.addEventListener('click', e => setPattern(e.target.dataset.pattern));
  selector.addEventListener('touchend', e =>
    setPattern(e.target.dataset.pattern)
  );
});

// initial settings
setPalette('beach');
setColorMode('controlled');
setPattern('mirror');

// global event listeners
document.addEventListener('keydown', e => changeSettings(e));
document.addEventListener('mousedown', hideStartingMessage);
document.addEventListener('touchstart', hideStartingMessage);

// canvas creation and setup
let frame = document.querySelector('#frame');
canvas = document.createElement('canvas');

canvas.width = viewportWidth;
canvas.height = viewportHeight;
frame.appendChild(canvas);

context = canvas.getContext('2d');
context.lineJoin = context.lineCap = 'round';
resetCanvas(canvas, context);

window.onresize = adjustWindow;

let rect = canvas.getBoundingClientRect();

// drawing defaults
let isDrawing = false;
let x = 0;
let y = 0;

// desktop
canvas.addEventListener('mousedown', e => {
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

    if (colorMode === 'random-lines') {
      color = generateRandomColor();
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
  e.preventDefault();
  let touches = e.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    let idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      ongoingTouches.splice(idx, 1);
    }
  }
});
