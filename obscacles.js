class Obstacle{
    constructor(){
        this.w = 25;
        this.h = 50
        this.x = width;
        this.y = height - this.h;
    }

    move(){
        this.x -= 10;
    }

    draw(){
        
        rect(this.x,this.y, this.w, this.h);
    }
}