// This file will contain the game logic, namely the definition
// of classes and user actions, game interactions etc...

// ==================
//    Player class
// ==================
function Player (x, y, player_id) {
  this.position = {x: x, y: y}
  this.score = 0
  this.lives = 3
  this.player_id = player_id

  this.bullets = [] //bullets shot by the player
  this.bulletsFired = 0
}

// Advance function: updates the position of the player
Player.prototype.advance = function (dx = 1, dy = 0) {
  this.position = {
    x: this.position.x - dx,
    y: this.position.y - dy
  }
}

// Shoot function
Player.prototype.shoot = function () {
  this.bulletsFired += 1
  let bullet_id = this.bulletsFired

  this.bullets.push({
    x: this.position.x,
    y: this.position.y,
    id: bullet_id,
    player_id: this.player_id
  })
  return bullet_id
}

// Function that updates the position of the player's bullets
Player.prototype.bulletAdvance = function (dx = 0, dy = 0) {
  this.bullets.forEach( (bullet, index) => {
    this.bullets[index].x -= dx
    this.bullets[index].y -= - dy
  })
  this._removeBullets() // after advancing the bullets we remove the out of screen ones
}

Player.prototype._removeBullets = function () {
  // This function will remove the bullets that are out of screen (x < 0)
  var new_bullets = []
  this.bullets.forEach( (bullet, index) => {
    if (bullet.x > -10) {
      new_bullets.push(bullet)
    }
    else {
      $(`#${bullet.player_id}bullet${bullet.id}`).remove()
    }
  })
  this.bullets = new_bullets
}


// =====================
//    Labyrinth class
// =====================
function Labyrinth (board_height, board_width) {
  this.board_width = board_width
  this.board_height = board_height

  this.blocks = []
  this.blocksAdded = 0
  this.block_width = 50
  this.block_height = 50
}

Labyrinth.prototype.buildBlock = function (x, y) {
  // Game logic part
  this.blocksAdded += 1
  this.blocks.push({
    x: x,
    y: y,
    width: this.block_width,
    height: this.block_height,
    id: this.blocksAdded
  })

  // Jquery part
  $('#board').append(`<div class="labyrinthBlock" id="block${this.blocksAdded}"></div>`)
}

Labyrinth.prototype.buildLine = function (x, y, num) {
  // Will build a vertical line of num blocks starting from the given coords
  var x = x
  var y = y

  for (i = 1; i <= num; i++) {
    this.buildBlock(x, y)
    x -= this.block_height
  }
}

Labyrinth.prototype.buildHorizontalLine = function (x, y, num) {
  // Will build a horizontal line of num blocks starting from the given coords
  var x = x
  var y = y

  for (i = 1; i <= num; i++) {
    this.buildBlock(x, y)
    y -= this.block_width
  }
}

Labyrinth.prototype.fillScreen = function () {
  // Function that will create a proper wall that goes vertically along the screen
  var start_x = this.board_height - this.block_height
  var end_x = -150 // Building slightly higher than the screen so that 'advancing' doesnt result in glitches
  var num = (start_x - end_x) / this.block_height
  var start_y = this.board_width / 2 - this.block_width / 2

  this.buildLine(start_x, start_y, num)
}

// Advancing blocks
Labyrinth.prototype.advance = function (dx) {
  this.blocks.forEach( (block) => {
    block.x += dx
  })
  this._removeBlocks()
}

// Removing out-of-screen blocks
Labyrinth.prototype._removeBlocks = function () {
  var new_blocks = []
  var board_width = this.board_width + 20 // +20px to avoid glitches

  this.blocks.forEach( (block) => {
    if (block.x < board_width) {
      new_blocks.push(block)
    }
    else {
      $(`#block${block.id}`).remove()
    }
  })
  this.blocks = new_blocks
}

Labyrinth.prototype.eternalConstruct = function () {
  // Builds a landscape, 4ever (and ever, and ever)
    var lastBlock = this.blocks[this.blocks.length - 1]
    if (lastBlock.x > -50) {
      var start_y = this.board_width / 2 - this.block_width / 2
      this.buildLine(-50, start_y, 5)
    }
}
