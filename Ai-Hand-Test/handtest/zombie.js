document.addEventListener('DOMContentLoaded', (event) => {
    let handpose;
    let detections = [];
    const video = document.getElementById("video");
    const game = document.getElementById("game");
    const aim = document.getElementById("aim");
    const gunshot = new Audio('audio/Gunshot.mp3');
    const casinojingel = new Audio('audio/casino-jingel.mp3');
    const jackpot = new Audio('audio/casinoljud.mp3');

    let points = 0;
    let checkpointreached = false;

    function setup() {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            video.srcObject = stream;
            video.play();
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
                draw();
                checknear();
            }
        });
    }

    function draw() {
        const indexFingerTip = detections[0].annotations.indexFinger[3];
        const videoRect = video.getBoundingClientRect();
        const scaleX = videoRect.width / video.videoWidth;
        const scaleY = videoRect.height / video.videoHeight;
        const aimX = indexFingerTip[0] * scaleX + videoRect.left;
        const aimY = indexFingerTip[1] * scaleY + videoRect.top;

        aim.style.right = `${aimX}px`;
        aim.style.top = `${aimY}px`;
    }

    function checkhit() {
        const aimRect = aim.getBoundingClientRect();
        const aimCenterX = aimRect.left + aimRect.width / 2;
        const aimCenterY = aimRect.top + aimRect.height / 2;
        const tolerance = 20;

        const enemies = document.getElementsByClassName("enemy");
        for (let i = 0; i < enemies.length; i++) {
            const enemyRect = enemies[i].getBoundingClientRect();

            if (aimCenterX >= enemyRect.left - tolerance && aimCenterX <= enemyRect.right + tolerance &&
                aimCenterY >= enemyRect.top - tolerance && aimCenterY <= enemyRect.bottom + tolerance) {
                enemies[i].classList.add("hit");
                console.log("Enemy hit!");
                points = points + 1;
                document.getElementById("points").innerHTML = points;
            }
        }

        if (points > 200 && !checkpointreached) {
            var zombie2Element = document.getElementById("zombie2");
            if (zombie2Element) {
                zombie2Element.style.display = "flex";
                zombie2Element.style.justifyContent = "center";
                zombie2Element.style.flexDirection = "row";
            }
            casinojingel.play();
            jackpot.play();
            checkpointreached = true;
        }
    }



    function checknear() {
        const fingerX = detections[0].annotations.indexFinger[3][0];
        const thumbX = detections[0].annotations.thumb[3][0];

        if (Math.abs(fingerX - thumbX) <= 15) {
            game.classList.add("bang");
            gunshot.play();
            checkhit();
        } else {
            game.classList.remove("bang");
        }
    }

    setup();

    setInterval(myTimer, 1000);
    const vh = window.innerHeight - 100;
    var secondsCounter = 0;

    function myTimer() {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        function getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const randomValue = getRandomInt(2);
        if (randomValue === 1 || secondsCounter >= 2) {
            const newZombie = document.createElement("div");
            newZombie.classList.add("zombie", "enemy", "ani" + getRandomInt(5));
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


});