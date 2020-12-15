class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,200);
    car1.addImage(car1Img);
    car2 = createSprite(300,200);
    car2.addImage(car2Img)
    car3 = createSprite(500,200);
    car3.addImage(car3Img);
    car4 = createSprite(700,200);
    car4.addImage(car4Img);

    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();

    Player.getPlayerInfo();
    player.getCarsAtEnd();

    
    
    if(allPlayers !== undefined){
      //var display_position = 100;

      background("brown")
      image(trackImg,0,-displayHeight*4,displayWidth,displayHeight*5);
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 200;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 225;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;

        
        if (index === player.index){
          fill("pink");
          ellipse(x,y,60,60);

          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

   

    if(player.distance>4120){

      gameState=2

      player.rank +=1;

      Player.updateCarsAtEnd(player.rank);
    }


    drawSprites();
  }
  end(){

    console.log("GAME ENDED");

    rectMode(CENTER);
    fill("green");
    strokeWeight(4);
    stroke("black");
    rect(displayWidth/2,cars[player.index-1].y,400,200);

    textSize(30);
    fill("white")
    text("GAME ENDED",displayWidth/2-75,cars[player.index-1].y);

    textSize(30);
    text("YOUR RANK IS: "+player.rank,displayWidth/2-100,cars[player.index-1].y+50);
  }
}
