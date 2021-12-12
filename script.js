'use strict';

// Instruction: "Six white geometric figures (outlines) superimposed on a black wall."

// TODO:
//  - 6 different shapes selected randomly
//  - globalCompositeOperation

/*
  Current shapes:
  - polygon
  - polygon star
  - makaron
  - circle?
  - polygonWithOffset
  
*/


document.addEventListener('click', function () {

  audioElement.play();
  console.log('playing');


  // // check if context is in suspended state (autoplay policy)
  // if (audioContext.state === 'suspended') {
  //     audioContext.resume();
  // }

  // // play or pause track depending on state
  // if (this.dataset.playing === 'false') {
  //     audioElement.play();
  //     this.dataset.playing = 'true';
  // } else if (this.dataset.playing === 'true') {
  //     audioElement.pause();
  //     this.dataset.playing = 'false';
  // }

}, false);

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');


const audioContext = new AudioContext();

// get the audio element
const audioElement = document.querySelector('audio');

audioElement.addEventListener('canplaythrough', () => {
  console.log('loaded');
})

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);

track.connect(audioContext.destination);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var analyser = audioContext.createAnalyser();
track.connect(analyser);
analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount; //1024
var dataArray = new Uint8Array(bufferLength);
  console.log(bufferLength)

  console.log(canvas.width)

var sliceWidth = canvas.width  * 1.0 / bufferLength * 2;

ctx.imageSmoothingEnabled = false;

let backgroundColor = 'black';


function wall() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

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
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
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



let hue = 0;
let saturation = 80;
let lightness = 50;

function draw(step) {
  ctx.save();
  ctx.translate(-0.5, -0.5);

  ctx.imageSmoothingEnabled = false;
  ctx.imageSmoothingQuality = "high";

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  //outline settings
  ctx.strokeStyle = 'cyan';
  ctx.lineWidth = 25 + (Math.sin(step * 0.001) + 1) * 250;

  hue += 0.5;
  saturation += 0.03;
  // lightness += 1;

  backgroundColor = `hsl(${hue}, ${50 + (15 * (Math.sin(saturation) + 1))}%, ${lightness % 100}%)`;
  wall();

  ctx.globalCompositeOperation = 'difference';

  // for (let i = 0; i < 6; i += 1) {
  //   ctx.beginPath();

  //   let x = Math.floor(canvas.width / 2);
  //   let y = Math.floor(canvas.height / 2);
  //   let radius = 200;
  //   let thickness = 50 + 20 * i;
  //   let rotation = step * ((1 + i) / 500) + i * (Math.PI * 2) / 6;

  //   makaron(x, y, radius, thickness, rotation * (i % 2 == 0 ? 1 : -1));
  // }
  for (var k = -1; k < 2; k++) {
    ctx.save();
    ctx.translate(k * (canvas.width * 0.4), 0);

    if (k == 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    switch (k) {
      case -1:
        ctx.strokeStyle = `hsl(0,100,100)`;//`hsl(${step / 100},100,100)`;
        break;
      case 0:
        ctx.strokeStyle = 'hsl(5,100,100)';
        break;
      case 1:
        ctx.strokeStyle = 'hsl(10,100,100)';
        break;
    }

    var num_shapes = 3;
    for (var i = 0; i < num_shapes; i++) {
      let radiusFraction = 0.25;

      ctx.save();
      var angle = (i / num_shapes) * (Math.PI * 2);
      var move_radius = Math.min(canvas.width, canvas.height) * radiusFraction;
      var move_x = Math.sin(angle + (step * 0.005)) * move_radius;
      var move_y = Math.cos(angle + (step * 0.005)) * move_radius;
      ctx.translate(move_x, move_y);
      // polygonWithOffset(i + 3, 50, 0);
      ctx.restore();
      ctx.save();
      angle = (i / num_shapes) * (Math.PI * 2);
      move_radius = Math.min(canvas.width, canvas.height) * radiusFraction;
      move_x = Math.sin(-angle + (step * -0.005)) * move_radius;
      move_y = Math.cos(-angle + (step * -0.005)) * move_radius;
      ctx.translate(move_x, move_y);
      polygonStar(i + 3, 50, 0);
      ctx.restore();
    }
    ctx.restore();
  }


  // polygonStar(6, 50, 0);
  polygon(30, canvas.height * 0.33);
  polygon(45, canvas.height * 0.66);
  polygon(60, canvas.height * 0.99);
  ctx.restore();

}



let step = 0;
function loop() {
  
  
  
  draw(step);
  step += 1;
  //sound stuffs
  var x = 0;
  analyser.getByteTimeDomainData(dataArray);
  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    var y = v * ctx.canvas.height / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
  window.requestAnimationFrame(loop);
}



loop();


window.addEventListener('resize', draw);
window.addEventListener('load', draw);


function spinningStars() {
  //Spinning stars
  polygonStar(6, 300, step * 0.00225);
  polygonStar(6, 250, step * 0.0025);
  polygonStar(6, 200, step * 0.00275);
  polygonStar(6, 150, step * 0.003);
  polygonStar(6, 100, step * 0.00325);
  polygonStar(6, 50, step * 0.0035);
}

function lerpColour(source, target) {
  // let r = s
}

function changeBackgroundColor() {
  let r = Math.random() * 255;
  let g = Math.random() * 255;
  let b = Math.random() * 255;

  backgroundColor = `rgb(${r}, ${g}, ${b})`;
}



ctx.canvas.addEventListener('click', () => {

  // backgroundColor = backgroundColor === 'black' ? 'yellow' : 'black';

  changeBackgroundColor();

});


