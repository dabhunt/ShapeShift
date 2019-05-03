// Title state

var Title = function(game) {};
Title.prototype = {
	create: function() {
		this.game.stage.backgroundColor = '#32262a';
		mountain = game.add.sprite(0, 75, 'mountains-back');
		mountain.scale.x = .65;
		mountain.scale.y = .65;
		titleText = game.add.sprite(game.width/2, game.height/2 - 24, 'title');
		titleText.anchor.set(.5);
		titleText.scale.x = .67;
		titleText.scale.y = .67;

		var instructText = game.add.text(game.width/2, game.height/2 + 148, ' - Match the color of the obstacle to pass through unharmed!', {font: 'Roboto', fontSize: '24px', fill: '#000'});
		instructText.anchor.set(0.5);

var instructText = game.add.text(game.width/2, game.height/2 + 196, ' - Left click to become a different colored shape!', {font: 'Roboto', fontSize: '24px', fill: '#000'});
		instructText.anchor.set(0.5);
		var playText = game.add.text(game.width/2, game.height/2+ 290, ' Press SPACEBAR to start!', {font: 'Roboto', fontSize: '24px', fill: '#000'});
		playText.anchor.set(0.5);
		var controlText = game.add.text(game.width/2, game.height/2 + 245, ' - Use the mouse to control your shape!', {font: 'Roboto', fontSize: '24px', fill: '#000'});
		controlText.anchor.set(0.5);

		newHighScore = false;
	},
	update: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('Play');
		}
		if(titleText.scale.x < .68){
			this.add.tween(titleText.scale).to({ x: .75, y: .75}, 2000, null, true, 0);
		}
		if(titleText.scale.x> .74){
			this.add.tween(titleText.scale).to({ x: .67, y: .67}, 2000, null, true, 0);
		}
	}
};