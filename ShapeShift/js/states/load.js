// Load state

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// setup loading bar
		var loadingBar = this.add.sprite(game.width/2, game.height/2, 'loading');
		loadingBar.anchor.set(0.5);
		game.load.setPreloadSprite(loadingBar);

		// load graphics assets
		
		game.load.path = 'assets/img/';
		game.load.image('barrier', 'barrier.png');
		game.load.atlasJSONHash('spritesheet', 'spritesheet.png', 'sprites.json');
		game.load.image('triangle0', 'triangle0.png');
		game.load.image('circle0', 'circle0.png');
		game.load.image('square0', 'square0.png');
		game.load.image('title', 'titletext.png');

		game.load.image('mountains-back', 'mountains-back.png');
		game.load.image('mountains-mid1', 'mountains-mid1.png');
		game.load.image('mountains-mid2', 'mountains-mid2.png');

		game.load.image('cloud1', 'cloud1.png');
		game.load.image('cloud2', 'cloud2.png');
		game.load.image('cloud3', 'cloud3.png');
		// load audio assets
		game.load.path = 'assets/audio/';
		game.load.audio('beats', ['mysong.mp3']);
		game.load.audio('clang', ['clang.mp3']);
		game.load.audio('death', ['death.mp3']);
	},
	create: function() {
		// check for local storage browser support
		if(window.localStorage) {
			console.log('Local storage supported');
		} else {
			console.log('Local storage not supported');
		}
		// go to Title state

		game.state.start('Title');
	}
};