// Game Over state

var GameOver = function(game) {};
GameOver.prototype = {
	create: function() {
	
		this.game.stage.backgroundColor = '#000000';
		if(localStorage.getItem('hiscore') != null) {
			let storedScore = parseInt(localStorage.getItem('hiscore'));
			
			
			if (score > storedScore) {
				
				localStorage.setItem('hiscore', score.toString());
				highScore = score;
				newHighScore = true;
			} else {
				
				highScore = parseInt(localStorage.getItem('hiscore'));
				newHighScore = false;
			}
		} else {
			
			highScore = score;
			localStorage.setItem('hiscore', highScore.toString());
			newHighScore = true;
		}

		if(newHighScore) {
			var newHighText = game.add.text(game.width/2, game.height/2 - 56, 'New Hi-Score!', {font: 'Helvetica', fontSize: '32px', fill: '#009900'});
			newHighText.anchor.set(0.5);
		}
		var rektText = game.add.text(game.width/2, game.height/2, 'You scored ' + score + ' points', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
		rektText.anchor.set(0.5);
		
		var hiScoreText = game.add.text(game.width/2, game.height/2 + 56, 'This browser\'s best: ' + highScore + ' points', {font: 'Helvetica', fontSize: '32px', fill: '#facade'});
		hiScoreText.anchor.set(0.5);

		var playText = game.add.text(game.width/2, game.height*.9, 'Press Spacebar to Restart', {font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		playText.anchor.set(0.5);
		score = 0;
	},
	update: function() {
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('Play');
		}
	}
};