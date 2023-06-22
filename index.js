// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);
let gameover = false;
let won = false;

let chessBoard = [
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
];

// Load images ================================================================
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/backgroundearth2.jpg";

// Side image
var sideReady = false;
var sideImage = new Image();
sideImage.onload = function () {
    sideReady = true;
};
sideImage.src = "images/BorderLeft.jpg";

// Top image
var topReady = false;
var topImage = new Image();
topImage.onload = function () {
    topReady = true;
};
topImage.src = "images/BorderTop.jpg"; 

// Hero (Astronaut) image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/Front.png";

// Monster (SpaceX) image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/SpaceX_S.png";

// Meteor image
var rockReady = false;
var rockImage = new Image();
rockImage.onload = function () {
    rockReady = true;
};
rockImage.src = "images/rock1.png"; 

// done with load images ========================================================

// Load sounds ==================================================================
var soundGameOver = "sounds/gameOver.wav"; // Game Over sound efx
var soundCaught = "sounds/caught.wav"; //Caught spaceX sound efx
var soundCollision = "sounds/collision.wav"; // Hit a rock sound efx
var soundGameWon = "sounds/won.wav"; // Won the game sound efx
var soundEfx = document.getElementById("soundEfx"); // Assign audio to soundEfx
// done with loading sounds =====================================================


// define objects and variables we need =========================================

// Game objects
var hero = {
    speed: 300, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
};

var monster = {
    x: 0,
    y: 0
};

var rock1 = { 
    x: 100, 
    y: 100 
};
var rock2 = { 
    x: 620, 
    y: 250 
};
var rock3 = { 
    x: 350, 
    y: 730 
};


var monstersCaught = 0;
let died = false;

// end define objects and variables we need =========================================

// keyboard control =================================================================
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// end keyboard control =============================================================

// define functions =================================================================

let placeItem = function(character){
    let X = 5;
    let Y = 6;
    let success = false;
    while(!success) {
        X = Math.floor(Math.random( ) * 9 ); // returns 0 thru 8
        Y = Math.floor(Math.random( ) * 9 ); // returns 0 thru 8

        if (chessBoard[X][Y] === 'x' && noCollisions(X, Y)) {
            success = true;
        }
    }
    chessBoard[X][Y] = 'O'; // mark that a square is taken
    character.x = (X*100) + 15; // allow for border
    character.y = (Y*100) + 16;
}
// Prevent overlapping of objects
let noCollisions = function(X, Y) {
    if (
        (X === Math.floor(rock1.x / 60) && Y === Math.floor(rock1.y / 60)) ||
        (X === Math.floor(rock2.x / 60) && Y === Math.floor(rock2.y / 60)) ||
        (X === Math.floor(rock3.x / 60) && Y === Math.floor(rock3.y / 60)) ||
        (X === Math.floor(monster.x / 160) && Y === Math.floor(monster.y / 160)) ||
        (X === Math.floor(hero.x / 32) && Y === Math.floor(hero.y / 50))
    ) {
        return false; // Collision detected
    }
    return true; // No collisions
}


// Setup timer
var timeLimit = 30; // Time limit in seconds
var timeLeft = timeLimit;


