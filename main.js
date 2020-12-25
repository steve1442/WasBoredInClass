class point{
  constructor(X,Y,A,Accel){
    this.x = X;
    this.y = Y;
    this.a = A;
    this.accel = Accel;
  }
}

class bullet{
  constructor(x,y,a,accel,r){
    this.point = new point(x,y,a,accel);
    this.r = r;
  }
  update(){
    this.point.x += this.point.accel * cos(this.point.a);
    this.point.y += this.point.accel * sin(this.point.a);
    resetMatrix();
    fill('white');
    circle(this.point.x,this.point.y,this.r);
    resetMatrix();
  }
}

class character{
  constructor(x,y,a,accel,s){
    this.point = new point(x,y,a,accel);
    this.s = s;
  }
  draw(){
    resetMatrix();
    fill('red');
    triangle(this.point.x + (this.s * 2) * cos(this.point.a), this.point.y + (this.s * 2) * sin(this.point.a),this.point.x + this.s * cos(this.point.a + (3/4 * PI) ), this.point.y + this.s * sin(this.point.a + (3/4 * PI)),  this.point.x +  this.s* cos(this.point.a + (5/4 * PI)), this.point.y + this.s * sin(this.point.a + (5/4 * PI)));
    resetMatrix();
  }
  update(){
    if(this.point.x < 0){
      this.point.x = windowWidth;
    }
    if(player.point.x > windowWidth){
      this.point.x = 0;
    }
    if(this.point.y < 0){
      this.point.y = windowHeight;
    }
    if(this.point.y > windowHeight){
      this.point.y = 0;
    }
    this.point.a = this.point.a % (2 * PI);
    if(this.point.accel > 10){
      this.point.accel = 10;
    }
    if(this.point.accel > 0){
      this.point.accel -= 0.05;
    }
    else if(this.point.accel < 0){
      this.point.accel += 0.05;
      if(this.point.accel < -10){
        this.point.accel = -10;
      }
    }
    else{
      this.point.accel = 0;
    }
    this.point.x += this.point.accel * cos(this.point.a);
    this.point.y += this.point.accel * sin(this.point.a);
  }
}

class enemy{
  constructor(x,y,a,r,accel){
    this.point = new point(x,y,a,accel);
    this.r = r;
  }
  update(){
    this.point.x += this.point.accel * cos(this.point.a);
    this.point.y += this.point.accel * sin(this.point.a);
    if(this.point.x < 0){
      this.point.x = windowWidth;
    }
    if(this.point.x > windowWidth){
      this.point.x = 0;
    }
    if(this.point.y < 0){
      this.point.y = windowHeight;
    }
    if(this.point.y > windowHeight){
      this.point.y = 0;
    }
    resetMatrix();
    fill('white');
    circle(this.point.x,this.point.y,this.r);
    resetMatrix();
  }
}

class Game{
  constructor(gameIsRunning){
    this.enemys = []
    this.bullets = []
    this.gameIsRunning = gameIsRunning;
    this.score = 0;
  }
}

function setup() {
  // put setup code here
  createCanvas(windowWidth - 10, windowHeight-127);
  game = new Game(true);
  player = new character(windowWidth /2, windowHeight /2,0,0,20);
}

let t = 0;
let e = 0;
function draw() {
  clear();
  background(51); 
  resetMatrix();
    textSize(windowHeight * .06);
    fill('white');
    text('Score: ' + game.score, windowWidth * .01, windowHeight * .07);
  player.update();
  if(game.gameIsRunning){
  if(e >= 200 && game.enemys.length < 10){
    let x = random(windowWidth);
    let y = random(windowHeight);
    let a = random(TWO_PI);
    let s = random(50,100);
    while((s * 2) > dist(x,y,player.point.x,player.point.y)){
      x = random(windowWidth);
      y = random(windowHeight);
    }
    
    Enemy = new enemy(x,y,a,s,random(5,10));
    game.enemys.push(Enemy);
    e = 0;
  }
  e++;
  
  for(let i = 0; i < game.bullets.length; i++){
    let kill = false;
    game.bullets[i].update();
    if(game.bullets[i].point.x < 0){
      kill = true;
    }
    if(game.bullets[i].point.x > windowWidth){
      kill = true;
    }
    if(game.bullets[i].point.y < 0){
      kill = true;
    }
    if(game.bullets[i].point.y > windowHeight){
      kill = true;
    }
    if(kill){
      game.bullets.splice(i,1);
      kill = false;
    }
    kill = false;
  }
  for(let i = 0; i < game.enemys.length; i++){
    let kill = false;
    game.enemys[i].update();
    if(dist(player.point.x,player.point.y,game.enemys[i].point.x,game.enemys[i].point.y) < (game.enemys[i].r/2)){
      game.gameIsRunning = false;
    }
    for(let x = 0; x < game.bullets.length; x++){
      if(dist(game.bullets[x].point.x,game.bullets[x].point.y,game.enemys[i].point.x,game.enemys[i].point.y) < (game.enemys[i].r/2)){
        kill = true;
        game.bullets.splice(x,1);
      }
    }
    if(kill){
      game.enemys.splice(i,1);
      kill = false;
      game.score++;
    }
    kill = false;
  }
  if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
    player.point.a -= 0.05
  }
  if(keyIsDown(RIGHT_ARROW) ||keyIsDown(68)){
    player.point.a += 0.05
  }
  if(keyIsDown(UP_ARROW) || keyIsDown(87)){
    player.point.accel += 0.15
  }
  if((keyIsDown(DOWN_ARROW) ||  keyIsDown(32))&& (t >= 10)){
    Bullet = new bullet(player.point.x,player.point.y, player.point.a, 20,10);
    game.bullets.push(Bullet);
    t = 0;
  }
  if(keyIsDown(83)){
    player.point.accel -= 0.15
  }
  player.draw();
  t++;
  // put drawing code here
  }
  if(!game.gameIsRunning){
    background('red');
    resetMatrix();
    textSize(windowHeight * .1);
    fill('white');
    text('PRESS SPACE TO RESTART', windowWidth * .16, windowHeight/2);
    if(keyIsDown(32)){
      game.gameIsRunning = true;
      player.point.x = 500;
      player.point.y = 500;
      player.point.a = 0;
      game.enemys = []
      game.score = 0;
    }
  }
}