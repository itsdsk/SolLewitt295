'use strict';

function square(x, y, width, rotationInDegrees) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.rotate(rotationInDegrees * Math.PI / 180);
  ctx.rect(-width / 2, -width / 2, width, width);
  ctx.stroke();
  ctx.restore();
}

function circle(x, y, radius) {
  ctx.beginPath();
  ctx.save();
  ctx.globalCompositeOperation = 'difference';
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();

  ctx.restore();
}


function polygon(num_sides, radius, rotation = 0) {
  ctx.beginPath();
  // var radius = Math.min(canvas.width, canvas.height) * 0.25;
  var start_x = (canvas.width / 2) + (Math.sin(rotation) * radius);
  var start_y = (canvas.height / 2) + (Math.cos(rotation) * radius);
  ctx.moveTo(start_x, start_y);
  for (let i = 0; i < num_sides; i++) {
    var angle = rotation + ((i / num_sides) * (2 * Math.PI));
    var x_pos = Math.sin(angle) * radius;
    var y_pos = Math.cos(angle) * radius;
    ctx.lineTo((canvas.width / 2) + x_pos, (canvas.height / 2) + y_pos);
  }
  ctx.closePath();
  ctx.stroke();
}


function polygonStar(num_sides, radius, rotation = 0) {
  ctx.beginPath();
  var start_x = (canvas.width / 2) + (Math.sin(rotation) * radius);
  var start_y = (canvas.height / 2) + (Math.cos(rotation) * radius);
  ctx.moveTo(start_x, start_y);

  let outerRadius = radius;
  let innerRadius = radius * 0.5;
  for (let i = 0; i < num_sides * 2; i++) {

    var angle = rotation + ((i / (num_sides * 2)) * (2 * Math.PI));
    let x_pos, y_pos;

    radius = i % 2 === 0 ? outerRadius : innerRadius;

    x_pos = Math.sin(angle) * radius;
    y_pos = Math.cos(angle) * radius;

    let x = (canvas.width / 2) + x_pos;
    let y = (canvas.height / 2) + y_pos;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

function polygonWithOffset(num_sides, radius, rotation = 0) {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 10;
  ctx.beginPath();
  // var radius = Math.min(canvas.width, canvas.height) * 0.25;
  var start_x = (canvas.width / 2) + (Math.sin(rotation) * radius);
  var start_y = (canvas.height / 2) + (Math.cos(rotation) * radius);
  ctx.moveTo(start_x, start_y);
  for (let i = 0; i < num_sides; i++) {
    var angle = rotation + ((i / num_sides) * (2 * Math.PI));
    var x_pos = Math.sin(angle) * radius;
    var y_pos = Math.cos(angle) * radius;
    if (i > 0) {
      var offsetAngle = Math.random() * Math.PI * 2;
      var offsetRadius = radius * 0.1;
      x_pos += Math.sin(offsetAngle) * offsetRadius;
      y_pos += Math.cos(offsetAngle) * offsetRadius;
    }
    ctx.lineTo((canvas.width / 2) + x_pos, (canvas.height / 2) + y_pos);
  }
  ctx.closePath();
  ctx.stroke();
}


function makaron(x, y, radius, thickness, rotation) {
  // ctx.save();
  ctx.beginPath();

  // ctx.rotate(rotation * Math.PI / 180);

  let angleLength = Math.PI / 2;
  let startAngle = rotation;
  let endAngle = rotation + angleLength;

  ctx.arc(x, y, radius, startAngle, endAngle);

  let innerX = x + Math.cos(endAngle) * (radius - thickness);
  let innerY = y + Math.sin(endAngle) * (radius - thickness);

  ctx.lineTo(innerX, innerY);
  ctx.arc(x, y, radius - thickness, endAngle, startAngle, true);
  ctx.closePath();

  ctx.stroke();
  // ctx.restore();
}


function playBtn() {
  // Color settings
  let backgroundColor = 'white';
  let buttonColor = 'black';
  let arrowColor = 'white';

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Button
  let x = Math.floor(canvas.width / 2);
  let y = Math.floor(canvas.height / 2);
  let radius = Math.min(canvas.width, canvas.height) * 0.25;

  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Arrow
  ctx.fillStyle = arrowColor;
  ctx.beginPath()
  ctx.moveTo(x + radius * 0.5, y);
  ctx.lineTo(x - radius * 0.3, y - (radius * 0.5));
  ctx.lineTo(x - radius * 0.3, y + (radius * 0.5));
  ctx.closePath();
  ctx.fill();

}