// This file will handle the game flow and user interactions
const BULLET_SPEED = 2

$(document).ready( function () {
  var game_over = false
  var player1 = new Player(400, 250)
  var player2 = new Player(400, 500)

  play()


// ===================
//    Play function
// ===================
function play () {
  // This function will handle the whole game logic, executing at each requestAnimationFrame

  player1.advance()
  player2.advance()

  // Player 1 shoots
  if (zPressed && performance.now() - p1_sinceLastShot > 500) {
    player1.shoot()
    p1_sinceLastShot = performance.now() // avoids the player shooting multiple times immediately
    $('#board').append('<div class="bullet" id="p1bullet' + player1.bullets.length + '"></div>') // adding the bullet to the DOM
  }

  // Player 2 shoots
  if (upPressed && performance.now() - p2_sinceLastShot > 500) {
    player2.shoot()
    p2_sinceLastShot = performance.now()
    $('#board').append('<div class="bullet" id="p2bullet' + player2.bullets.length + '"></div>')
  }

  renderGame()
  requestAnimationFrame(play)

}


// ========================
//    Rendering function
// ========================
function renderGame () {
  // Rendering player 1
  $('#P1').css('top', player1.position.x + 'px')
  $('#P1').css('left', player1.position.y + 'px')
  // $('#P1').css('transform', 'translate(-1px, 0px)')

  // Rendering player 2
  $('#P2').css('top', player2.position.x + 'px')
  $('#P2').css('left', player2.position.y + 'px')

  // Rendering the bullets of Player 1
  player1.bullets.forEach( (bullet, index) => {
    $('#p1bullet' + (index + 1)).css('top', player1.bullets[index].x + 'px')
    $('#p1bullet' + (index + 1)).css('left', player1.bullets[index].y + 'px')
  })

  // Rendering the bullets of Player 2
  player2.bullets.forEach( (bullet, index) => {
    $('#p2bullet' + (index + 1)).css('top', player2.bullets[index].x + 'px')
    $('#p2bullet' + (index + 1)).css('left', player2.bullets[index].y + 'px')
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
