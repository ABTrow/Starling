function patternOne(e, x, y) {
  drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);

  drawLine(
    context,
    rect.right - x,
    rect.bottom - y,
    rect.right - e.clientX,
    rect.bottom - e.clientY
  );

  drawLine(
    context,
    x,
    rect.bottom - y,
    e.clientX - rect.left,
    rect.bottom - e.clientY
  );

  drawLine(
    context,
    rect.right - x,
    y,
    rect.right - e.clientX,
    e.clientY - rect.top
  );
}

function patternTwo(e, x, y) {
  drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);

  drawLine(
    context,
    x + rect.right / 2,
    y,
    e.clientX + rect.right / 2,
    e.clientY - rect.top
  );

  drawLine(
    context,
    x - rect.right / 2,
    y,
    e.clientX - rect.right / 2,
    e.clientY - rect.top
  );

  drawLine(
    context,
    rect.right / 2 - x,
    rect.bottom - y,
    rect.right / 2 - e.clientX,
    rect.bottom - e.clientY
  );

  drawLine(
    context,
    rect.right - x,
    rect.bottom - y,
    rect.right - e.clientX,
    rect.bottom - e.clientY
  );

  drawLine(
    context,
    1.5 * rect.right - x,
    rect.bottom - y,
    1.5 * rect.right - e.clientX,
    rect.bottom - e.clientY
  );
}

let drawPattern = patternOne;

const beachPalette = ['#EAEFF9', '#6C8D9B', '#D3CEAD', '#E6E1C5'];
const forestPalette = ['#B9FFAD', '#3F633D', '#514E3C', '#513535', '#7A0000'];

let colorPalette = beachPalette;

document.addEventListener('keydown', () => changeSettings(event));

function changeSettings() {
  switch (event.code) {
    case 'Digit1':
      colorPalette = beachPalette;
      break;
    case 'Digit2':
      colorPalette = forestPalette;
      break;
    case 'Digit9':
      drawPattern = patternOne;
      break;
    case 'Digit0':
      drawPattern = patternTwo;
      break;
  }
}

let canvas = document.createElement('canvas');
let frame = document.querySelector('#frame');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

frame.appendChild(canvas);

let context = canvas.getContext('2d');
context.lineJoin = context.lineCap = 'round';

// Set size of background gradient
let gradient = context.createLinearGradient(
  0,
  0,
  window.innerWidth,
  window.innerHeight
);

// Add three color stops
gradient.addColorStop(0, '#A1ACC4');
gradient.addColorStop(0.5, '#97A7C9');
gradient.addColorStop(1, '#BFD4FF');

// Set the fill style and draw a rectangle
context.fillStyle = gradient;
context.fillRect(0, 0, window.innerWidth, window.innerHeight);

const rect = canvas.getBoundingClientRect();

let isDrawing = false;
let x = 0;
let y = 0;

canvas.addEventListener('mousedown', e => {
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  isDrawing = true;
});

canvas.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    drawPattern(e, x, y);

    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

function drawLine(context, x1, y1, x2, y2) {
  let color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = 15;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}
