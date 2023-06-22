let alienArray = [];
let gameState = false;
const alienElementOne =  document.querySelector("#alienElementOne");
const alienElementTwo = document.querySelector("#alienElementTwo");
const alienElementThree = document.querySelector("#alienElementThree");
const alienElementFour = document.querySelector("#alienElementFour");
const alienElementFive = document.querySelector("#alienElementFive");
const alienElementSix = document.querySelector("#alienElementSix");
const playerElement = document.querySelector("#playerElement");
const playerTarget = document.querySelector("#playerTarget");
const playerHealth = document.querySelector("#playerHealth");
const enemyHealthDisplay = document.querySelector("#enemyHealthDisplay");
const resetButton = document.querySelector("#resetButton");
const attackButton = document.querySelector("#attackButton");
const statusMessage = document.querySelector("#statusMessage");
const retreatButton = document.querySelector("#retreatButton");

class Ship{
    constructor(){
        this.hull,
        this.firePower,
        this.accuracy;
    }
    checkAccuracy(){
        if (Math.random() < this.accuracy) {
            return true;
        }else{
            return false;
        }
    }
}

class PlayerShip extends Ship{
    constructor(){
        super();
        this.hull = 20,
        this.firePower = 5,
        this.accuracy = .7;
        this.alienCounter = 0;
    }
    attack(){
        if(!this.hull <= 0){
            if(this.checkAccuracy()){
                if(alienArray[this.alienCounter].hull > 0){
                    alienArray[this.alienCounter].hull -= this.firePower;
                    statusMessageUpdate("HIT!");
                    this.checkAlienHealth();
            }
        }else{
            statusMessageUpdate("MISS!");
        }
        }
    }
    getHull(){
        return this.hull;
    }
    getAlienCounter(){
        return this.alienCounter;
    }
    addAlienCounter(){
        this.alienCounter++;
    }
    checkAlienHealth(){
        if(alienArray[this.alienCounter].hull <= 0){
            switch(this.alienCounter){
                case 0: 
                    alienExplode(alienElementOne);
                    retreatButtonOn();
                    break;
                case 1:
                    alienExplode(alienElementTwo);
                    retreatButtonOn();
                    break;
                case 2:
                    alienExplode(alienElementThree);
                    retreatButtonOn();
                    break;
                case 3:
                    alienExplode(alienElementFour);
                    retreatButtonOn();
                    break;
                case 4: 
                    alienExplode(alienElementFive);
                    retreatButtonOn();
                    break;
                case 5:
                    alienExplode(alienElementSix);
                    break;
            }
    }
    }
}

let player = new PlayerShip;

class AlienShip extends Ship{
    constructor(){
        super();
        this.hull = Math.floor(Math.random() * (6 - 3 + 1) + 3),
        this.maxHull = this.hull;
        this.firePower = Math.floor(Math.random() * (4 - 2 + 1) + 2),
        this.accuracy = Math.floor(Math.random() *(8 - 6 + 1) +6) / 10;
    }
    attack(){
        if(this.checkAccuracy()){
            if(player.getHull() > 0){
                setTimeout(statusMessageUpdateEnemyHit, 800);
                player.hull -= this.firePower;
                setTimeout(this.checkPlayerHealth, 800);
            }
        }else{
            setTimeout(statusMessageUpdateEnemyMiss, 800);
        }
    }   
    getHull(){
        return this.hull;
    }
    getMaxHull(){
        return this.maxHull;
    }
    checkPlayerHealth(){
        if(player.hull <= 0){
            resetOn();
            attackOff();
            playerExplode();
            statusMessageUpdateEnemy("YOU LOSE!", 100);
        }
    }
}

function createAlienArray(arr){
    for(let i = 0; i < 6; i++){
        arr.push(new AlienShip);
    }
}

