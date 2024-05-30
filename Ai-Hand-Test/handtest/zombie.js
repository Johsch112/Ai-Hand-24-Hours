
document.addEventListener('DOMContentLoaded', (event) => {
    let handpose;
    let detections = [];
    const video = document.getElementById("video"); //get vars
    const game = document.getElementById("game");
    const aim = document.getElementById("aim");
    const enemy = document.getElementsByClassName("enemy");
    const gunshot = new Audio('audio/Gunshot.mp3')
  
    function setup() {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            video.srcObject = stream;
            video.play();
            console.log(video.clientWidth)
            console.log(video.clientHeight)
        });
  
        const options = {
            flipHorizontal: false,
            maxContinuousChecks: Infinity,
            detectionConfidence: 0.8,
            scoreThreshold: 0.75,
            iouThreshold: 0.3,
        };
  
        handpose = ml5.handpose(video, options, modelReady);
    }
  
    function modelReady() {
        console.log("Model ready!");
        handpose.on('predict', results => {
            detections = results;
            if (detections.length > 0) {
                //console.log("Detections: ", detections);
                draw();
                checknear();
            }
        });
    }
  
    function draw() {
        const indexFingerTip = detections[0].annotations.indexFinger[3];
        //console.log("Index Finger Tip: ", indexFingerTip);
        aim.style.left = `${(indexFingerTip[0]/640)*100}%`;
        aim.style.top = `${(indexFingerTip[1]/480)*100}%`;
    }
  
    function checkhit() {
        const indexFingerTip = detections[0].annotations.indexFinger[3];
        const tolerance = 20; // Tolerance in pixels
  
        const aimLeft = indexFingerTip[0];
      //  aimLeft = `${(indexFingerTip[0]/640)*100}%`;
        const aimTop = indexFingerTip[1];
       // aimTop = `${(indexFingerTip[1]/480)*100}%`;
        for(let i = 0; i <enemy.length; i++)
            {
                const enemyCord = enemy[i].getBoundingClientRect();
  
                const enemyLeft = enemyCord.left;
                const enemyTop = enemyCord.top;
                const enemyRight = enemyCord.right;
                const enemyBottom = enemyCord.bottom;
                if (aimLeft >= enemyLeft - tolerance && aimLeft <= enemyRight + tolerance &&
                    aimTop >= enemyTop - tolerance && aimTop <= enemyBottom + tolerance) {
                    //console.log("dead");
                    enemy[i].classList.add("hit");
                }
            }
    }
  
    function checknear() {
      let fingerx = detections[0].annotations.indexFinger[0][0];
      let thumbx = detections[0].annotations.thumb[0][0];
        console.log("t" + thumbx);
        console.log("f" + fingerx);
        if (fingerx - thumbx >= 15 ) {
            game.classList.add("bang");
            gunshot.play();
            checkhit();
        } else {
            game.classList.remove("bang");
        }
    }
  
    setup();
  });
  


setInterval(myTimer, 1000);
//const game = document.getElementById("game");
const vh = window.innerHeight - 100;

var i = 0;
var points = 0;
var secondsCounter = 0;
function myTimer() {
    
    function getRandomInt(max){
        return Math.floor(Math.random() * max)
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    console.log(getRandomInt(2)); 
    const randomValue = getRandomInt(2);
    if (randomValue === 1 || secondsCounter >= 2) {
        const newZombie = document.createElement("enemy");
        newZombie.classList.add("zombie");
        newZombie.classList.add("enemy");
        newZombie.classList.add("ani"+getRandomInt(5));
        newZombie.style.top = Math.floor(Math.random() * vh) + 'px';
        newZombie.style.backgroundColor = getRandomColor(); 
        game.append(newZombie);
        secondsCounter = 0; 

        setTimeout(() => {
            newZombie.remove();
        }, 5000);

    } else {
        secondsCounter++; 
    }
    
}





// const zombie = document.getElementById('zombie');

// function zombiewalk() {
//     const zombianimation = Math.random() * 10; // Generate a random number between 0 and 10
//     if (zombianimation > 5) {
//         zombie.style.setProperty('animation-name', 'zombie-movement');
//     }
//     else{
//         zombie.style.setProperty('animation-name', 'zombie-movement2');
//     }

// }

// // Call zombiewalk every 1000 milliseconds (1 second)
// setInterval(zombiewalk, 1000);