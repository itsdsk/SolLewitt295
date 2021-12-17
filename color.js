'use strict';


function background(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//colors are represented as objects {r, g, b}, numbers between 0-255
//percent 0.0-1.0
function lerpColor(source, target, percent) {
  let r = source.r + (target.r - source.r) * percent;
  let g = source.g + (target.g - source.g) * percent;
  let b = source.b + (target.b - source.b) * percent;


  let resultColor = {r, g, b};
  return resultColor;
}

function changeBackgroundColor() {
  let color = getRandomColor();
  backgroundColor =CSSColor(color);
}

function getRandomColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  return {r, g, b};
}

function CSSColor(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}