//vraibles created for different functions 
let order= [];  // holds sequence of button presses 
let playerOrder = []; // holds buttons pressed by the player
let noise=false; // var for music 
let flash; // var for highlighting 
let turn; // player turn 
let good; // coice is correct or not 
let compTurn; //boolean indication whos turn 
let intervalId; // used for intervals 
let win; // var to win
let replay=false; // var to replay the game 
let highScore=0; // var for highscore 
let time = 0; // var for time 


//linking the html to be ablle to work in my java
const redpod = document.querySelector('.red-pod');
const greenpod = document.querySelector('.green-pod');
const yellowpod = document.querySelector('.yellow-pod');
const bluepod = document.querySelector('.blue-pod');
const turnCounter = document.querySelector('.currentscore');
const highScoreDis = document.querySelector('.highscore');
const startButton = document.querySelector('.start');
const gameStatus = document.querySelector("#on-off"); 



//when the button is pressed call on the play function
startButton.addEventListener('click', (event) => {
  play();
});

//play functions sets values to variables and turns statues button green
function play() {
  win = false;
  order = [];
  playerOrder = [];
  flash = 0;
  intervalId = 0;
  turn = 1;
  turnCounter.innerHTML = 1; // sets the counter to 1
  good = true;
  timer(); // calls on the timer function
  gameStatus.style.backgroundColor = "lightgreen";
  highScoreDis.innerHTML = highScore;
  setTimeout(() => { //time for the patterns 
    for (var i = 0; i <10; i++) {
      order.push(Math.floor(Math.random() * 4) + 1); //loop for the sequence of patterns
    }
    compTurn = true;
  
    intervalId = setInterval(gameTurn, 1000)
  },3000);
}


// game turn function 
function gameTurn() {

  if (flash == turn) {
    clearInterval(intervalId);
    compTurn = false;
    clearColor();
    if(turn==5||turn==9||turn==13) // if turn is 5,9,13 increase the speed 
    {
      setTimeout(gameTurn,500);
    }
    else{
      setTimeout(gameTurn,1000); // if not return it to normal
    }
  }

  if (compTurn) { // clears the color of a huighlighted button
    clearColor();
    setTimeout(() => { //dellays the execution of following code to give time between the button pressed 
      if (order[flash] == 1) one();
      if (order[flash] == 2) two();
      if (order[flash] == 3) three();
      if (order[flash] == 4) four();
      flash++; // moves onto next button
    }, 500);
  }
}
// for these four functions the audio file is called and played and the buttons become highlighted 
function one() {
  if (noise) {
    let audio = document.getElementById("clip1");
    audio.play();
  }
  noise = true;
  greenpod.style.backgroundColor = "lightgreen";
  setTimeout(()=>{clearColor();}, 500); // after a certain amount of time the coulors are cleared using clear();
}

function two() {
  if (noise) {
    let audio = document.getElementById("clip2");
    audio.play();
  }
  noise = true;
  redpod.style.backgroundColor = "lightcoral";
  setTimeout(()=>{clearColor();}, 500);
}

function three() {
  if (noise) {
    let audio = document.getElementById("clip3");
    audio.play();
  }
  noise = true;
  yellowpod.style.backgroundColor = "lightyellow";
  setTimeout(()=>{clearColor();}, 500);
}

function four() {
  if (noise) {
    let audio = document.getElementById("clip4");
    audio.play();
  }
  noise = true;
  bluepod.style.backgroundColor = "lightskyblue";
  setTimeout(()=>{clearColor();}, 500);
}
//clearing the colours back to the orginal colours 
function clearColor() {
  greenpod.style.backgroundColor = "green";
  redpod.style.backgroundColor = "rgb(202, 0, 0)";
  yellowpod.style.backgroundColor = "rgb(205, 167, 0)";
  bluepod.style.backgroundColor = "rgb(6, 0, 190)";
}
//the colours that cause the buttons to become highlighted
function flashColor() {
  greenpod.style.backgroundColor = "lightgreen";
  redpod.style.backgroundColor = "rgb(191, 113, 113)";
  yellowpod.style.backgroundColor = "lightyellow";
  bluepod.style.backgroundColor = "lightblue";
}

greenpod.addEventListener('click', (event) => {
    playerOrder.push(1); // number is added to player order 
    check(); //called to veritfy players input
    one();
    if(!win) {  // if not won keep going give p[layer 500 millieseconds
      setTimeout(() => {
        clearColor();
      }, 500);
    }
})
// the same happenes for the next few sets of code 
redpod.addEventListener('click', (event) => {
    playerOrder.push(2);
    check();
    two();
    if(!win) {
      setTimeout(() => {
        clearColor();
      }, 500);
  }
})

yellowpod.addEventListener('click', (event) => {
 
    playerOrder.push(3);
    check();
    three();
    if(!win) {
      setTimeout(() => {
        clearColor();
      }, 500);
    }
})

bluepod.addEventListener('click', (event) => { 
    playerOrder.push(4);
    check();
    four();
    if(!win) {
      setTimeout(() => {
        clearColor();
      }, 500);
  }
})
//timer function after time becomes >5 the buttons flash and status button goes back to red 
//and also so does the current number 
function timer() {
  time = 0;
  intervalId=setInterval(() =>{
    time++; 
    if(time>5)
    {
      turn=1;
      clearInterval(intervalId);
      flashColor();
      gameStatus.style.backgroundColor="red";
    }
  },5000);
}
// fucntion to check if buttons pressed matches patterens 
function check() {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1])
    good = false; // code checks if player input matches most recent sequence if not good is false

    if(playerOrder.length>highScore) // ifthe player order is greater than the highscore the highscore will become this number
    {
      highScore = playerOrder.length;
      highScoreDis.innerHTML=highScore;
    }

  if (playerOrder.length == 20 && good) { // if the player order is greater than 20 the player wins
    winGame();
  }
  
  if (good == false) { //if input if incorrect good = false
    flashColor();
    turnCounter.innerHTML = "--"; // the current score resets 
    setTimeout(() => {
      turnCounter.innerHTML = 1; //after 1000 the currentscore changes back to 1
      clearColor(); // the colors are cleared 
     
      compTurn = true;
      flash = 0;
      turn=1;
      playerOrder = [];
      good = true;
      intervalId = setInterval(gameTurn, 1000);

    }, 1000);
    noise = false;
  }else{
  if (turn == playerOrder.length && good && !win) { // if input is right and game is not wone 
    turn++; // game keeps going
    playerOrder = [];
    compTurn = true;
    flash = 0;
    turnCounter.innerHTML = turn; // counter is set to turn value 
    intervalId = setInterval(gameTurn, 1000); 
  }
}

}
//fucntion if the game is one counter resets and buttons are flashed 
function winGame() {
  flashColor();
  turnCounter.innerHTML = "--";
  on = false;
  win = true;
}