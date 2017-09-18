// This file will contain the game logic, namely the definition
// of classes and user actions, game interactions etc...

// ==================
//    Player class
// ==================
function Player (x, y) {
  this.position = {x: x, y: y}
  this.score = 0
  this.lives = 3

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
    id: bullet_id
  })
  return bullet_id
}

// Function that updates the position of the player's bullets
Player.prototype.bulletAdvance = function (dx = 0, dy = 0) {
  this.bullets.forEach( (bullet, index) => {
    this.bullets[index].x -= dx
    this.bullets[index].y -= - dy
  })
  // this._removeBullets() // after advancing the bullets we remove the out of screen ones
}

Player.prototype._removeBullets = function () {
  // This function will remove the bullets that are out of screen (x < 0)
  var new_bullets = []
  this.bullets.forEach( (bullet, index) => {
    if (bullet.x > 0) {
      new_bullets.push(bullet)
    }
    // else {
    //   $('p')
    // }
  })
  this.bullets = new_bullets
}
