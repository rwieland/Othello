var Othello = function(str) {
	RectangularBoard.call(this, str)
	this.players = ['B', 'W']
	this.current = 0
	this.colors = {'B': 'black', 'W': 'white'};
	this.setBarr()
}

Othello.prototype = Object.create(RectangularBoard.prototype)
Othello.prototype.constructor = RectangularBoard

Othello.prototype.setBarr = function() {
	var mid = this.dims.map(function(x) {
		var n = Math.floor(x / 2)
		return [n - 1, n]
	})
	
	var that = this
	this.poss.forEach(function(x) {
		if (x.every(function(y, i) {return y == mid[i][0] || y == mid[i][1]})) { 
			// If a position should have a token.
			var i = x.reduce(function(a, b, i) { 
				// Determines if a position should be W or B.
				return b == mid[i][1] ? a + 1 : a			
			}, 0)
			i % 2 == 0 ? that.write(x, 'B') : that.write(x, 'W')
		}
	})
	
	this.history = [this.copy(this.barr)]
}

Othello.prototype.validRow = function(pos, dct, player) {
	var n = this.next(pos, dct)
	var nv = this.read(n)
	if (this.read(pos) == ' ' && nv != ' ' && nv && nv != player) {
		var row = [this.copy(pos), this.copy(n)]
		var that = this
		var valid = function() {
			n = that.next(n, dct)
			if (that.read(n) == false || that.read(n) == ' ') {
				return false
			} else if (that.read(n) == player) {
				return row
			} else {
				row.push(that.copy(n))
				return valid()
			}
		}
		return valid()
	} else {
		return false
	}
}

Othello.prototype.validMove = function(pos, player) {
	var that = this
	if (this.read(pos) != ' ') {
		return false
	} else {
		var moves = this.dcts.map(function(dct) {
			return that.validRow(pos, dct, player)
		})
		return moves.every(function(x) {return x == false}) ? false : moves.filter(function(x) {return x != false &&  x != undefined})
	}
}

Othello.prototype.validMoves = function(player) {
	var that = this
	var moves = this.poss.map(function(pos) {
		return that.validMove(pos, player)
	})
	return moves.every(function(x) {return x == false}) ? false : moves.filter(function(x) {return x != false &&  x != undefined})
}

Othello.prototype.move = function(pos, player) {
	var that = this
	this.validMove(pos, player).forEach(function(x) {
		x.forEach(function(y) {
			that.write(y, player)
		})
	})
	
	this.history.push(this.copy(this.barr))
}

Othello.prototype.nextPlayer = function() {
	this.current < this.players.length - 1 ? this.current += 1 : this.current = 0
}

Othello.prototype.tokenCount = function() {
	var that = this
	this.count = this.players.map(function(player) {
		var c = 0;
		for (var i = 0; i < that.barr.length; i++) {
			if (that.barr[i] == player) {c++}
		}
		return c
	})
}

Othello.prototype.winner= function() {
	this.tokenCount()
	var that = this
	return !this.players.every(function(x) {return that.validMoves(x) == false}) ? false:
		that.count[0] == that.count[1] ? 'T' 
			: that.count.indexOf(Math.max.apply(null, that.count))	
}

// Converts a position to an html selection.
Othello.prototype.posToSel = function(position) {
	return document.getElementById('t' + position.join(''))
}

// Converts a selected id to a position.
Othello.prototype.selToPos = function(sel) {
	return sel.id.split('').slice(1).map(function(x) {return parseInt(x)})
}

Othello.prototype.update = function() {
	var tiles = this.game.querySelectorAll('.tile')
	var that = this
	tiles.forEach(function(x) {
		var pos = toPos(x)
		var posv = that.read(pos)
		if (posv != ' ') {
			if (x.querySelector('.token')) {
				console.log('Updating existing token')
				x.querySelector('.token').style.backbround = that.colors
			} else {
				console.log('Creating new token')
				var token = document.createElement('div')
				token.className = 'token'
				token.style.background = that.colors[posv]
				x.appendChild(token)
			}	
		}
	})
}

Othello.prototype.winDisplay = function() {
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

Othello.prototype.scoreboard = function() {
	var scoreboard = document.getElementById('scoreboard').firstChild
	scoreboard.innerHTML = `B: ${this.count[0]} W: ${this.count[1]}<br>Turn: ${this.history.length}`	
}

var bt = new Board('8x8')
var rt = new RectangularBoard('8x8')
var ot = new Othello('8x8')