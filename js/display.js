var Display = function(str) {
	Othello.call(this, str)
}

Display.prototype = Object.create(Othello.prototype)
Display.prototype.constructor = Othello

Display.prototype.drawBoard = function() {
	this.clearBoard()
	this.scoreboard()
	var that = this
	GAME.style.backgroundColor = 'black'
	GAME_OPTIONS.style.display = 'none'
	var display_board = this.to2D()
	var game = document.querySelector('#game')
	display_board.forEach(function(x) {
		var row = document.createElement('div')
		row.className = 'row'
		x.forEach(function(y) {
			var tile_border = document.createElement('div')
			var tile = document.createElement('div')
			tile_border.className = 'tile-border'
			tile.className = 'tile'
			tile.id = 't' + y.join('')
			if (that.read(y) != ' ') {
				var token = document.createElement('div')
				token.className = 'token'
				token.style.background = COLORS[that.read(y)]
				tile.appendChild(token)
			}
			tile_border.appendChild(tile)
			row.appendChild(tile_border)	
		})
		game.appendChild(row)
	})
}

Display.prototype.clearBoard = function() {
	var b = document.querySelectorAll('.row')
	for (var n = 0; n < b.length; n++) {
		b[n].remove()
	}	
}

Display.prototype.updateBoard = function() {
	
}

Display.prototype.winDisplay = function() {
	clearBoard()
	var plane_navigation = document.getElementById('plane-navigation')
	plane_navigation ? plane_navigation.remove() : null
	win_display = document.createElement('div')
	win_display.setAttribute('class', 'game-overlay')
	message = document.createElement('h2')
	reset_button = document.createElement('button')
	replay_button = document.createElement('button')
	win_display.appendChild(message)
	win_display.appendChild(reset_button)
	win_display.appendChild(replay_button)
	win_display.id = 'win-display'
	
	if (winner() == "T") {
		message.innerHTML = 'Tie'
	} else if (PLAYERS[winner()] == 'B') {
		message.innerHTML = 'Black Wins'
	} else if (PLAYERS[winner()] == 'W') {
		message.innerHTML = 'White Wins'
	} else {
		message.innerHTML = 'Indecisive'
	}
	
	reset_button.innerHTML = 'New Game'
	reset_button.onclick = function() {
		GAME_OPTIONS.style.display = ''
		win_display.remove()
	}
	
	replay_button.innerHTML = 'View Game'
	replay_button.onclick = function() {
		replay()
		win_display.remove()
	}
	
	GAME.style.backgroundColor = 'gray'
	GAME.appendChild(win_display)
}

Display.prototype.scoreboard = function() {
	var scoreboard = document.getElementById('scoreboard').firstChild
	scoreboard.innerHTML = `B: ${this.count[0]} W: ${this.count[1]}<br>Turn: ${this.history.length}`	
}