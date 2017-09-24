// *** This file will handle the game flow and user interactions ***

const TANK_SPEED_X = 8
const TANK_SPEED_Y = 4

const BULLET_SPEED_X = 25
const BULLET_SPEED_Y = 0
const LANDSCAPE_SPEED = 4
const MONSTER_SPEED = 3.5

const BOARD_WIDTH = 1100
const BOARD_HEIGHT = 700

const DEFAULT_POSITION_P1 = { x: 400, y: 300 } // Default starting positions
const DEFAULT_POSITION_P2 = { x: 400, y: 800 }

$(document).ready( function () {
    $('#startScreen').hide()
    $('#board').hide()

    $('#singlePlayer').click( () => {
      $('#landing').remove()
      $('#startScreen').show()
      $('#board').show()

      // onePlayerMode()
    })
    
    $('#twoPlayers').click( () => {
      $('#landing').remove()
      $('#startScreen').show()
      $('#board').show()
      
      twoPlayerMode()
    })
})

// ========================
//    Collision function
// ========================
function collisionDetector (A, B) {
  // this function will detect a collision between two items, A and B.
  // Expected arguments are objects like the following:
  // A = {x, y, width, height}
  // It is assumed that the (x, y) coords represent the top left point of an item, respectively (CSS positioning).
  var x_axis_overlap = false
  var y_axis_overlap = false

  if (B.y > A.y && B.y < (A.y + A.width)) { y_axis_overlap = true }
  if ((B.y + B.width) > A.y && (B.y + B.width) < (A.y + A.width)) { y_axis_overlap = true }
  if (B.y < A.y && (B.y + B.width) > (A.y + A.width))  y_axis_overlap = true

  if (B.x > A.x && B.x < (A.x + A.height)) { x_axis_overlap = true }
  if ((B.x + B.height) > A.x && (B.x + B.height) < (A.x + A.height)) { x_axis_overlap = true }
  if (B.x < A.x && (B.x + B.height) > (A.x + A.wheight))  { x_axis_overlap = true }

  return x_axis_overlap && y_axis_overlap
  }

  // ================================
  //    Monster - Player collision
  // ================================
  function monsterPlayerCollision (player, monstersArray) {

    for (var i = 0; i < monstersArray.length; i++) {
      var player_obj = {
        x: player.position.x,
        y: player.position.y,
        player_id: player.player_id,
        width: 50,
        height: 50
      }

      var currentMonster = monstersArray[i]
      var monster = {
        x: currentMonster.x,
        y: currentMonster.y,
        selector: currentMonster.selector,
        width: 40,
        height: 40
      }

      if (collisionDetector(player_obj, monster)) {
        currentMonster.x = 2000 // Hack to put the monster out of screen and remove it from the monsters array
        monster.selector.remove()
        return true
      }
  }
}

function endGame (player1, player2) {
  $('#board').remove()
  $('#P1announcement').remove()
  $('#P2announcement').remove()
  $('#testy').remove()
  $('#board').css('background, black')
  $('#finishHim').css('display', 'block')

  if (player1.lives < 1) {
    var y = 480
    var num = '2'
    $('#finishHim').append(`
      <div>
        <iframe id="ytplayer" type="text/html" width="720" height="405"
        src="https://www.youtube.com/embed/_hHDxlm66dE?autoplay=1"
        frameborder="0" allowfullscreen></iframe>
        <img id='looser' src='src/lost1.png'>
        <img id='winner' src='src/tongueOut.png'>
        <img id='rocket' src='src/rocket.svg'>
      </div>
      `)
    $('#looser').css('transform', 'translate(700px, 30px)')
    $('#winner').css('transform', 'translate(700px, 500px)')
    $('#rocket').css(`transform', 'translate(700px, ${y}px)`)

    requestAnimationFrame(rocketKill)
    function  rocketKill () {
        y -= 4
        $('#rocket').css('transform', `translate(702px, ${y}px)`)
        if (y > 30) {
          requestAnimationFrame(rocketKill)
        }
        else {
          $('#finishHim').remove()
          $('body').css('background', 'linear-gradient(to bottom, rgba(76,76,76,1) 0%,rgba(89,89,89,1) 12%,rgba(102,102,102,1) 21%,rgb(111, 106, 106) 39%,rgb(113, 109, 109) 50%,rgb(105, 103, 103) 76%,rgb(80, 77, 77) 91%,rgb(76, 74, 74) 99%,rgb(76, 76, 76) 100%)')
          $('#endScreen').append(`
            <img src="src/player${num}wins.jpg">
            `)
        }
    }
    return undefined
  }
  if (player2.lives < 1) {
    var y = 480
    var num = '1'
    $('#finishHim').append(`
      <div>
        <iframe id="ytplayer" type="text/html" width="720" height="405"
  src="https://www.youtube.com/embed/_hHDxlm66dE?autoplay=1"
  frameborder="0" allowfullscreen></iframe>
        <img id='looser' src='src/lost1.png'>
        <img id='winner' src='src/Hugging_Face.png'>
        <img id='rocket' src='src/rocket.svg'>
      </div>
      `)
    $('#looser').css('transform', 'translate(700px, 30px)')
    $('#winner').css('transform', 'translate(700px, 500px)')
    $('#rocket').css(`transform', 'translate(700px, ${y}px)`)

    requestAnimationFrame(rocketKill)
    function  rocketKill () {
        y -= 4
        $('#rocket').css('transform', `translate(702px, ${y}px)`)
        if (y > 30) {
          requestAnimationFrame(rocketKill)
        }
        else {
          $('#finishHim').remove()
          $('body').css('background', 'linear-gradient(to bottom, rgba(76,76,76,1) 0%,rgba(89,89,89,1) 12%,rgba(102,102,102,1) 21%,rgb(111, 106, 106) 39%,rgb(113, 109, 109) 50%,rgb(105, 103, 103) 76%,rgb(80, 77, 77) 91%,rgb(76, 74, 74) 99%,rgb(76, 76, 76) 100%)')
          $('#endScreen').append(`
            <img src="src/player${num}wins.jpg">
            `)
        }
    }
    return undefined
  }
}

