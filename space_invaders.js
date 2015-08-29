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
    this.spawnEnemyShooters();
    this.keyListener();
  },

  generateGrid: function() {
    for (var i = 1; i <= (this.gridSize[0] * this.gridSize[1]); i++) {
      $('.game-grid').append("<div class='cell' id='" + i + "'>"+ i + "</div>");
    }
  },

  spawnPlayer: function() {
    $('#390').addClass("player");
    controller.currentPlayerPosition = 390;
  },

  spawnEnemies: function() {
    for (var i = 0; i < controller.currentEnemies.length ; i ++ ) {
      
      $( '#' + controller.currentEnemies[i] ).addClass('enemy');

    }
  },

  spawnEnemyShooters: function(){
    for(var i = 0; i < controller.enemyShooters.length; i++ ){
      $( '#' + controller.enemyShooters[i] ).addClass('shooter');
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

  updateShooterViews: function(){
    $('.shooter').removeClass('shooter');
    for(var i = 0; i<controller.enemyShooters.length; i++){
      $('#'+controller.enemyShooters[i]).addClass('shooter');
    }

  },

  moveEnemiesNumberOfSpaces: function(numberOfSpaces){
    for (var i = 0; i < controller.currentEnemies.length ; i ++ ) {
      controller.currentEnemies[i] += numberOfSpaces;
    }
  },

  moveShooterEnemiesNumberOfSpaces: function(numberOfSpaces){
    for(var i = 0; i< controller.enemyShooters.length ; i++ ){
      controller.enemyShooters[i] += numberOfSpaces;
    }
  },

  moveEnemyPositions: function(){
    if (controller.enemyCounter % 11 === 0 ){
      view.moveEnemiesNumberOfSpaces(20);
      view.moveShooterEnemiesNumberOfSpaces(20);
      controller.enemyCounter = 1;
      controller.enemyDirection *= -1;
    }
    else{
      view.moveEnemiesNumberOfSpaces( controller.enemyDirection );
      view.moveShooterEnemiesNumberOfSpaces( controller.enemyDirection);

    }
    controller.enemyCounter ++;
  },



  updatePlayerPosition: function() {
    // console.log("updating! current player position is " + controller.currentPlayerPosition);
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

  },

  moveEnemyBullet: function(i){
    $('#' + i).removeClass('bullet');
    $('#' + (i + 20)).addClass('bullet');
    return i + 20;
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
    this.createCurrentEnemiesArray();
    view.init();
    // this.createCurrentEnemiesArray();
    this.playGame();
  },

  currentPlayerPosition: 390,
  enemyIntervalTime: 1000,
  currentEnemies: [],
  enemyCounter: 1,
  enemyDirection: 1,
  enemyShooters: [],
  enemyBullets: [],
  playerBulletPosition: 390,
  playerBulletIntervalTime: 100,
  playerBullets: [],
  playerBulletDelay: new Date().getTime(),

  playGame: function() {
    controller.enemyInterval = setInterval(function(){

      view.moveEnemyPositions();
      view.updateEnemyViews();
      view.updateShooterViews();

    }, controller.enemyIntervalTime);

    controller.createEnemyBullets = setInterval(function(){

      var shooter = controller.enemyShooters[Math.floor(Math.random() * controller.enemyShooters.length)];

      controller.enemyBullets.push(shooter);

      console.log("bulet created!");
    }, 5000);

    controller.enemyBulletInterval = setInterval(function(){

      numOfBullets = controller.enemyBullets.length;

      for(var i = 0; i<=numOfBullets; i++ ){
        bullet = controller.enemyBullets[i];
  
        if(controller.playerBulletCollision(bullet)){
          $('#'+bullet).removeClass('bullet');
          $('player').removeClass('player');
          controller.enemyBullets.splice(controller.enemyBullets.indexOf(bullet), 1);
          alert("you lose");
        }
        else{
          bullet = view.moveEnemyBullet(bullet);
          controller.enemyBullets[i] = bullet;
          
        }
      }
    }, 700);
   

    controller.playerBulletInterval = setInterval(function(){

      new_bullets = [];
      len = controller.playerBullets.length;
      for (var i = 0; i < len; i++) {
        bullet = controller.playerBullets.pop();
        
        
        if(controller.enemyBulletCollision(bullet)){
          if (controller.enemyShooters.indexOf(bullet) > -1) {
            controller.enemyShooters.splice(controller.enemyShooters.indexOf(bullet), 1);
            if($('#'+(bullet-20)).hasClass('enemy')){
              controller.enemyShooters.push(bullet-20);
            }
         }
          
          $('#' + bullet).removeClass('bullet');
          
          console.log("bullet_id: "+bullet);
          
          controller.currentEnemies.splice(controller.currentEnemies.indexOf(bullet), 1);
          
          controller.playerBullets.splice(controller.playerBullets.indexOf(bullet), 1);

        }
        else {
          bullet = view.moveBullet(bullet);
          new_bullets.push(bullet);
        }
      }
      controller.playerBullets = new_bullets;
    }, controller.playerBulletIntervalTime);

  },

  createCurrentEnemiesArray: function() {
    for (var i = 40; i <= 160; i += 20) {
      for (var j = 1; j <= 11; j++){
        this.currentEnemies.push(i+j);
        if( i > 160-12 ){
          this.enemyShooters.push(i+j);
        }
      }
    }
  },

  playerShoot: function(){

    this.playerBullets.push( controller.currentPlayerPosition );

  },

  enemyShoot: function(){

    var shooter = this.enemyShooters[Math.floor(Math.random() * this.enemyShooters.length)];
    // console.log(shooter);


  },

  playerBulletCollision: function(bullet_id){
    if( this.currentPlayerPosition === bullet_id ){
      return true;
    }
    else{
      return false;
    }
  },

  enemyBulletCollision: function(bullet_id){
    if( controller.currentEnemies.indexOf(bullet_id) > -1){
      console.log("enemy hit");
      return true;

    }
    else{
      return false;
    }
  }


};











