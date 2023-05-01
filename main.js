const background = document.querySelector('.background');
let bgPos = 0;
let lastPipeTime = 0;
const pipes = [];
let flappyHeight = 0;
let score = 0;
let gameEnded = false;

const highScore = localStorage.getItem('highScore');
const hScore = document.querySelector(".highScore");
if(highScore != null ){
hScore.textContent = "Highscore: "+ highScore;}
else{
  hScore.textContent = "Highscore: 0";

}

createPipe();

function animate(currentTime) {
  const delta = currentTime - lastPipeTime;
  moveBackground();
  flappyGravity(flappyHeight);
  movePipes(delta);
  const anim =  requestAnimationFrame(animate);
  checkCollision(anim);
  hasGameEnded();
}

function moveBackground() {
  bgPos -= 2;
  background.style.backgroundPosition = `${bgPos}px 0`;
}

function createPipe() {
  const body = document.querySelector("body");

  const pipeTop = document.createElement("img");
  pipeTop.className = "pipes";
  pipeTop.src = "./img/flappy_pipe_top.png";
  pipeTop.alt = "pipeTop";
  pipeTop.id = `pipe-${pipes.length}`;
  pipes.push(pipeTop);
  let randomTop = Math.round(Math.random() * 250 + 50);
  pipeTop.style.right = -300 + "px";
  pipeTop.style.top = -randomTop + "px";

  const pipeBottom = document.createElement("img");
  pipeBottom.className = "pipes";
  pipeBottom.src = "./img/flappy_pipe_bottom.png";
  pipeBottom.alt = "pipeBottom";
  pipeBottom.id = `pipe-${pipes.length}`;
  pipes.push(pipeBottom);
  let randomBottom = Math.round(Math.random() * 250 + 50); ///fix this
  pipeBottom.style.right = -300 + "px";
  pipeBottom.style.bottom = -randomBottom + "px";

  body.appendChild(pipeTop);
  body.appendChild(pipeBottom);

  lastPipeTime = performance.now();

}

function movePipes(delta) {
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    let currentPos = pipe.style.right;
    let positionNumber = Number(currentPos.match(/-?\d+/g));
    positionNumber += 3;
    pipe.style.right = positionNumber + "px";
    if(positionNumber > 2000){ //remove pipe
      pipe.remove();
    }
  }
  if (delta > 2000) {
    createPipe();
  }
}



function checkCollision(anim){
    const flappy = document.querySelector(".flappy");
    let flappyCoords = flappy.getBoundingClientRect();
    let flappyTop = Math.round( flappyCoords.top +10);
    let flappyBottom = Math.round(flappyCoords.bottom -20);
    let flappyLeft = Math.round(flappyCoords.left + 10);
    let flappyRight = Math.round(flappyCoords.right - 20);
    if(flappyTop <= 0 || flappyBottom > window.innerHeight){
      cancelAnimationFrame(anim);
      gameEnded = true;
    } 

    score = 0;
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        let pipeCoords =pipe.getBoundingClientRect(); 
        let pipeBottom = Math.round(pipeCoords.bottom);
        let pipeTop = Math.round(pipeCoords.top);
        let pipeLeft = Math.round(pipeCoords.left);
        let pipeRight = Math.round(pipeCoords.right);

        if(flappyRight > pipeLeft && flappyLeft < pipeRight){
            if(i % 2 == 0  && flappyTop < pipeBottom ){
                cancelAnimationFrame(anim);
                gameEnded = true;

            }else if (i % 2 == 1 && (flappyBottom > pipeTop || flappyBottom >= pipeBottom)){
                cancelAnimationFrame(anim);
                gameEnded = true;
            }
        }
        if(flappyLeft > pipeRight){
          score++;
        }  
    }
    const scoreHelem = document.querySelector(".score");
    score = score / 2; //because double pipes
    scoreHelem.textContent = "Score: " + score;
    //return score here
}
function flappyGravity(height){
  const root = document.querySelector(":root");
  flappyHeight += 1.5;
  addEventListener("click",flappyJump);
  // addEventListener("touchstart",flappyJump);
  root.style.setProperty("--height-from-js", `${height}px`);
}
function flappyJump(){
  flappyHeight -= 80;
}
function hasGameEnded(){
  if(gameEnded){
    const endDiv =  document.querySelector(".endGameScreen");
    const endScore = document.querySelector(".endGameScreen > h2");
    
    endScore.textContent = "Your Score : " + score;
    endDiv.style.display = "grid";
  }
};

function restart(){
  if(score > highScore){
  localStorage.setItem('highScore',score);}
  location.reload();

}

requestAnimationFrame(animate);

//////////////////////////////////////////////////
const pre = document.querySelector(".endGameScreen");

document.addEventListener("mousemove", (e) => {
  rotateElement(e, pre);
});

function rotateElement(event, element) {
  const x = event.clientX;
  const y = event.clientY;

  const middleX = window.innerWidth / 2;
  const middleY = window.innerHeight / 2;

  const offsetX = ((x - middleX) / middleX) * 45;
  const offsetY = ((y - middleY) / middleY) * 45;

  element.style.setProperty("--rotateX", offsetX + "deg");
  element.style.setProperty("--rotateY", -1 * offsetY + "deg");
}