function twoPlayerMode() {
  // Setting up the Game
  var board_query = $('#board');
  var laby = new Labyrinth(BOARD_HEIGHT, BOARD_WIDTH);
  var player1 = new Player(400, 300, 'p1');
  var player2 = new Player(400, 800, 'p2');
  var monster = new MonsterFactory();
  laby.fillScreen(); // Creating the starting landscape of the game
  laby.createBorders(); // Creating the starting landscape, border part
  // Start screen fading
  init();
  function init() {
  setTimeout(() => {
  $('#startScreen').remove();
  window.cancelAnimationFrame(animationFrameID);
  play();
}, 5000);
  var animationFrameID = requestAnimationFrame(start_rendering_laby);
  function start_rendering_laby() {
  laby.advance(LANDSCAPE_SPEED);
  laby.eternalConstruct();
  // Rendering the labyrinth blocks
  laby.blocks.forEach((block) => {
  block.selector.css('transform', `translate(${block.y}px, ${block.x}px) `);
          });
          requestAnimationFrame(start_rendering_laby);
      }
  }
  // ===================
  //    Play function
  // ===================
  function play() {
      // This function will handle the whole game logic, executing at each requestAnimationFrame
      var P1_cont = $('#P1container');
      var P2_cont = $('#P2container');
      // Player 1 moves
      if (zPressed)
          player1.advance(TANK_SPEED_X - LANDSCAPE_SPEED, 0);
      if (qPressed && player1.position.y > 55)
          player1.advance(0, TANK_SPEED_Y);
      if (dPressed && player1.position.y < 470)
          player1.advance(0, -TANK_SPEED_Y);
      // Player 2 moves
      if (oPressed)
          player2.advance(TANK_SPEED_X - LANDSCAPE_SPEED, 0);
      if (kPressed && player2.position.y > 630)
          player2.advance(0, TANK_SPEED_Y);
      if (mPressed && player2.position.y < BOARD_WIDTH - 105)
          player2.advance(0, -TANK_SPEED_Y);
      // If no forward movement, the tanks go back at Landscape speed
      if (!zPressed)
          player1.advance(-LANDSCAPE_SPEED * 2 / 3, 0);
      if (!oPressed)
          player2.advance(-LANDSCAPE_SPEED * 2 / 3, 0);
      // Player 1 shoots
      if (aPressed && performance.now() - p1_sinceLastShot > 275) {
          let bullet_id = player1.shoot();
          p1_sinceLastShot = performance.now(); // avoids the player shooting multiple times immediately
          board_query.append('<div class="bullet1" id="p1bullet' + bullet_id + '"></div>'); // adding the bullet to the DOM
      }
      // Player 2 shoots
      if (iPressed && performance.now() - p2_sinceLastShot > 275) {
          let bullet_id = player2.shoot();
          p2_sinceLastShot = performance.now();
          board_query.append('<div class="bullet2" id="p2bullet' + bullet_id + '"></div>');
      }
      laby.advance(LANDSCAPE_SPEED);
      laby.eternalConstruct();
      player1.bulletAdvance(BULLET_SPEED_X, BULLET_SPEED_Y);
      player2.bulletAdvance(BULLET_SPEED_X, BULLET_SPEED_Y);
      // Checking if one of the players is out of screen
      if (player1.position.x > BOARD_HEIGHT - 75) {
          player1.updateLives(DEFAULT_POSITION_P1);
          P1_cont.html("<img id='P1' src='src/snail.svg'>");
          $('#P1announcement h1').text("FASTER! SNAIL MODE");
          setTimeout(() => {
              P1_cont.html("<img id='P1' src='src/Hugging_Face.png'>");
              $('#P1announcement h1').text('');
          }, 3000);
      }
      if (player2.position.x > BOARD_HEIGHT - 75) {
          player2.updateLives(DEFAULT_POSITION_P2);
          P2_cont.html("<img id='P2' src='src/snail.svg'>");
          $('#P2announcement h1').text("FASTER! SNAIL MODE");
          setTimeout(() => {
              P2_cont.html("<img id='P2' src='src/Hugging_Face.png'>");
              $('#P2announcement h1').text('');
          }, 3000);
      }
      monster.createMonsters();
      monster.advance(MONSTER_SPEED);
      monster.increaseDifficulty(performance.now());
      // Detecting when a player kills a monster
      var new_kills1 = monster.detectShooting(player1.bullets);
      var new_kills2 = monster.detectShooting(player2.bullets);
      if (new_kills1)
          player1.updateScore(new_kills1);
      if (new_kills2)
          player2.updateScore(new_kills2);
      // Detecting when a player and a monster collide
      if (monsterPlayerCollision(player1, monster.monsters)) {
          player1.updateLives(DEFAULT_POSITION_P1);
      }
      if (monsterPlayerCollision(player2, monster.monsters)) {
          player2.updateLives(DEFAULT_POSITION_P2);
      }
      renderGame();
      if (player1.lives > 0 && player2.lives > 0)
          requestAnimationFrame(play);
      else
          endGame(player1, player2);
  }
  // ========================
  //    Rendering function
  // ========================
  function renderGame() {
      var P1_query = $('#P1');
      var P2_query = $('#P2');
      // Rendering player 1
      P1_query.css('transform', `translate(${player1.position.y}px, ${player1.position.x}px) `);
      // Rendering player 2
      P2_query.css('transform', `translate(${player2.position.y}px, ${player2.position.x}px) `);
      // Rendering the bullets of Player 1
      player1.bullets.forEach((bullet) => {
          $(`#p1bullet${bullet.id}`).css('transform', `translate(${bullet.y}px, ${bullet.x}px) `);
      });
      // Rendering the bullets of Player 2
      player2.bullets.forEach((bullet) => {
          $(`#p2bullet${bullet.id}`).css('transform', `translate(${bullet.y}px, ${bullet.x}px) `);
      });
      // Rendering the labyrinth blocks
      laby.blocks.forEach((block) => {
          block.selector.css('transform', `translate(${block.y}px, ${block.x}px) `);
      });
      // Rendering the monsters
      monster.monsters.forEach((monster) => {
          monster.selector.css('transform', `translate(${monster.y}px, ${monster.x}px) `);
      });
  }
  // ==============================
  //    Event listener functions
  // ==============================
  document.addEventListener('keydown', KeyDownFunc, false);
  document.addEventListener('keyup', KeyUpFunc, false);
  // Player 1 controls: QZD for movement, A for fire
  var aPressed = false;
  var zPressed = false;
  var qPressed = false;
  var dPressed = false;
  var p1_sinceLastShot = performance.now();
  // Player 2 controls: KOM for movement, I for fire
  var iPressed = false;
  var kPressed = false;
  var oPressed = false;
  var mPressed = false;
  var p2_sinceLastShot = performance.now();
  function KeyDownFunc(event) {
      if (event.keyCode === 65)
          aPressed = true;
      if (event.keyCode === 90)
          zPressed = true;
      if (event.keyCode === 81)
          qPressed = true;
      if (event.keyCode === 68)
          dPressed = true;
      if (event.keyCode === 73)
          iPressed = true;
      if (event.keyCode === 75)
          kPressed = true;
      if (event.keyCode === 79)
          oPressed = true;
      if (event.keyCode === 77)
          mPressed = true;
  }
  function KeyUpFunc(event) {
      if (event.keyCode === 65)
          aPressed = false;
      if (event.keyCode === 90)
          zPressed = false;
      if (event.keyCode === 81)
          qPressed = false;
      if (event.keyCode === 68)
          dPressed = false;
      if (event.keyCode === 73)
          iPressed = false;
      if (event.keyCode === 75)
          kPressed = false;
      if (event.keyCode === 79)
          oPressed = false;
      if (event.keyCode === 77)
          mPressed = false;
  }
}

function onePlayerMode () {

}