'use strict';

//Global variables
let step = 0;
let isStarted = false;
let isPaused = false;

//CANVAS SETUP
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled = false;


//AUDIO SETUP
const audioContext = new AudioContext();

// get the audio element
const audioElement = document.querySelector('audio');

//loop the audio
audioElement.addEventListener('ended', (event) => {
  audioElement.play();
})

//play and pause audio 
document.addEventListener('click', event => {

    if (isStarted === true) {
      if (isPaused === false) {
        audioElement.pause();
        isPaused = true;
      } else {
        audioElement.play();
        isPaused = false;

      }
  }

});

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);

track.connect(audioContext.destination);


var analyser = audioContext.createAnalyser();
track.connect(analyser);
analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount; //1024
var dataArray = new Uint8Array(bufferLength);

var sliceWidth = canvas.width / bufferLength * 2;

var lastBeatTime = -1;
var lastOnsetTime = -2;

let startColor = getRandomColor();
let targetColor = getRandomColor();
let colorChangeSpeed = 60 * 5; //change target color every n frames /60fps(?)


// Window events
window.addEventListener('resize', draw);
window.addEventListener('load', draw);


//autoplay


loop();

canvas.addEventListener('click', function () {
  isStarted = true;
  audioElement.play();
  canvas.classList.remove('playBtn');


  // // check if context is in suspended state (autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // // play or pause track depending on state
  // if (this.dataset.playing === 'false') {
  //     audioElement.play();
  //     this.dataset.playing = 'true';
  // } else if (this.dataset.playing === 'true') {
  //     audioElement.pause();
  //     this.dataset.playing = 'false';
  // }

}, false);











function draw() {
  ctx.save();

  ctx.translate(-0.5, -0.5);
  ctx.imageSmoothingEnabled = false;
  ctx.imageSmoothingQuality = "high";

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  //outline settings
  ctx.strokeStyle = 'magenta';
  ctx.lineWidth = 25 + (Math.sin(step * 0.001) + 1) * 250;


  var currentTime = audioElement.currentTime;
  // var currentTime = audioContext.getOutputTimestamp().contextTime;

  // check if onset detected
  var isOnsetDetected = false;
  if (onsets[0] < currentTime) {
    isOnsetDetected = true;
    lastOnsetTime = onsets.shift(); // remove onset from array
  }
  // move step on onset detection
  var beatReactionProbability = 1.0;
  if ((isOnsetDetected && Math.floor(Math.random() * (1 / beatReactionProbability)) % (1 / beatReactionProbability) == 0)) {
    step += 5;// * (Math.random() < 0.5 ? -1 : 1);
  }

  // check if beat detected
  var isBeatDetected = false;
  if (beats[0] < currentTime) {
    isBeatDetected = true;
    lastBeatTime = beats.shift(); // remove beat from array
    

    startColor = targetColor;
    targetColor = getRandomColor();
  }
/*
  // if beat AND onset
  var loudBeatThreshold = 0.0125; // time
  if (Math.abs(lastBeatTime - lastOnsetTime) < loudBeatThreshold) {
    lastBeatTime = -1;
    lastOnsetTime = -2;
    startColor = targetColor;
    targetColor = getRandomColor();
  }
*/

  // if (step % colorChangeSpeed === 0) {
  //   startColor = targetColor;
  //   targetColor = getRandomColor();
  // }

  // backgroundColor = `hsl(${hue}, ${50 + (15 * (Math.sin(saturation) + 1))}%, ${lightness % 100}%)`;
  // background(backgroundColor);

  let lerpedColor = lerpColor(startColor, targetColor, (step % colorChangeSpeed) / colorChangeSpeed);

  let bgColor = CSSColor(lerpedColor);
  background(bgColor);



  ctx.globalCompositeOperation = 'difference';


  //
  for (var k = -1; k < 2; k++) {
    // make 3 circles of shapes
    ctx.save();
    ctx.translate(k * (canvas.width * 0.4), 0);

    if (k == 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    switch (k) {
      case -1:
        //l set to 100 is always white

        ctx.strokeStyle = `hsl(0,100,50)`;//`hsl(${step / 100},100,100)`;
        break;
      case 0:
        ctx.strokeStyle = 'hsl(5,100,50)';
        break;
      case 1:
        ctx.strokeStyle = 'hsl(10,100,50)';
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


function loop() {

  //check if sound is playing
  //then draw line

  draw(step);
  step += 1;

  //Get data from analyser
  analyser.getByteTimeDomainData(dataArray);

  var x = 0;

  //circles
  for (let i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    v = Math.pow(v, 16);
    // v /= 2;
    // v /= 5;

    var y = v * ctx.canvas.height / 2;
    x = sliceWidth * i;
    // if (i % 50 === 0) {
      circle(x, y, 10 + v * 50 * v);
    // }

  }


  x = 0;
  //sound stuffs
  ctx.save();
  // ctx.beginPath??>?
  /*
  ctx.beginPath();
  x = 0;
  ctx.moveTo(0, canvas.height / 2);

  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0;
    // console.log(v);
    var y = v * ctx.canvas.height / 2;

    // if (i === 0) {
    //   ctx.moveTo(x, y);
    // } else {
    ctx.lineTo(x, y);
    // }



    x += sliceWidth;
  }
  
  ctx.lineTo(canvas.width, canvas.height / 2);
  */
  ctx.fillStyle = CSSColor(targetColor);
  ctx.strokeStyle = 'white';
  // ctx.lineWidth = 5;
  ctx.stroke();
  ctx.restore();

  if (isStarted === false) {
    canvas.classList.add('playBtn');
    playBtn();
  }

  // if (audioContext) {
  //   var audioTimestamp = audioContext.getOutputTimestamp();
  //   console.log(`contextTime: ${audioTimestamp.contextTime}`);
  //   console.log(`performanceTime: ${audioTimestamp.performanceTime}`);
  // }

  window.requestAnimationFrame(loop);
}
