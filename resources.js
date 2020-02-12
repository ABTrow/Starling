const patterns = {
  mirror: (context, x1, y1, x2, y2) => {
    drawLine(context, x1, y1, x2, y2);

    drawLine(
      context,
      rect.right - x1,
      rect.bottom - y1,
      rect.right - x2,
      rect.bottom - y2
    );

    drawLine(context, x1, rect.bottom - y1, x2, rect.bottom - y2);

    drawLine(context, rect.right - x1, y1, rect.right - x2, y2);
  },

  horizontal: (context, x1, y1, x2, y2) => {
    drawLine(context, x1, y1, x2, y2);

    drawLine(context, x1 + rect.right / 2, y1, x2 + rect.right / 2, y2);

    drawLine(context, x1 - rect.right / 2, y1, x2 - rect.right / 2, y2);

    drawLine(
      context,
      rect.right / 2 - x1,
      rect.bottom - y1,
      rect.right / 2 - x2,
      rect.bottom - y2
    );

    drawLine(
      context,
      rect.right - x1,
      rect.bottom - y1,
      rect.right - x2,
      rect.bottom - y2
    );

    drawLine(
      context,
      1.5 * rect.right - x1,
      rect.bottom - y1,
      1.5 * rect.right - x2,
      rect.bottom - y2
    );
  },
  swirl: (context, x1, y1, x2, y2) => {
    context.save();
    let rotationCount = 0;

    while (rotationCount < 6) {
      drawLine(context, x1, y1, x2, y2);
      context.translate(rect.right / 2, rect.bottom / 2);
      context.rotate((60 * Math.PI) / 180);
      context.translate(-rect.right / 2, -rect.bottom / 2);
      rotationCount++;
    }

    context.restore();
  },
  fractal: (context, x1, y1, x2, y2, scale = 1) => {
    console.log('looping at scale', scale);
    context.save();
    let rotationCount = 0;

    context.scale(scale, scale);

    while (scale > 0.6 && rotationCount < 4) {
      drawLine(context, x1, y1, x2, y2);
      const inverseScale = 1 / scale;
      patterns.fractal(context, x1, y1, x2, y2, scale * 0.8);
      context.translate(
        (inverseScale * rect.right) / 2,
        (inverseScale * rect.bottom) / 2
      );
      context.rotate((90 * Math.PI) / 180);
      context.translate(
        (inverseScale * -rect.right) / 2,
        (inverseScale * -rect.bottom) / 2
      );
      rotationCount++;
    }
    context.restore();
  },
  none: (context, x1, y1, x2, y2) => {
    drawLine(context, x1, y1, x2, y2);
  },
};

const palettes = {
  beach: ['#EAEFF9', '#6C8D9B', '#D3CEAD', '#E6E1C5', '#F7CFCF', '#9DEAC7'],
  forest: ['#B9FFAD', '#3F633D', '#514E3C', '#513535', '#7A0000', '#6A75A5'],
  tropics: ['#F7BD67', '#EA9DBE', '#EF4C4C', '#D9DFF7', '#4DD676', '#30DDDD'],
};