function waitOneSecond(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function promptUserStartGame(){
    await waitOneSecond(1000);
    while(gameState == false){
        let gameStartPrompt = window.prompt("Please enter 'Start' to begin game.").toLowerCase();
        console.log(gameStartPrompt);
        if(gameStartPrompt === 'start'){
            console.log(gameStartPrompt);
            gameState = true;
            break;
        }else if(!gameStartPrompt === 'start'){
            let gameStartPrompt = window.prompt("Please enter 'Start' to begin game");
        }
    }
}

function startGame(){
    createAlienArray(alienArray);
    promptUserStartGame();
    updateUI();
    resetOff();
    retreatButtonOff();
    attackOn();
}

function updateUI(){
    playerHealth.innerHTML = player.getHull() + "/20";
    playerTarget.innerHTML = player.getAlienCounter() + 1 +"/6";
    if(player.getAlienCounter() === 6) {
        resetOn();
        attackOff();
        playerTarget.innerHTML = player.getAlienCounter() +"/6";
        enemyHealthDisplay.innerHTML = 0 + "/" + alienArray[player.getAlienCounter() - 1].getMaxHull();
        statusMessageUpdate("YOU WIN!", 100);
        return;
    }else{
        enemyHealthDisplay.innerHTML = alienArray[player.getAlienCounter()].getHull() + "/" + alienArray[player.getAlienCounter()].getMaxHull();
    }
}

function resetOn(){
    resetButton.disabled = false;
}

function resetOff(){
    resetButton.disabled = true;
}

function attackOff(){
    attackButton.disabled = true;
}

function attackOn(){
    attackButton.disabled = false;
}

function retreatButtonOn(){
    retreatButton.disabled = false;
}

function retreatButtonOff(){
    retreatButton.disabled = true;
}

function retreatButtonClicked(){
    statusMessageUpdateEnemy("YOU LOSE!", 100);
    playerExplode();
    retreatButtonOff();
    attackOff();
    resetOn();
}

function attackOnClick(){
    retreatButtonOff();
    player.attack();
    updateUI();
    if(alienArray[player.getAlienCounter()].getHull() > 0){
        alienArray[player.getAlienCounter()].attack();
    }else{
        player.addAlienCounter();
    }
    updateUI();
}

function fadeOutAnimation(el, int){
    let opacity = 1;
    let fadeOut = setInterval(() => {
        el.style.opacity = opacity;
        opacity -= 0.01;
        if(opacity  <= 0){
            clearInterval(fadeOut);
        }
     }, int);
}

function alienExplode(alien){
    alien.style.backgroundImage = "url('/images/BattleCruiser.gif')";
    fadeOutAnimation(alien, 24);
}

function playerExplode(){
    playerElement.style.backgroundImage = "url('/images/Main-Ship-Damaged.gif')";
    fadeOutAnimation(playerElement, 24);
}

function statusMessageUpdate(str, int){
    statusMessage.style.color = "white";
    statusMessage.style.opacity = 1;
    statusMessage.innerHTML = str;
    fadeOutAnimation(statusMessage, int);
}

function statusMessageUpdateEnemy(str, int){
    statusMessage.style.color = "red";
    statusMessage.style.opacity = 1;
    statusMessage.innerHTML = str;
    fadeOutAnimation(statusMessage, int);
}

function statusMessageUpdateEnemyHit(){
    statusMessage.style.color = "red";
    statusMessage.style.opacity = 1;
    statusMessage.innerHTML = "HIT!";
    let opacity = 1;
    let fadeOut = setInterval(() => {
        statusMessage.style.opacity = opacity;
        opacity -= 0.01;
        if(opacity  <= 0){
            clearInterval(fadeOut);
        }
     }, 0);
}

function statusMessageUpdateEnemyMiss(){
    statusMessage.style.color = "red";
    statusMessage.style.opacity = 1;
    statusMessage.innerHTML = "MISS!";
    let opacity = 1;
    let fadeOut = setInterval(() => {
        statusMessage.style.opacity = opacity;
        opacity -= 0.01;
        if(opacity  <= 0){
            clearInterval(fadeOut);
        }
     }, 0);
}

startGame();