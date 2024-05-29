let predictions = [];
const video = document.getElementById('video');

navigator.mediaDevices.getUserMedia({video: true}).then(strem => {
  video.srcObject = strem;
  video.play();
})
// Create a new handpose method
const handpose = ml5.handpose(video, modelLoaded);

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}

// Listen to new 'hand' events
handpose.on('hand', results => {
  predictions = results;
  console.log(results)





});

