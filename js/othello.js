var Othello = function(str) {
	RectangularBoard.call(this, str)
	this.players = ['', '']
	// An array of players by type (human, ai type)
	this.current = 0
	// The current player
	this.colors = {'0': 'black', '1': 'white'};
	// The display colors for each player
	this.setBarr()
	// Sets barr to a standard othello starting arrangement
	this.move_history = []
	// An array of moves played
	this.turn = 0
}

Othello.prototype = Object.create(RectangularBoard.prototype)
Othello.prototype.constructor = RectangularBoard

Othello.prototype.setBarr = function() {
	// Sets barr to a standard othello starting arangement
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
			i % 2 == 0 ? that.write(x, '0') : that.write(x, '1')
		}
	})
	
	this.history = [this.copy(this.barr)]
}

Othello.prototype.validRow = function(pos, dct) {
	// Checks to see is a position has a valid row in a certain directions
	// Returns the row if it is valid
	var n = this.next(pos, dct)
	var nv = this.read(n)
	if (this.read(pos) == ' ' && nv != ' ' && nv != undefined && nv != this.current) {
		var row = [this.copy(pos), this.copy(n)]
		var that = this
		var valid = function() {
			n = that.next(n, dct)
			if (that.read(n) === false || that.read(n) == ' ' || that.read(n) == undefined) {
				return false
			} else if (parseInt(that.read(n)) == that.current) {
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

Othello.prototype.validMove = function(pos) {
	// Checks if a token can be played at a certain position
	// Returns the positions that will be flipped
	var that = this
	if (this.read(pos) != ' ') {
		return false
	} else {
		var moves = this.dcts.map(function(dct) {
			return that.validRow(pos, dct)
		})
		return moves.every(function(x) {return x == false}) ? false : moves.filter(function(x) {return x != false &&  x != undefined})
	}
}

Othello.prototype.validMoves = function() {
	// Checks if there are any valid positions for the current player
	var that = this
	var moves = this.poss.map(function(pos) {
		return that.validMove(pos)
	})
	return moves.every(function(x) {return x == false}) ? false : moves.filter(function(x) {return x != false &&  x != undefined})
}

Othello.prototype.move = function(pos) {
	// Places a token on the specified position and flips positions
	var that = this
	var a = this.copy(this.validMove(pos))
	a.forEach(function(x) {
		x.forEach(function(y) {
			that.write(y, that.current.toString())
		})
	})
	
	this.history.push(this.copy(this.barr))
	// Writes the board state to this.history
	this.last_move = a
	// Used for highlighting the move
	this.move_history.push('m' + this.current.toString() + ' ' + pos.join(' '))
	// Stores move in move history as a string
	this.turn++
	this.nextPlayer()
}

Othello.prototype.nextPlayer = function() {
	// Sets this.current to the next player 
	this.current < this.players.length - 1 ? this.current += 1 : this.current = 0
}

Othello.prototype.tokenCount = function() {
	// Returns an array of the number of tokens for each player
	var that = this
	
	this.count = this.players.map(function(x, p) {
		var c = 0;
		for (var i = 0; i < that.barr.length; i++) {
			if (that.barr[i] == p.toString()) {c++}
		}
		return c
	})
}

Othello.prototype.winner = function() {
	// Checks if there is a winner and returns the winner if there is one
	this.tokenCount()
	var that = this
	var real_current = this.current
	return !this.players.every(function(x, i) {
		that.current = i
		var result = that.validMoves() == false
		that.current = real_current
		return result
	}) ? false:
		that.count[0] == that.count[1] ? 'T' 
			: that.count.indexOf(Math.max.apply(null, that.count))	
}

Othello.prototype.undo = function() {
	// Undoes the last move played
	if (this.history.length < 2) {return false}
	
	var that = this
	var x = this.history.pop().filter(function(x, i) {
		return that.history[that.history.length - 1][i] == ' ' && x != ' '
	})
	
	this.barr = this.copy(this.history[this.history.length - 1])
	this.current = parseInt(x[0])
	this.update()
	this.play()
}

