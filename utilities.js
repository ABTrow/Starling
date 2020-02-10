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

const changeSettings = e => {
  e.preventDefault;
  switch (e.code) {
    case 'Digit1':
      colorPalette = palettes.beach;
      break;
    case 'Digit2':
      colorPalette = palettes.forest;
      break;
    case 'Digit4':
      colorMode = 'crazy-lines';
      break;
    case 'Digit5':
      colorMode = 'random-lines';
      break;
    case 'Digit6':
      colorMode = 'crazy-lines';
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

const drawLine = (context, x1, y1, x2, y2) => {
  if (colorMode === 'crazy-lines') {
    color = generateRandomColor();
  }

  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = 15;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
};

const generateRandomColor = () => {
  return colorPalette[Math.floor(Math.random() * colorPalette.length)];
};

const setColor = newColor => {
  color = newColor;
};

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

const setColorMode = newMode => {
  modeButtons.childNodes.forEach(button => {
    if (button.value === newMode) button.className = 'active';
    else button.className = '';
  });
  colorMode = newMode;
};

const setActiveTab = tabName => {
  tabs.forEach(tab => {
    if (tab.id === tabName) tab.classList.remove('hidden');
    else tab.classList.add('hidden');
  });
};

const setPattern = newPattern => {
  drawPattern = patterns[newPattern];
};

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
