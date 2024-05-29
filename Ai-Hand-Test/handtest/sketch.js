let handpose;
let detections = [];

let canvas;
const video = document.getElementById("video");
const game = document.getElementById("game");
const aim = document.getElementById("aim");

function setup(){
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
    video.play();
    });

  const options = {
    flipHorizontal: false, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  }

  handpose = ml5.handpose(video, options, modelReady);
}

function modelReady() {
  console.log("Model ready!");
  handpose.on('predict', results => {
    detections = results;
    console.log(detections.length)
    if(detections != 0){
        draw();
        checknear();
    }
  });
}

function draw(){
    console.log(detections[0].annotations.indexFinger);
    aim.style.right = detections[0].annotations.indexFinger[3][0]
    aim.style.top = detections[0].annotations.indexFinger[3][1]

}
function checknear() //check if the Z indexes are near eachother.
{
    let z1 = detections[0].annotations.indexFinger[0][2];
    let z2 = detections[0].annotations.indexFinger[1][2];
    let z3 = detections[0].annotations.indexFinger[2][2];
    let z4 = detections[0].annotations.indexFinger[3][2];
    if(z1 - z2 <= 1 & z1 - z3 <= 1 & z2 - z4 <= 1)
    {
        console.log("BANG!");
        game.classList.add("bang")
    } else {
        game.classList.remove("bang")

    }
}
setup();