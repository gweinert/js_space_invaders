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
    for (var i = 0; i < controller.currentEnemies.length ; i ++ ) {
      $( '#' + controller.currentEnemies[i] ).addClass('enemy');
      console.log("I IS " + i);
      if (i > 55) {
        console.log("YES");
        $('#'+ controller.currentEnemies[i] ).addClass('shooter');
      }
    }
  },

  spawnBullet: function() {
    $('#370').addClass("bullet");
  },

  updateEnemyViews: function(){
    $('.enemy').removeClass('enemy');
    for(var i = 0; i<controller.currentEnemies.length; i++){
      $('#'+controller.currentEnemies[i]).addClass('enemy');
    }
  },

  moveEnemiesNumberOfSpaces: function(numberOfSpaces){
    for (var i = 0; i < controller.currentEnemies.length ; i ++ ) {
      controller.currentEnemies[i] += numberOfSpaces;
    }
  },

  moveEnemyPositions: function(){
    if (controller.enemyCounter % 11 === 0 ){
      view.moveEnemiesNumberOfSpaces(20);
      controller.enemyCounter = 1;
      controller.enemyDirection *= -1;
    }
    else{
      view.moveEnemiesNumberOfSpaces( controller.enemyDirection );

    }
    controller.enemyCounter ++;
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

  moveBullet: function(i){

    $('#' + i).removeClass('bullet');
    $('#' + (i - 20)).addClass('bullet');
    return i - 20;

    // controller.playerBulletPosition -= 20;
    // $('.bullet').removeClass('bullet');
    // $('#'+controller.playerBulletPosition ).addClass('bullet');

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

            d = new Date()
            if (d.getTime() - controller.playerBulletDelay > 750) {

              controller.playerShoot();
              controller.playerBulletDelay = d.getTime();
            }
            break;

          default: return; // exit this handler for other keys
      }

      e.preventDefault(); // prevent the default action (scroll / move caret)
    });

  }

};


var controller = {

  init: function() {
    // this.createCurrentEnemiesArray();
    view.init();
    this.createCurrentEnemiesArray();
    this.playGame();
  },

  currentPlayerPosition: 390,
  enemyIntervalTime: 1000,
  currentEnemies: [],
  enemyCounter: 1,
  enemyDirection: 1,
  eleigibleEnemyShooters: [],
  playerBulletPosition: 390,
  playerBulletIntervalTime: 100,
  playerBullets: [],
  playerBulletDelay: new Date().getTime(),

  playGame: function() {
    controller.enemyInterval = setInterval(function(){

      view.moveEnemyPositions();
      view.updateEnemyViews();
      controller.updateEnemyShooters();
      // console.log(controller.currentEnemies);

    }, controller.enemyIntervalTime);

    controller.playerBulletInterval = setInterval(function(){
      new_bullets = []
      len = controller.playerBullets.length
      for (var i = 0; i < len; i++) {
        bullet = controller.playerBullets.pop();
        bullet = view.moveBullet(bullet);
        if (controller.currentEnemies.indexOf(bullet) > -1) {
          controller.currentEnemies.splice(controller.currentEnemies.indexOf(bullet), 1);
          $('#' + bullet).removeClass('bullet');
        }
        else {
          new_bullets.push(bullet);
        }
        // new_bullets.push(view.moveBullet(controller.playerBullets.pop()))
      };
      controller.playerBullets = new_bullets;
    }, controller.playerBulletIntervalTime)

  },

  updateEnemyShooters: function(){

  },

  createCurrentEnemiesArray: function() {
    for (var i = 39; i <= 160; i += 20) {
      for (var j = 1; j <= 11; j++){
        this.currentEnemies.push(i+j);
      }
    }
  },

  playerShoot: function(){

    this.playerBullets.push( controller.currentPlayerPosition );

  }

  //   view.spawnBullet();

  //   controller.playerBulletInterval = setInterval(function(){

  //     view.moveBullet();

  //     var hitEnemyIndex = controller.currentEnemies.indexOf(controller.playerBulletPosition);
  //     if( hitEnemyIndex > -1 ){
  //       console.log("HIT");
  //       clearInterval(controller.playerBulletInterval);
  //       controller.currentEnemies.splice(hitEnemyIndex, 1);
  //       $('.bullet').removeClass('bullet');
  //       controller.playerBulletPosition = 390;
  //     }
  //   }, controller.playerBulletIntervalTime);

  // }

};











