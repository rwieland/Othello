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
	
	if (this.winner() == "T") {
		message.innerHTML = 'Tie'
	} else if (this.winner() == 0) {
		message.innerHTML = 'Black Wins'
	} else if (this.winner() == 1) {
		message.innerHTML = 'White Wins'
	} else {
		message.innerHTML = 'Indecisive'
	}
	
	var that = this
	
	reset_button.innerHTML = 'New Game'
	reset_button.onclick = function() {
		that.options.style.display = ''
		win_display.remove()
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
	this.barr = this.copy(this.history[this.turn])
	
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
	
	this.draw()
	this.update()
	if (this.dims.length > 2) {
		changeViewPlane(DISPLAY_DIMENSIONS.length)
	}
}

Othello.prototype.opt = function(x) {
	var e = document.getElementById(x)
	return e.options[e.selectedIndex].value
}

Othello.prototype.highlight = function(position, color) {
	this.posToSel(position).style.background = color
}

Othello.prototype.highlightMove = function(moves) {
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
	this.count += 1
	this.update()
	
	if (this.winner() !== false) { // If there is a winner
		// gameLog()
		this.winDisplay()
	} else if (this.validMoves()) { // If the current player can make a move.
		switch(this.players[this.current]) {
			case 'human':
				this.humanMove()
				break
			case '0':
				setTimeout(this.randomMove.bind(this), 1000)
				break
			case '1':
				setTimeout(this.mostTokensMove.bind(this), 1000)
				break
			case '2':
				setTimeout(this.strategicMove.bind(this), 1000)
				break
			case '3':
				setTimeout(this.weightedMove.bind(this), 1000)
				break
		}		
	} else { // If the current player cannot make a move but there is no winner.
		this.nextPlayer()
		this.play()
	}
}

Othello.prototype.humanMove = function() {
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
				that.play()
			}
		}
	})
}

Othello.prototype.start = function() {
	this.draw()
	switch(this.opt('players')) {
		case '0':
			var a = this.opt('ai')
			this.players = [a, a]
			break
		case '1':
			var a = this.opt('ai')
			var h = this.opt('human')
			h == '0' ? this.players = ['human', a] : this.players = [a, 'human']
			break
		case '2':
			this.players = ['human', 'human']
			break
	}
	this.play()
}

Othello.prototype.logHistory = function() {
	var that = this
	var current_barr = this.copy(this.barr)
	this.history.forEach(function(x) {
		that.barr = x
		that.log()
	})
	this.barr = current_barr
}

