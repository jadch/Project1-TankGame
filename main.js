// This file will handle the game flow and user interactions
const TANK_SPEED_X = 3
const TANK_SPEED_Y = 2
const BULLET_SPEED_X = 8
const BULLET_SPEED_Y = 0
const LANDSCAPE_SPEED = 3
const MONSTER_SPEED = 1

const BOARD_HEIGHT = 500
const BOARD_WIDTH = 600

// Default starting positions
const DEFAULT_POSITION_P1 = { x: 400, y: 100 }
const DEFAULT_POSITION_P2 = { x: 400, y: 500 }

$(document).ready( function () {
  var game_over = false
  var board_query = $('#board')

  var player1 = new Player(400, 100, 'p1')
  var player2 = new Player(400, 500, 'p2')

  var laby = new Labyrinth(BOARD_HEIGHT,  BOARD_WIDTH)
  var monster = new MonsterFactory()

  laby.fillScreen()

  play()

// ===================
//    Play function
// ===================
function play () {
  // This function will handle the whole game logic, executing at each requestAnimationFrame

  // Player 1 moves
  if (zPressed) player1.advance(TANK_SPEED_X, 0)
  if (qPressed) player1.advance(0, TANK_SPEED_Y)
  if (dPressed) player1.advance(0, -TANK_SPEED_Y)

  // Player 2 moves
  if (oPressed) player2.advance(TANK_SPEED_X, 0)
  if (kPressed) player2.advance(0, TANK_SPEED_Y)
  if (mPressed) player2.advance(0, -TANK_SPEED_Y)

  // If no forward movement, the tanks go back at Landscape speed
  if (!zPressed) player1.advance(-LANDSCAPE_SPEED, 0)
  if (!oPressed) player2.advance(-LANDSCAPE_SPEED, 0)


  // Player 1 shoots
  if (aPressed && performance.now() - p1_sinceLastShot > 500) {
    let bullet_id = player1.shoot()
    p1_sinceLastShot = performance.now() // avoids the player shooting multiple times immediately
    board_query.append('<div class="bullet" id="p1bullet' + bullet_id + '"></div>') // adding the bullet to the DOM
  }

  // Player 2 shoots
  if (iPressed && performance.now() - p2_sinceLastShot > 500) {
    let bullet_id = player2.shoot()
    p2_sinceLastShot = performance.now()
    board_query.append('<div class="bullet" id="p2bullet' + bullet_id + '"></div>')
  }

  laby.advance(LANDSCAPE_SPEED)
  laby.eternalConstruct()
  player1.bulletAdvance(BULLET_SPEED_X, BULLET_SPEED_Y)
  player2.bulletAdvance(BULLET_SPEED_X, BULLET_SPEED_Y)

  // Checking if one of the players is out of screen
  if (player1.position.x > BOARD_HEIGHT) player1.updateLives(DEFAULT_POSITION_P1)
  if (player2.position.x > BOARD_HEIGHT) player2.updateLives(DEFAULT_POSITION_P2)

  monster.createMonsters()
  monster.advance(MONSTER_SPEED)

  var new_kills1 = monster.detectShooting(player1.bullets)
  var new_kills2 = monster.detectShooting(player2.bullets)
  player1.updateScore(new_kills1)
  player2.updateScore(new_kills2)

  renderGame()
  requestAnimationFrame(play)

}


// ========================
//    Rendering function
// ========================
function renderGame () {

  var P1_query = $('#P1')
  var P2_query = $('#P2')

  // Rendering player 1
  P1_query.css('transform', `translate(${player1.position.y}px, ${player1.position.x}px)`)

  // Rendering player 2
  P2_query.css('transform', `translate(${player2.position.y}px, ${player2.position.x}px)`)

  // Rendering the bullets of Player 1
  player1.bullets.forEach( (bullet) => {
    $(`#p1bullet${bullet.id}`).css('transform', `translate(${bullet.y}px, ${bullet.x}px)`)
  })

  // Rendering the bullets of Player 2
  player2.bullets.forEach( (bullet) => {
    $(`#p2bullet${bullet.id}`).css('transform', `translate(${bullet.y}px, ${bullet.x}px)`)
  })

  // Rendering the labyrinth blocks
  laby.blocks.forEach( (block) => {
    $(`#block${block.id}`).css('transform', `translate(${block.y}px, ${block.x}px)`)
  })

  // Rendering the monsters
  monster.monsters.forEach( (monster) => {
    $(`#monster${monster.id}`).css('transform', `translate(${monster.y}px, ${monster.x}px)`)
  })
}


// ==============================
//    Event listener functions
// ==============================
  document.addEventListener('keydown', KeyDownFunc, false)
  document.addEventListener('keyup', KeyUpFunc, false)

  // Player 1 controls: QZD for movement, A for fire
  var aPressed = false
  var zPressed = false
  var qPressed = false
  var dPressed = false
  var p1_sinceLastShot = performance.now()

  // Player 2 controls: KOM for movement, I for fire
  var iPressed = false
  var kPressed = false
  var oPressed = false
  var mPressed = false
  var p2_sinceLastShot = performance.now()


  function KeyDownFunc (event) {
    if (event.keyCode === 65 ) aPressed = true
    if (event.keyCode === 90 ) zPressed = true
    if (event.keyCode === 81 ) qPressed = true
    if (event.keyCode === 68 ) dPressed = true
    if (event.keyCode === 73 ) iPressed = true
    if (event.keyCode === 75 ) kPressed = true
    if (event.keyCode === 79 ) oPressed = true
    if (event.keyCode === 77 ) mPressed = true
  }

  function KeyUpFunc (event) {
    if (event.keyCode === 65 ) aPressed = false
    if (event.keyCode === 90 ) zPressed = false
    if (event.keyCode === 81 ) qPressed = false
    if (event.keyCode === 68 ) dPressed = false
    if (event.keyCode === 73 ) iPressed = false
    if (event.keyCode === 75 ) kPressed = false
    if (event.keyCode === 79 ) oPressed = false
    if (event.keyCode === 77 ) mPressed = false
  }

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
