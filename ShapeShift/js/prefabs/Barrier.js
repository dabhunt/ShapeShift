// Barrier prefab

// create Barrier constructor
var Barrier = function(game, speed, tintColor, yMin) {
	//Create a new barrier using the parameters for speed of the barrier, it's color, and y axis minimum
	//yMin is used to vertically space out barriers created at the same time and prevent overlap
	Phaser.Sprite.call(this, game, game.width, game.rnd.integerInRange(yMin+100,yMin+150), 'barrier');
	this.scale.y = 1 + Math.random()*1.6;
	game.physics.enable(this, Phaser.Physics.ARCADE);
	//set this barriers anchor to the center, the tint to the passed tint color.	
	this.anchor. set(0.5);								
	this.tint = tintColor;								
	this.body.immovable = true;							
	this.body.velocity.x = speed;		
	// new barrier variable lets the game determine if it needs to make another barrier or not				
	this.newBarrier = true;	
};
//create a barrier based on the prototype, using the create method
Barrier.prototype = Object.create(Phaser.Sprite.prototype);
Barrier.prototype.constructor = Barrier;  
//every frame it checks if the paddle is far enough to the right, and changes its new barrier property to false
Barrier.prototype.update = function() {
	if(this.newBarrier && this.x < game.width/2) {
		this.newBarrier = false;
	}
	if(this.x < -this.width) {
		this.kill();
		//destroy paddles at the edge of the screen
	}

}


