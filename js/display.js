Othello.prototype.posToSel = function(position) {
	// Converts a position to an html selection.
	return document.getElementById('t' + position.join(''))
}

Othello.prototype.selToPos = function(sel) {
	// Converts a selected id to a position.
	return sel.id.split('').slice(1).map(function(x) {return parseInt(x)})
}

Othello.prototype.update = function() {
	var tiles = this.game.querySelectorAll('.tile')
	var that = this
	tiles.forEach(function(x) {
		var pos = toPos(x)
		var posv = that.read(pos)
		var token = x.querySelector('.token')
		if (posv != ' ') {
			if (token) {
				console.log('Updating existing token')
				token.style.background = that.colors[posv]
			} else {
				console.log('Creating new token')
				var token = document.createElement('div')
				token.className = 'token'
				token.style.background = that.colors[posv]
				x.appendChild(token)
			}	
		} else {
			if (token) {
				console.log('Removing existing token')
				token.remove()
			}
		}
	})
}

Othello.prototype.winDisplay = function() {
	this.clear()
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

Othello.prototype.scoreboard = function() {
	var scoreboard = document.getElementById('scoreboard').firstChild
	scoreboard.innerHTML = `B: ${this.count[0]} W: ${this.count[1]}<br>Turn: ${this.history.length}`	
}

Othello.prototype.replay = function() {
	var replay_menu = document.createElement('div')
	var first = document.createElement('button')
	var previous = document.createElement('button')
	var done = document.createElement('button')
	var next = document.createElement('button')
	var last = document.createElement('button')
	
	document.body.appendChild(replay_menu)
	replay_menu.appendChild(first)
	replay_menu.appendChild(previous)
	replay_menu.appendChild(done)
	replay_menu.appendChild(next)
	replay_menu.appendChild(last)
	
	replay_menu.style.textAlign = 'center'
	var that = this
	this.turn = 0
	
	first.innerHTML = '<<'
	first.onclick = function() {
		that.turn = 0
		that.barr = that.copy(that.history[that.turn])
		that.update()
	}
	
	previous.innerHTML = '<'
	previous.onclick = function() {
		if (that.turn > 0) {
			that.turn -= 1
		}
		that.barr = that.copy(that.history[that.turn])
		that.update()
	}
	
	done.innerHTML = 'Done'
	done.onclick = function() {
		that.winDisplay()
		replay_menu.remove()
	}
	
	next.innerHTML = '>'
	next.onclick = function() {
		if (that.turn < that.history.length - 1) {
			that.turn += 1
		}
		that.barr = that.copy(that.history[that.turn])
		that.update()
	}	
	
	last.innerHTML = '>>'
	last.onclick = function() {
		that.turn = that.history.length - 1
		that.barr = that.copy(that.history[that.turn])
		that.update()
	}
	
	this.update()
	if (this.dims.length > 2) {
		changeViewPlane(DISPLAY_DIMENSIONS.length)
	}
}

Othello.prototype.highlight = function(position, color) {
	this.posToSel(position).style.background = color
}

Othello.prototype.highlightMove = function(moves) {
	moves.forEach(function(x, i) {
		x.forEach(function(y, j) {
			if (toSel(y)) {
				i == 0 && j == 0 ? addHighlighting(y, 'red') : addHighlighting(y, 'pink')
			}
		})
	})
}

