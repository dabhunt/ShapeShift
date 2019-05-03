// Play state

var Play = function(game) {};
Play.prototype = {
	create: function() {
		barrierSpeed = -390;
		level = 0;
		score = 0;

		this.beats = game.add.audio('beats');
		this.clang = game.add.audio('clang');
		this.death = game.add.audio('death');
		this.beats.play('', 0, 1, true);

		this.clang.allowMultiple = true;

        //Set the background color of the game to a purplish color
        this.game.stage.backgroundColor = '#32262a';
        //create several layers of parrallax tile sprites of my mountain drawings
        this.mountainsBack = this.game.add.tileSprite(0, 
            this.game.height - this.game.cache.getImage('mountains-back').height, 
            this.game.width, 
            this.game.cache.getImage('mountains-back').height, 
            'mountains-back'
        );

        this.mountainsMid2 = this.game.add.tileSprite(0, 
            this.game.height - this.game.cache.getImage('mountains-mid2').height-25, 
            this.game.width, 
            this.game.cache.getImage('mountains-mid2').height, 
            'mountains-mid2'
        );    
         this.mountainsMid1 = this.game.add.tileSprite(0, 
            this.game.height - this.game.cache.getImage('mountains-mid1').height+300, 
            this.game.width, 
            this.game.cache.getImage('mountains-mid1').height, 
            'mountains-mid1'
        );  
         //establish cloudsgroup, enable a physics body
        cloudsgroup = game.add.group();
       	cloudsgroup.enableBody = true;
        var cloud;
        //run a for loop to make 7 clouds of semi randomized size, sprite image and coordinate position;
		for (var i = 0; i < 7; i++){
			var rng = Math.random()* 100;
			if (rng < 40){
				cloud = cloudsgroup.create(Math.random()*game.width, 50+ Math.random()*100,'cloud1');
			}
			else if (rng < 70){
				cloud = cloudsgroup.create(Math.random()*game.width, 50+ Math.random()*100,'cloud2');
			}
			else{
				cloud = cloudsgroup.create(Math.random()*game.width, 50+ Math.random()*100,'cloud3');
				cloud.sendToBack();
			}
			//set a random value for both x and y scale
			var rand = .2 + Math.random()*.3;
			cloud.scale.x = .2 + rand;
			cloud.scale.y = .2 + rand;
		}
		//display and increment score counter inside the game for every barrier you pass through successfully
		titleText = game.add.text(game.width/2 -55, 55, '0', {font: 'Roboto', fontSize: '98px', fill: 'white'});
		titleText.anchor.set(0.5);
		//using the sprite atlas, retrieve the triangle0 sprite initially
		player = game.add.sprite(32, game.height/2, 'spritesheet', 'triangle0');
		//create seperate player animations for each of the 3 colored shapes of the player form
		player.animations.add("triangle",[3,4,5], 10, true, true)
		player.animations.add("square",[0,1,2], 10, true, true)
		player.animations.add("circle",[6,7,8], 10, true, true)
		//call this.changeShape at the start of the game to start the animation playing
		this.changeShape();
		//set player anchor to center and scale it smaller 
		player.anchor.set(0.5);
		player.scale.x *= .35;
		player.scale.y *= .35
		player.destroyed = false;
		//setup arcade physics for the player 
		game.physics.enable(player, Phaser.Physics.ARCADE);
		// assign maxvelocity, and drag values for keyboard control
		// these do not effect mouse controls
		player.body.maxVelocity.set(700);
		player.body.drag.set(800);
		player.body.collideWorldBounds = true;
		player.body.immovable = true;
		// add barrier group to the game group
		this.barrierGroup = game.add.group();
		this.addBarrier(this.barrierGroup);

		// setup difficulty timer each second it creates two new barriers
		this.difficultyTimer = game.time.create(false);	// .create(autoDestroy)
		this.difficultyTimer.loop(1000, this.speedBump, this); // .loop(delay, callback, callbackContext)
		this.difficultyTimer.start();	// don't forget to start the timer!!!!
	},
	speedBump: function() {
		// raise barrier speed, increment level
		if (barrierSpeed < 900){
			barrierSpeed-= 6;
		}
		//increment level and add a new barrier with a random color Red Yellow or blue
		level++;
		this.addBarrier(this.barrierGroup, this.randomColor());
		// every 5 levels play the success sound
		if(level%5 == 0 && score != 0) {
			this.clang.play('', 0, 0.75, false);
		}
	},
	update: function() {
		// my game allows the player to use keyboard controls or mouse, but the instructions only specify using the mouse since I think that is more condusive to the gameplay
		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			player.body.velocity.y -= playerVelocity;
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			player.body.velocity.y += playerVelocity;
		}
		//get input from spacebar
		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		// if space is pressed, run the changeshape function 
		if(spaceKey.justDown){
			this.changeShape();
		}
		if (game.input.activePointer.leftButton.isDown){
			this.mouseControl = true;
		}
		if (this.mouseControl){
			player.x = game.input.x;
			player.y = game.input.y;
			//game.physics.arcade.moveToXY(player,game.input.x,game.input.y,2000);
			
			if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
	        {
	            //player.body.velocity.setTo(0, 0);
	        }
	    }
	    //When the player clicks, it runs the changeShape function once
	    player.inputEnabled = true;
	    player.events.onInputDown.add(this.changeShape,this);
		// check for collision if player has not already been destroyed
		if(!player.destroyed) {
			game.physics.arcade.collide(player, this.barrierGroup, this.playerCollision, null, this);
		}
		// move the mountain tilesprite positions slowly at diferring speeds to create visual depth
		this.mountainsBack.tilePosition.x -= 0.05;
        this.mountainsMid2.tilePosition.x -= 0.3;
        this.mountainsMid1.tilePosition.x -= 0.75;
        // move each cloud inside the group to the left, and send it to the right side after exiting the left side of the screen
       	cloudsgroup.forEach(function(item){
       		if (item.x < -120){
       			item.body.x = game.width + 120;
       		}
       		item.body.x -= .3;
       	}) 
	},
	//function to change player shape type. 
	//The color loops by incrementing shapeType until it gets to 2 then resets to 0
	changeShape(){
		shapeType++;
		if (shapeType > 2){
			shapeType = 0;
		}
		if (shapeType == 0){
			
			player.animations.play('triangle');
			player.tint = Phaser.Color.YELLOW;	
		}
		if (shapeType == 1){
			
			player.animations.play('square');
			player.tint = Phaser.Color.RED;
		}
		if (shapeType == 2) {
			player.animations.play('circle');
			player.tint = Phaser.Color.BLUE;
		}
	},
	//function to generate and return a random color either Red yellow or blue. This is used to create barriers of matching color.
	randomColor(){
		var rng = game.rnd.between(0,2); // grab a random color
		var newColor;
		if (rng == 0){
			newColor = Phaser.Color.YELLOW;
		}
		else if (rng == 1){
			newColor = Phaser.Color.RED;
		}
		else if (rng == 2){
			newColor = Phaser.Color.BLUE;
		}
		return newColor;	
	},
	addBarrier: function(group) {
		// using a constructor create two new barriers, give it a random tint, and add them to the barrier group.
		var tintColor = this.randomColor();
		var barrier = new Barrier(game, barrierSpeed, tintColor,0);
		game.add.existing(barrier);
		group.add(barrier);
		// barrier2 is called with a minimum y value set to prevent significant overlap of barriers spawned
		tintColor = this.randomColor();
		var barrier2 = new Barrier(game, barrierSpeed, tintColor,barrier.y+barrier.height+10);
		game.add.existing(barrier2);
		group.add(barrier2);
	
	},
	playerCollision: function(player, group) {
		// first check if player.tint matches the barrier tint
		// if so, add 1 to player score, update the text and destroy the barrier
		if (group.tint == player.tint){
			score++;
			group.kill();
			titleText.setText(score);
		} else{
		// if the player collides with a different colored barrier, 
		player.destroyed = true;
		//destroyed property turns off collision checks
		//upon dying, the difficulty timer and music stops, and the death sound plays.
		this.difficultyTimer.stop();	
		this.beats.fadeOut(500);		
		this.death.play('', 0, 0.5, false);
		// a particle emitter is created at the coordinates of the player, using the triangle image already loaded in
		var deathEmitter = game.add.emitter(player.x, player.y, 200);
		deathEmitter.makeParticles('triangle0');
		//set particle properties including alpha, particle size and speed
		deathEmitter.setAlpha(0.3, 1);				
		deathEmitter.minParticleScale = 0.05;		
		deathEmitter.maxParticleScale = .22;
		deathEmitter.setXSpeed(-50,700);			
		deathEmitter.setYSpeed(-700,700);			
		//start emitting 200 particles that disappear after 2000ms
		deathEmitter.start(true, 2000, null, 200);
		//loop through each particle and change it's tint to the color of the player's tint at time of death.
		deathEmitter.forEach(function(item){item.tint = player.tint;}); 
		player.kill();	// remove player from game upon collision with different colored barrier.
		game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('GameOver')});
		}
	}
};