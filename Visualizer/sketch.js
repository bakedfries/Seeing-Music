let song;
let playing = false;
let fr = 60;
let fft;
let layer;

function preload() {
  song = loadSound("track17.mp3");
  playing = false;
  song.onended(() => {
    playing = false;
    document.getElementById("audio").innerText = "Play";
  });
}

function setup() {
  createCanvas(500, 500);
  layer = createGraphics(width, height);
  
  background('black');
  
  fft = new p5.FFT(0, 256);
  
  frameRate(fr);
}

function draw() {
  background(255, 255, 0) //change the background color here
  
  layer.noFill();
  layer.colorMode(RGB);
  
  var spectrumA = fft.analyze();
  var spectrumB = spectrumA.reverse();
  spectrumB.splice(0, 40);
  
  push();
  translate(250, 250);
  noFill();
  stroke('rgba(0,0,0,0)');
  
  beginShape();
  for(let i = 0; i < spectrumB.length; i++) {
    var amp = spectrumB[i];
    var x = map(amp, 0, 256, -2, 2);
    var y = map(i, 0, spectrumB.length, 30, 215);
    vertex(x, y);
  }
  endShape();
  pop();
  
  push();
  translate(width / 2, height / 2);
  
  // Calculate the rotation angle based on the progress of the song
  let progress = song.currentTime() / song.duration();
  let rotationAngle = map(progress, 0, 1, 0, 360);
  rotate(radians(rotationAngle));
  
  layer.push();
  layer.translate(width / 2, height / 2);
  layer.rotate(radians(-rotationAngle));
  
  for(let i = 0; i < spectrumB.length; i++) {
    layer.strokeWeight(0.011 * spectrumB[i]);
    layer.stroke(183, 90, 127, spectrumB[i]/5 ); //change the first 3 rgb values here
    layer.line(0, i, 0, i);
  }
  
  layer.pop();
  image(layer, -width / 2, -height / 2);
  pop();
  

}

function toggleAudio() {
  if (!playing) {
    song.play();
    console.log("playing");
    document.getElementById("audio").innerText = "Pause";
  } else {
    song.pause();
    console.log("paused");
    document.getElementById("audio").innerText = "Play";
  }
  
  playing = !playing;
}
