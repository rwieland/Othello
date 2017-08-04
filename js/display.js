Othello.prototype.posToSel = function(position) {
	// Converts a position to an html selection.
	return document.getElementById('t' + position.join('.'))
}

Othello.prototype.selToPos = function(sel) {
	// Converts a selected id to a position.
	return sel.id.slice(1).split('.').map(function(x) {return parseInt(x)})
}

Othello.prototype.update = function() {
	// Updates #game to display the current board
	var tiles = this.game.querySelectorAll('.tile')
	var that = this
	tiles.forEach(function(x) {
		var pos = that.selToPos(x)
		var posv = that.read(pos)
		var token = x.querySelector('.token')
		if (posv != ' ') {
			if (token) {
				token.style.background = that.colors[posv]
			} else {
				var token = document.createElement('div')
				token.className = 'token'
				token.style.background = that.colors[posv]
				x.appendChild(token)
			}	
		} else {
			if (token) {
				token.remove()
			}
		}
	})
}

Othello.prototype.winDisplay = function() {
	// Creates a diplay shown when the game is over
	this.clear()
	this.resetGameDimensions()
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
	
	if (this.winner() == "T") {
		message.innerHTML = 'Tie'
	} else if (this.winner() === 0) {
		message.innerHTML = 'Black Wins'
	} else if (this.winner() === 1) {
		message.innerHTML = 'White Wins'
	} else {
		message.innerHTML = 'Indecisive'
	}
	
	var that = this
	
	reset_button.innerHTML = 'New Game'
	reset_button.onclick = function() {
		that.options.style.display = ''
		win_display.remove()
		document.getElementById('scoreboard').firstChild.innerHTML = ''
	}
	
	replay_button.innerHTML = 'View Game'
	replay_button.onclick = function() {
		that.replay()
		win_display.remove()
	}
	
	this.game.style.backgroundColor = 'gray'
	this.game.appendChild(win_display)
}

Othello.prototype.scoreboard = function() {
	// Displays the current score
	this.tokenCount()
	var scoreboard = document.getElementById('scoreboard').firstChild
	scoreboard.innerHTML = `B: ${this.count[0]} W: ${this.count[1]}<br>Turn: ${this.turn}`	
}

Othello.prototype.replay = function() {
	// Displays a navigable replay of the game
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
	this.barr = this.copy(this.history[this.turn])
	
	first.innerHTML = '<<'
	first.onclick = function() {
		that.turn = 0
		that.barr = that.copy(that.history[that.turn])
		that.update()
		that.scoreboard()
	}
	
	previous.innerHTML = '<'
	previous.onclick = function() {
		if (that.turn > 0) {
			that.turn -= 1
		}
		that.barr = that.copy(that.history[that.turn])
		that.update()
		that.scoreboard()
	}
	
	done.innerHTML = 'Done'
	done.onclick = function() {
		that.barr = that.copy(that.history[that.history.length - 1])
		that.turn = that.history.length - 1
		that.scoreboard()
		replay_menu.remove()
		that.winDisplay()
	}
	
	next.innerHTML = '>'
	next.onclick = function() {
		if (that.turn < that.history.length - 1) {
			that.turn += 1
		}
		that.barr = that.copy(that.history[that.turn])
		that.update()
		that.scoreboard()
	}	
	
	last.innerHTML = '>>'
	last.onclick = function() {
		that.turn = that.history.length - 1
		that.barr = that.copy(that.history[that.turn])
		that.update()
		that.scoreboard()
	}
	
	this.draw()
	this.update()
	this.scoreboard()
	if (this.dims.length > 2) {
		changeViewPlane(DISPLAY_DIMENSIONS.length)
	}
}

Othello.prototype.opt = function(x) {
	// Gets a option value
	var e = document.getElementById(x)
	return e.options[e.selectedIndex].value
}

Othello.prototype.highlight = function(position, color) {
	// Highlights a tile a specific color
	this.posToSel(position).style.background = color
}

Othello.prototype.highlightMove = function(moves) {
	// Highlights the last move played
	var that = this
	moves.forEach(function(x, i) {
		x.forEach(function(y, j) {
			if (toSel(y)) {
				i == 0 && j == 0 ? that.highlight(y, 'red') : that.highlight(y, 'pink')
			}
		})
	})
}

Othello.prototype.play = function() {
	// Plays the next turn
	localStorage.setItem('last-game', this.gameLog())	
	
	this.count += 1
	if (!this.sim) {
		this.update()
		this.scoreboard()
	}
	
	if (this.winner() !== false) { // If there is a winner		
		if (!this.cr) {STATS.write(this.gameLog())}
		// Write the game log to stats if it is not a complete replay
		if (!this.sim) {this.winDisplay()}
	} else if (this.validMoves()) { // If the current player can make a move.
		switch(this.players[this.current]) {
			case 'H':
				this.humanMove()
				break
			case '0':
				this.randomMove()
				break
			case '1':
				this.mostTokensMove()
				break
			case '2':
				this.strategicMove()
				break
			case '3':
				this.weightedMove()
				break
			case '4':
				this.counterMove()
				break
			case '5':
				this.mixedMove()
				break
		}		
	} else { // If the current player cannot make a move but there is no winner.
		this.nextPlayer()
		this.play()
	}
}

Othello.prototype.humanMove = function() {
	// Sets up the board for human input
	var that = this
	this.validMoves().forEach(function(x) {				
		if (that.posToSel(x[0][0])) {
			if (that.opt('highlight') == 1) {
				that.highlight(x[0][0], 'yellow')
				if (that.history.length > 1) {
					that.highlightMove(that.last_move)
				}
			}	
			that.posToSel(x[0][0]).onclick = function(event) {
				that.move(that.selToPos(event.target))
				that.draw()
				that.update()
				that.scoreboard()
				setTimeout(that.play.bind(that), that.turn_delay)
			}
		}
	})
}

Othello.prototype.start = function() {
	// Sets variables for the start of the game
	this.draw()
	switch(this.opt('players')) {
		case '1':
			var a = this.opt('ai')
			var h = this.opt('human')
			if (this.dims.length == 2 && this.dims[0] == 8 && this.dims[1] == 8) {
				h == '0' ? this.players = ['H', a] : this.players = [a, 'H']
			} else {
				alert('Advanced AIs only work for 8x8 boards. Using easiest AI.')
				h == '0' ? this.players = ['H', '0'] : this.players = ['0', 'H']
			}
			
			this.turn_delay = parseInt(this.opt('turn-speed'))
			break
		case '2':
			this.players = ['H', 'H']
			this.turn_delay = 0
			break			
	}

	if (this.dims.length > 2) {
		this.changeViewPlane()
	}
	this.sim = false
	this.cr = false
	
	this.play()
}

Othello.prototype.logHistory = function() {
	// Logs the history of the game to the console
	var that = this
	var current_barr = this.copy(this.barr)
	this.history.forEach(function(x) {
		that.barr = x
		that.log()
	})
	this.barr = current_barr
}

