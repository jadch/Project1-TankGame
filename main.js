// This file will handle the game flow and user interactions
const BULLET_SPEED_X = 2
const BULLET_SPEED_Y = 0

$(document).ready( function () {
  var game_over = false
  var player1 = new Player(400, 250, 'p1')
  var player2 = new Player(400, 500, 'p2')

  play()


// ===================
//    Play function
// ===================
function play () {
  // This function will handle the whole game logic, executing at each requestAnimationFrame

  player1.advance()
  player2.advance()
  player1.bulletAdvance(BULLET_SPEED_X, BULLET_SPEED_Y)
  player2.bulletAdvance(BULLET_SPEED_X, BULLET_SPEED_Y)

  // Player 1 shoots
  if (zPressed && performance.now() - p1_sinceLastShot > 500) {
    let bullet_id = player1.shoot()
    p1_sinceLastShot = performance.now() // avoids the player shooting multiple times immediately
    $('#board').append('<div class="bullet" id="p1bullet' + bullet_id + '"></div>') // adding the bullet to the DOM
  }

  // Player 2 shoots
  if (upPressed && performance.now() - p2_sinceLastShot > 500) {
    let bullet_id = player2.shoot()
    p2_sinceLastShot = performance.now()
    $('#board').append('<div class="bullet" id="p2bullet' + bullet_id + '"></div>')
  }

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
  player1.bullets.forEach( (bullet, index) => {
    $(`#p1bullet${bullet.id}`).css('transform', `translate(${player1.bullets[index].y}px, ${player1.bullets[index].x}px)`)
  })

  // Rendering the bullets of Player 2
  player2.bullets.forEach( (bullet, index) => {
    $(`#p2bullet${bullet.id}`).css('transform', `translate(${player2.bullets[index].y}px, ${player2.bullets[index].x}px)`)
  })
}


// ==============================
//    Event listener functions
// ==============================
  document.addEventListener('keydown', KeyDownFunc, false)
  document.addEventListener('keyup', KeyUpFunc, false)

  // Player 1 controls: A - Z - E
  var aPressed = false
  var zPressed = false
  var ePressed = false
  var p1_sinceLastShot = performance.now()
  // Player 2 controls: left - up - right
  var leftPressed = false
  var upPressed = false
  var rightPressed = false
  var p2_sinceLastShot = performance.now()


  function KeyDownFunc (event) {
    if (event.keyCode === 65 ) aPressed = true
    if (event.keyCode === 90 ) zPressed = true
    if (event.keyCode === 69 ) ePressed = true
    if (event.keyCode === 37 ) leftPressed = true
    if (event.keyCode === 38 ) upPressed = true
    if (event.keyCode === 39 ) rightPressed = true
  }

  function KeyUpFunc (event) {
    if (event.keyCode === 65 ) aPressed = false
    if (event.keyCode === 90 ) zPressed = false
    if (event.keyCode === 69 ) ePressed = false
    if (event.keyCode === 37 ) leftPressed = false
    if (event.keyCode === 38 ) upPressed = false
    if (event.keyCode === 39 ) rightPressed = false
  }

})
