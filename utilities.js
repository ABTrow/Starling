// dealing with window resize and orientation changes
const adjustWindow = () => {
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

// toggle menu by keyboard (add more features?)
const changeSettings = e => {
  e.preventDefault;
  switch (e.code) {
    case 'Space':
      toggleMenu();
      break;
  }
};

const toggleMenu = () => {
  if (menuIsVisibile) {
    menu.id = 'menu-hidden';
    hideMenu.innerHTML = 'show menu';
  } else {
    menu.id = 'menu-options';
    hideMenu.innerHTML = 'hide menu';
  }
  menuIsVisibile = !menuIsVisibile;
};

// helper functions for touch drawing
const copyTouch = ({ identifier, pageX, pageY }) => {
  return { identifier, pageX, pageY };
};

const ongoingTouchIndexById = idToFind => {
  for (let i = 0; i < ongoingTouches.length; i++) {
    let id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
};

function distanceBetween(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(x2 - x1, y2 - y1);
}

// helper function for drawing
const drawLine = (context, x1, y1, x2, y2) => {
  if (colorMode === 'crazy-lines') {
    color = generateRandomColor();
  }

  const dist = distanceBetween(x1, y1, x2, y2);
  const angle = angleBetween(x1, y1, x2, y2);

  for (let i = 0; i < dist; i += 5) {
    x = x1 + Math.sin(angle) * i;
    y = y1 + Math.cos(angle) * i;

    let radgrad = context.createRadialGradient(x, y, 3, x, y, 10);

    radgrad.addColorStop(0, `${color}FF`);
    radgrad.addColorStop(0.8, `${color}BB`);
    radgrad.addColorStop(1, `${color}00`);

    context.fillStyle = radgrad;
    context.fillRect(x - 20, y - 20, 40, 40);
  }
};

// ensures next color is not the same as the current color
const generateRandomColor = () => {
  let newColor;
  do {
    newColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  } while (newColor === color);
  return newColor;
};

// set color and showfeedback in paint palette
const setColor = newColor => {
  if (colorMode === 'controlled') {
    paintbox.childNodes.forEach(button => {
      if (button.dataset.color === newColor) button.innerHTML = '✓';
      else button.innerHTML = '';
    });
  }
  color = newColor;
};

// set palette and create buttons for paint colors in menu
const setPalette = paletteName => {
  paletteButtons.childNodes.forEach(button => {
    if (button.value === paletteName) button.className = 'active';
    else button.className = '';
  });

  while (paintbox.firstChild) {
    paintbox.removeChild(paintbox.firstChild);
  }

  colorPalette = palettes[paletteName];
  setColor(colorPalette[0]);

  colorPalette.forEach(color => {
    let button = document.createElement('button');
    button.style.backgroundColor = color;
    button.dataset.color = color;
    button.className = 'paintbox-color';
    button.addEventListener('click', e => setColor(e.target.dataset.color));
    button.addEventListener('touchend', e => setColor(e.target.dataset.color));
    paintbox.appendChild(button);
  });
};

// set color mode
const setColorMode = newMode => {
  modeButtons.childNodes.forEach(button => {
    if (button.value === newMode) button.className = 'active';
    else button.className = '';
  });
  if (newMode === 'controlled') {
    paintbox.childNodes.forEach(button => {
      if (button.dataset.color === color) button.innerHTML = '✓';
      else button.innerHTML = '';
    });
  } else {
    paintbox.childNodes.forEach(button => (button.innerHTML = ''));
  }
  colorMode = newMode;
};

// toggle between tabs
const setActiveTab = tabName => {
  tabs.forEach(tab => {
    if (tab.id === tabName) tab.classList.remove('hidden');
    else tab.classList.add('hidden');
  });
  tabSelectors.forEach(selector => {
    if (selector.dataset.tab === tabName) selector.classList.add('active');
    else selector.classList.remove('active');
  });
};

// set patterns
const setPattern = newPattern => {
  patternSelectors.forEach(button => {
    if (button.dataset.pattern === newPattern) button.classList.add('active');
    else button.classList.remove('active');
  });
  drawPattern = patterns[newPattern];
};

// clear canvas then redraw background gradient
const resetCanvas = (canvas, context) => {
  context.clearRect(0, 0, canvas.width, canvas.length);

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
};

const hideStartingMessage = () => {
  const startingMessage = document.querySelector('#starting-message');
  startingMessage.id = 'starting-message-hidden';
  document.removeEventListener('mousedown', hideStartingMessage);
  document.removeEventListener('touchstart', hideStartingMessage);
};
