let viewportWidth = Math.min(window.outerWidth, window.innerWidth);
let viewportHeight = Math.min(window.outerHeight, window.innerHeight);
let viewportOrientation = window.screen.orientation
  ? window.screen.orientation.type
  : window.orientation;
const longTouchDuration = 1000;
let touchTimer;
let menuIsVisibile = true;
let color;

let drawPattern = patterns.one;
let colorPalette = palettes.beach;

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

function toggleMenu() {
  if (menuIsVisibile) menu.id = 'menu-hidden';
  else menu.id = 'menu';
  menuIsVisibile = !menuIsVisibile;
}

document.addEventListener('keydown', e => changeSettings(e));

function changeSettings(e) {
  e.preventDefault;
  switch (e.code) {
    case 'Digit1':
      colorPalette = palettes.beach;
      break;
    case 'Digit2':
      colorPalette = palettes.forest;
      break;
    case 'Digit8':
      drawPattern = patterns.one;
      break;
    case 'Digit9':
      drawPattern = patterns.two;
      break;
    case 'Digit0':
      drawPattern = patterns.three;
      break;
    case 'Space':
      toggleMenu();
      break;
  }
}

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

window.onresize = () => {
  // create a temporary canvas to store current art
  const tempCanvas = document.createElement('canvas');
  const tempContext = tempCanvas.getContext('2d');
  tempCanvas.width = viewportWidth;
  tempCanvas.height = viewportHeight;
  tempContext.drawImage(canvas, 0, 0);

  // Math.min to ensure proper functionality on mobile and desktop
  let newWidth = Math.min(window.outerWidth, window.innerWidth);
  let newHeight = Math.min(window.outerHeight, window.innerHeight);

  // resize canvas and rect
  canvas.width = newWidth;
  canvas.height = newHeight;
  rect = canvas.getBoundingClientRect();

  let newOrientation = window.screen.orientation
    ? window.screen.orientation.type
    : window.orientation;

  if (viewportOrientation !== newOrientation) {
    // calulate scale change for rotation
    let xScale2 = newHeight / viewportWidth;
    let yScale2 = newWidth / viewportHeight;
    // rotate image incase of mobile screen orientation change
    viewportOrientation = newOrientation;
    context.save();
    context.rotate((90 * Math.PI) / 180);
    context.translate(0, -newWidth);
    context.scale(xScale2, yScale2);
    context.drawImage(tempCanvas, 0, 0);
    context.restore();
    context.lineJoin = context.lineCap = 'round';
  } else {
    // calculate scale change
    let xScale = newWidth / viewportWidth;
    let yScale = newHeight / viewportHeight;
    // rescale art for desktop window size change.
    context.save();
    context.scale(xScale, yScale);
    context.drawImage(tempCanvas, 0, 0);
    context.restore();
    context.lineJoin = context.lineCap = 'round';
  }
  // update stored viewport size to new size
  viewportWidth = newWidth;
  viewportHeight = newHeight;
};

let rect = canvas.getBoundingClientRect();

let isDrawing = false;
let x = 0;
let y = 0;

canvas.addEventListener('mousedown', e => {
  if (messageVisible) {
    messageVisible = false;
    startingMessage.id = 'starting-message-hidden';
  }
  color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
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
    touchTimer = setTimeout(toggleMenu, longTouchDuration);

    color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

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

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    let id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
}

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = 15;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}
