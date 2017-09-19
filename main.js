// This file will handle the game flow and user interactions
const TANK_SPEED_X = 1
const TANK_SPEED_Y = 1
const BULLET_SPEED_X = 2
const BULLET_SPEED_Y = 0

$(document).ready( function () {
  var game_over = false
  var player1 = new Player(400, 250, 'p1')
  var player2 = new Player(400, 500, 'p2')

  var laby = new Labyrinth(600, 500)
  laby.buildBlock(10, 100)
  laby.buildLine(400, 350, 8)
  laby.buildHorizontalLine(250, 300, 4)

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

  // Player 1 shoots
  if (aPressed && performance.now() - p1_sinceLastShot > 500) {
    let bullet_id = player1.shoot()
    p1_sinceLastShot = performance.now() // avoids the player shooting multiple times immediately
    $('#board').append('<div class="bullet" id="p1bullet' + bullet_id + '"></div>') // adding the bullet to the DOM
  }

  // Player 2 shoots
  if (iPressed && performance.now() - p2_sinceLastShot > 500) {
    let bullet_id = player2.shoot()
    p2_sinceLastShot = performance.now()
    $('#board').append('<div class="bullet" id="p2bullet' + bullet_id + '"></div>')
  }

  player1.bulletAdvance(BULLET_SPEED_X, BULLET_SPEED_Y)
  player2.bulletAdvance(BULLET_SPEED_X, BULLET_SPEED_Y)

  renderGame()
  requestAnimationFrame(play)

}


// ========================
//    Rendering function
// ========================
function renderGame () {
  // Rendering player 1
  $('#P1').css('transform', `translate(${player1.position.y}px, ${player1.position.x}px)`)

  // Rendering player 2
  $('#P2').css('transform', `translate(${player2.position.y}px, ${player2.position.x}px)`)

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