// Update game objects
var update = function (modifier) {

    //  adjust based on keys
    if (38 in keysDown && hero.y > 20 + 0) { // holding up key
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - (70 + 0)) { // holding down key
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > (20 + 0)) { // holding left key
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - (50 + 0)) { // holding right key
        hero.x += hero.speed * modifier;
    }

    // Decrement time left if the game is not won yet
    if (!won) {
        timeLeft -= modifier;

        // Check if time is up
        if (timeLeft <= 0) {
            soundEfx.src = soundGameOver;
            soundEfx.play();
            showTimeoutMessage();
            gameover = true;
        }
    }

    // Check collision with meteors
        if (
            hero.x <= (rock1.x + 60)
            && rock1.x <= (hero.x + 32) 
            && hero.y <= (rock1.y + 60) 
            && rock1.y <= (hero.y + 50)
        ) {
            soundEfx.src = soundCollision;
            soundEfx.play();
            setTimeout(function () {showLoosingMessage()}, 500); // Delay the alert message
            gameover = true;
        }

        if (
            hero.x <= (rock2.x + 60)
            && rock2.x <= (hero.x + 32) 
            && hero.y <= (rock2.y + 60) 
            && rock2.y <= (hero.y + 50)
        ) {
            soundEfx.src = soundCollision;
            soundEfx.play();
            setTimeout(function () {showLoosingMessage()}, 500); // Delay the alert message
            gameover = true;
        }

        if (
            hero.x <= (rock3.x + 60)
            && rock3.x <= (hero.x + 32) 
            && hero.y <= (rock3.y + 60) 
            && rock3.y <= (hero.y + 50)
        ) {
            soundEfx.src = soundCollision;
            soundEfx.play();
            setTimeout(function () {showLoosingMessage()}, 500); // Delay the alert message
            gameover = true;
        }

    // Check collision with monster (spaceship)
    if (
        hero.x <= (monster.x + 140) &&
        monster.x <= (hero.x + 32) &&
        hero.y <= (monster.y + 140) &&
        monster.y <= (hero.y + 50)
    ) {
        soundEfx.src = soundCaught;
        soundEfx.play();
        ++monstersCaught; // score
        if (monstersCaught == 5) {
            soundEfx.src = soundGameWon;
            soundEfx.play();
            setTimeout(function () {}, 500); // Delay the alert message
            gameover = true;
            won = true;
        }
        reset(); //start a new cycle
    }
};

// Draw everything in the main render function
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (sideReady) {
        ctx.drawImage(sideImage, 0, 0);
        ctx.drawImage(sideImage, 984, 0);
    }
    if (topReady) {
        ctx.drawImage(topImage, 0, 984);
        ctx.drawImage(topImage, 0, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }
    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }
    if (rockReady) {
        ctx.drawImage(rockImage, rock1.x, rock1.y);
        ctx.drawImage(rockImage, rock2.x, rock2.y);
        ctx.drawImage(rockImage, rock3.x, rock3.y);
    }
    // if (planetReady) {
    //     ctx.drawImage(planetImage, planet1.x, planet1.y);
    // }

    // Display remaining time
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("Time Left: " + Math.ceil(timeLeft), canvas.width - 32, 32);

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Space Shuttle loaded: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {

    if (gameover == false) {
        var now = Date.now();
        var delta = now - then;
        update(delta / 1000);
        render();
        then = now;
        // Request to do this again
        requestAnimationFrame(main);
    } else {
        if(won == true){
            showWinningMessage();
        } 
    }
};

// Function to display messages
var showWinningMessage = function () {
    alert ("Congratulations! You won the game!");
};

var showLoosingMessage = function () {
    alert ("Game Over, you crashed into a meteor!");
};

var showTimeoutMessage = function () {
    alert ("Game Over, Time Limit Exceeded!");
};

// Reset the game when the player catches a monster
var reset = function() {

    if (died == true) {
        soundEfx.src = soundGameOver;
        soundEfx.play();
        setTimeout(function () {
            showLoosingMessage();
        }, 500); // Delay the alert message
    }
    else {
        placeItem(hero);
        placeItem(monster);
        placeItem(rock1);
        placeItem(rock2);
        placeItem(rock3);
        // placeItem(planet1);

        if (monstersCaught === 5 && !won) {
            // change sound effect and play it 
            soundEfx.src = soundGameWon;
            soundEfx.play();
            setTimeout(function () {
                showWinningMessage();
            }, 500); // Delay the alert message
        }
    }
};


// var reset = function () {
//     hero.x = canvas.width / 2 - 16;
//     hero.y = canvas.height / 2 - 25;
//     // width: border 16 + border 16 + monster 160
//     // height: border 16 + border 16 + monster 160
//     monster.x = 16 + Math.random() * (canvas.width - 192);
//     monster.y = 16 + Math.random() * (canvas.height - 192);
// };

// end of define functions ==============================================

// Let's play this game!  ===============
var then = Date.now();
reset();
main();  // call the main game loop.
