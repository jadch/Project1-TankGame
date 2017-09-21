// This file will contain the game logic, namely the definition
// of classes and user actions, game interactions etc...

// ===============================================
// Global variables defined in the main.js file:
// ===============================================
// const BOARD_HEIGHT
// const BOARD_WIDTH

// Global board selector
const BOARD = $('#board')

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
    x: this.position.x - 15,
    y: this.position.y + 23,
    id: bullet_id,
    player_id: this.player_id
  })
  return bullet_id
}

// Function that updates the position of the player's bullets, and removes out of screen ones
Player.prototype.bulletAdvance = function (dx = 0, dy = 0) {
  var new_bullets = []

  this.bullets.forEach( (bullet, index) => {
    if (bullet.x > -100) {
      bullet.x -= dx
      bullet.y -= - dy
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
  this.blocksAdded += 1

  // Jquery part
  BOARD.append(`<div class="labyrinthBlock" id="block${this.blocksAdded}"></div>`)
  var selector = $(`#block${this.blocksAdded}`)

  // Game logic part
  this.blocks.push({
    x: x,
    y: y,
    width: this.block_width,
    height: this.block_height,
    id: this.blocksAdded,
    selector: selector
  })
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
    var block_array = this.blocks
    for (var i = 0; i < block_array.length; i++) {
      if (block_array[i]['x'] > BOARD_HEIGHT - 50) {
        block_array[i]['x'] = - 250
      }
    }
}

// Method to create the board borders
Labyrinth.prototype.createBorders =  function () {
  var block_height = this.block_height
  var num_blocks = BOARD_HEIGHT / block_height - 2 // the -2 accounts for the TopBar

  var x = 0

  for (var i = 0; i < num_blocks; i++) {
    // left-side border
    BOARD.append(`<div class="BorderBlock" id="borderL${i}"></div>`)
    $(`#borderL${i}`).css('transform', `translate(0px, ${x}px)`)

    // right-side border
    BOARD.append(`<div class="BorderBlock" id="borderR${i}"></div>`)
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
  var numberOfMonster = 6

  while (this.monsters.length < numberOfMonster) {
    this.monstersAdded += 1
    var y, src
    var x = - Math.floor(Math.random() * 900 + 100) // -1000 < x < -100
    var y1 = Math.floor(Math.random() * 400  + 55) // 55 < y1 < 455
    var y2 = Math.floor(Math.random() * 380  + 625) // 625 < y2 < 1005
    var choose_y = Math.random()
    choose_y < 0.5 ? y = y1 : y = y2
    choose_y < 0.15 ? src ="src/poo.png" : src = "src/alien.png"

    // Jquery part
    BOARD.append(`<img class="monsters" id="monster${this.monstersAdded}" src=${src}>`)
    var selector = $(`#monster${this.monstersAdded}`)

    var monster = {
      x: x,
      y: y,
      id: this.monstersAdded,
      selector: selector
    }
    this.monsters.push(monster)

  }
}

// Advance method, to move monsters forward
MonsterFactory.prototype.advance = function (dx) {
  var new_monsters = []
  var board_height = BOARD_HEIGHT + 20 // +20px to avoid glitches
  this.monsters.forEach( (monster) => {
    monster.x += dx

    if (monster.x < board_height) { // Checking if we're out of screen
      new_monsters.push(monster)
    }
    else {
      monster.selector.remove()
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
        selector: currentMonster.selector,
        width: 40,
        height: 40
      }
      if (collisionDetector(monster, bullet)) {
        currentMonster.x = 2000 // A hack to put the monster out of screen and get it deleted from the array
        monster.selector.remove()
        count_of_monsters_shot += 1
      }
    }
  }
  return count_of_monsters_shot // useful to increment the player score
}
