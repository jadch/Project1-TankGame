// This file will contain the game logic, namely the definition
// of classes and user actions, game interactions etc...

// ===============================================
// Global variables defined in the main.js file:
// ===============================================
// const BOARD_HEIGHT
// const BOARD_WIDTH

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
    if (bullet.x > -100) {
      new_bullets.push(bullet)
    }
    else {
      $(`#${bullet.player_id}bullet${bullet.id}`).remove()
    }
  })
  this.bullets = new_bullets
}

Player.prototype.updateLives = function (default_position) {
  // When a player loses life, this function will update the widget on the Top of the screen, and reset player's position
  this.lives -= 1
  this.position = default_position
  $(`#${this.player_id}Lives`).text(this.lives + ' lives')
}

// Method to update the player's score
Player.prototype.updateScore = function (new_kills) {
  this.score += new_kills
  $(`#${this.player_id}Score`).text('Score: ' + this.score)
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
  var start_x = this.board_height
  var end_x = -150 // Building slightly higher than the screen so that 'advancing' doesnt result in glitches
  var num = (start_x - end_x) / (this.block_height * 2)
  var block_width = this.block_width
  var start_y = this.board_width / 2 - block_width / 2

  this.buildSquare(start_x, start_y, 50, num)
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

// Building squares
Labyrinth.prototype.buildSquare = function (start_x, start_y, separation, num) {
  // Will build a series of 4x4 squares seperated by 'separation' pixels
  var block_width = this.block_width
  var block_height = this.block_height
  for (var i = 0; i < num; i ++) {
    this.buildLine(start_x, start_y, 2)
    this.buildLine(start_x, start_y + block_width, 2)
    start_x -= separation + 2 * block_height
  }
}

Labyrinth.prototype.eternalConstruct = function () {
  // Builds a landscape, 4ever (and ever, and ever)
    var lastBlock = this.blocks[this.blocks.length - 1]
    var block_width = this.block_width
    if (lastBlock.x > -50) {
      var start_y = this.board_width / 2 - block_width / 2
      this.buildSquare(-150, start_y, 50, 3)
    }
}

// Method to create the board borders
Labyrinth.prototype.createBorders =  function () {
  var block_height = this.block_height
  var num_blocks = BOARD_HEIGHT / block_height - 2 // the -2 accounts for the TopBar

  var x = 0

  for (var i = 0; i < num_blocks; i++) {
    // left-side border
    $('#board').append(`<div class="BorderBlock" id="borderL${i}"></div>`)
    $(`#borderL${i}`).css('transform', `translate(0px, ${x}px)`)

    // right-side border
    $('#board').append(`<div class="BorderBlock" id="borderR${i}"></div>`)
    $(`#borderR${i}`).css('transform', `translate(${BOARD_WIDTH - 55}px, ${x}px)`)
    x += block_height
  }
}

// ===================
//    Monster class
// ===================
function MonsterFactory () {
  this.monsters = []
  this.monstersAdded = 0
}

MonsterFactory.prototype.createMonsters = function () {
  var numberOfMonster = 4

  while (this.monsters.length < numberOfMonster) {
    this.monstersAdded += 1
    var x = - Math.floor(Math.random() * 200 + 100) // -300 < x < -100
    var y = Math.floor(Math.random() * 500) + 50 // 50 < y < 550
    var monster = {
      x: x,
      y: y,
      id: this.monstersAdded
    }
    this.monsters.push(monster)

    // Jquery part
    $('#board').append(`<img class="monsters" id="monster${this.monstersAdded}" src="src/alien.png">`)
  }
}

// Advance method, to move monsters forward
MonsterFactory.prototype.advance = function (dx) {
  this.monsters.forEach( (monster) => {
    monster.x += dx
  })
  this._removeMonsters()
}

MonsterFactory.prototype._removeMonsters = function () {
  var new_monsters = []
  var board_height = BOARD_HEIGHT + 20 // +20px to avoid glitches

  this.monsters.forEach( (monster) => {
    if (monster.x < board_height) {
      new_monsters.push(monster)
    }
    else {
      $(`#monster${monster.id}`).remove()
    }
  })
  this.monsters = new_monsters
}

// Method that detects if a monster has been shot :(
MonsterFactory.prototype.detectShooting = function (bulletArray) {
  // This function expects an array of bullets as an argument
  var bullet_width = 1
  var bullet_height = 35
  var bullet_array_length = bulletArray.length
  var monster_array_length = this.monsters.length
  var count_of_monsters_shot = 0

  for (var i = 0; i < bullet_array_length; i++) {
    var bullet = {
      x: bulletArray[i].x,
      y: bulletArray[i].y,
      width: bullet_width,
      height: bullet_height
    }

    for (var j = 0; j < monster_array_length; j++) {
      var currentMonster = this.monsters[j]
      var monster = {
        x: currentMonster.x,
        y: currentMonster.y,
        width: 40,
        height: 40
      }
      if (collisionDetector(monster, bullet)) {
        $(`#monster${currentMonster.id}`).remove()
        count_of_monsters_shot += 1
      }
    }
  }
  return count_of_monsters_shot // useful to increment the player score
}
