var GAME_LOGS_TEXT = ['Date, AI version, Board shape, Initial board, Move History, Winner, Players']
var GAME_LOGS = null

Othello.prototype.gameLog = function() {	
	var game_log = [
		new Date(),
		'0.2', // gameLog version number. Update for other versions.
		this.dims.join('x'), // Board shape.
		this.history[0].map(function(x) {return x == ' ' ? 'X' : x}).join(''),
		this.move_history.join(''),
		this.winner() !== false ? winner() : 'F',
		this.players.join('')
	].join()
	GAME_LOGS_TEXT.push(game_log)
	return game_log
}

var downloadLogs = function() {
	if (GAME_LOGS_TEXT.length < 2) {
		return alert('There are no logged games')
	}
	
	var data = new Blob([GAME_LOGS_TEXT.join('\n')], {type: 'text/plain'})	
	
	if (GAME_LOGS !== null) {
		window.URL.revokeObjectURL(GAME_LOGS)
	}	
	
	GAME_LOGS = window.URL.createObjectURL(data)
	
	var log_button = document.getElementById('logs')
	log_button.classList.remove('hide')
	
	log_button.addEventListener('click', function () {
		var link = document.createElement('a');
		link.setAttribute('download', 'logs.txt');
		link.href = GAME_LOGS;
		document.body.appendChild(link);

		window.requestAnimationFrame(function () {
			var event = new MouseEvent('click');
			link.dispatchEvent(event);
			document.body.removeChild(link);
		});
	}, false);
}

var newGame = function() {
	// Creates a new game
	var dims = document.getElementById('dimensions-option')
	CURRENT_GAME = new Othello(dims.value)
	CURRENT_GAME.start()
}

var toggleAIOptions = function() {
	// Toggles displayed options based on the number of players selected
	var ai = document.getElementById('ai').parentElement
	var human = document.getElementById('human').parentElement
	if (opt('players') == '1') {
		ai.style.display = ''
		human.style.display = ''
	} else {
		ai.style.display = 'none'
		human.style.display = 'none'
	}
}

var toggleAdvancedOptions = function() {
	// Toggles the display of advanced options in the options menu
	var ao = document.getElementById('advanced-options')
	// The advanced-options button
	
	var hghl = document.getElementById('highlight').parentElement
	var dims = document.getElementById('dimensions-option').parentElement
	// The advanced options
	
	if (dims.classList == 'hide') {
		ao.innerHTML = 'Hide Advanced Options'
	} else {
		ao.innerHTML = 'Advanced Options'
	}
	
	hghl.classList.toggle('hide')
	dims.classList.toggle('hide')
}

var simulateOthello = function(n, ai1, ai2, str = '8x8') {
	// Simulates n games with ai's 1 and 2 on a board str
	var c = 0
	while (c < n) {
		var x = new Othello(str)
		x.players = [ai1, ai2]
		x.sim = true
		x.play()
		x.log()
		c++
	}
}

var reloadGame = function(game_log) {
	// Reloads a previous game based on a game log
	game_log = game_log.split(',')
	CURRENT_GAME = new Othello(game_log[2])
	// Creating a new game based on dimensions provided by the game log
	
	var arr = game_log[3].split('').map(function(x) {
		return x === 'X' ? ' ' : x
	})
	CURRENT_GAME.barr = arr
	CURRENT_GAME.history = arr
	// Setting initial game board
	
	var moves = game_log[4].split('m').map(function(x) {
		return x.split(' ').map(function(y) {
			return parseInt(y)
		})
	}).slice(1)
	// Retrieving move history from game log
	
	moves.forEach(function(x) {
		CURRENT_GAME.current = x[0]
		var pos = x.slice(1).join().split(',').map(function(x) {return parseInt(x)})
		CURRENT_GAME.move(pos)
	})
	// Playing moves from move history
	
	CURRENT_GAME.players = game_log[6].split()
	// Sets players equal to players from the game log
	
	GAME_OPTIONS.style.display = 'none'
	CURRENT_GAME.play()
	// Starts game
}

