// Player controls spaceship at bottom of screen
// can move left or right pressing arrow keys
// can shoot pressing spacebar
// 5 rows of 11 minions spawn at top of screen
// Grid is 53 x 20
// move towards player traveling across the screen and then down

$(document).ready(function(){

  controller.init();

});


var view = {

  //Generate grid
  gridSize: [20, 20],

  init: function() {
    this.generateGrid();
    this.spawnPlayer();
    this.spawnEnemies();
    this.keyListener();
  },

  generateGrid: function() {
    for (var i = 1; i <= (this.gridSize[0] * this.gridSize[1]); i++) {
      $('.game-grid').append("<div class='cell' id='" + i + "'>"+ i + "</div>")
    }
  },

  spawnPlayer: function() {
    $('#390').addClass("player");
    controller.currentPlayerPosition = 390;
  },

  spawnEnemies: function() {
    for (var i = 60; i < 160; i += 20) {
      for (var j = 1; j <= 11; j++) {
        $('#' + (i + j)).addClass('enemy');
      }
    }
  },

  updatePlayerPosition: function() {
    console.log("updating! current player position is " + controller.currentPlayerPosition);
    $('.player').removeClass('player');
    $('#' + controller.currentPlayerPosition).addClass('player');

  },

  movePlayer: function(n) {
    if (n == 1) {
      if (controller.currentPlayerPosition != 400){
        controller.currentPlayerPosition += 1;
      }
    }
    else {
      if (controller.currentPlayerPosition != 381) {
        controller.currentPlayerPosition -= 1;
      }
    }
    view.updatePlayerPosition();
  },

  keyListener: function() {
    $(document).keydown(function(e) {
      switch(e.which) {

          //right
          case 39:
            view.movePlayer(1);
            break;

          //left
          case 37:
            view.movePlayer(2);
            break;

          //space
          case 32:
            console.log("FIRE");
            break;

          default: return; // exit this handler for other keys
      }

      e.preventDefault(); // prevent the default action (scroll / move caret)
    });

  }

}

var controller = {

  init: function() {
    view.init();
  },

  currentPlayerPosition: 0
}