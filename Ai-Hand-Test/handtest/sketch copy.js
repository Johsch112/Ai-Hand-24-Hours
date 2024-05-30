let handpose;
let detections = [];

let canvas;
let video;

function setup(){
  canvas = createCanvas(640, 480, WEBGL); // 3D mode!!!
  canvas.id("canvas");

  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);

  const options = {
    flipHorizontal: false, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  }

  handpose = ml5.handpose(video, options, modelReady);
  colorMode(HSB);
} 

function modelReady() {
  console.log("Model ready!");
  handpose.on('predict', results => {
    detections = results;
    console.log(detections);
  });
}

function draw(){
  clear();
  // In webgl mode, origin of the coordinate is set to the centre.
  // So I re-positioned it to top-left.
  translate(-width / 2, -height / 2);

  if(detections.length > 0){
    console.log(detections[5].landmarks[9])
    drawLandmarks([5, 9], 120); // index finger
  }
}

function drawLandmarks(indexArray, hue){
  noFill();
  strokeWeight(10);
  for(let i = 0; i < detections.length; i++){
    for(let j = indexArray[0]; j < indexArray[1]; j++){
      let x = detections[i].landmarks[j][0];
      let y = detections[i].landmarks[j][1];
      let z = detections[i].landmarks[j][2];
      stroke(hue, 40, 255);
      point(width - x, y); // Mirroring the x-coordinate
    }
  }
}

function drawLines(index){
  stroke(0, 0, 255);
  strokeWeight(3);
  for(let i = 0; i < detections.length; i++){
    for(let j = 0; j < index.length - 1; j++){
      let x = detections[i].landmarks[index[j]][0];
      let y = detections[i].landmarks[index[j]][1];
      let z = detections[i].landmarks[index[j]][2];

      let _x = detections[i].landmarks[index[j + 1]][0];
      let _y = detections[i].landmarks[index[j + 1]][1];
      let _z = detections[i].landmarks[index[j + 1]][2];

      line(width - x, y, z, width - _x, _y, _z); // Mirroring the x-coordinates
    }
  }
}
