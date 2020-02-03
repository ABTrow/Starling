const patterns = {
  one: (context, x1, y1, x2, y2) => {
    drawLine(context, x1, y1, x2 - rect.left, y2 - rect.top);

    drawLine(
      context,
      rect.right - x1,
      rect.bottom - y1,
      rect.right - x2,
      rect.bottom - y2
    );

    drawLine(context, x1, rect.bottom - y1, x2 - rect.left, rect.bottom - y2);

    drawLine(context, rect.right - x1, y1, rect.right - x2, y2 - rect.top);
  },

  two: (context, x1, y1, x2, y2) => {
    drawLine(context, x1, y1, x2 - rect.left, y2 - rect.top);

    drawLine(
      context,
      x1 + rect.right / 2,
      y1,
      x2 + rect.right / 2,
      y2 - rect.top
    );

    drawLine(
      context,
      x1 - rect.right / 2,
      y1,
      x2 - rect.right / 2,
      y2 - rect.top
    );

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
  three: (context, x1, y1, x2, y2) => {
    context.save();
    let rotationCount = 0;

    while (rotationCount < 6) {
      drawLine(context, x1, y1, x2 - rect.left, y2 - rect.top);
      context.translate(rect.right / 2, rect.bottom / 2);
      context.rotate((60 * Math.PI) / 180);
      context.translate(-rect.right / 2, -rect.bottom / 2);
      rotationCount++;
    }

    context.restore();
  },
};

const palettes = {
  beach: ['#EAEFF9', '#6C8D9B', '#D3CEAD', '#E6E1C5'],
  forest: ['#B9FFAD', '#3F633D', '#514E3C', '#513535', '#7A0000'],
};
