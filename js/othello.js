var Othello = function(str) {
	RectangularBoard.call(this, str)
	this.players = ['', '']
	this.current = 0
	this.colors = {'0': 'black', '1': 'white'};
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
			i % 2 == 0 ? that.write(x, '0') : that.write(x, '1')
		}
	})
	
	this.history = [this.copy(this.barr)]
}

Othello.prototype.validRow = function(pos, dct) {
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
	var that = this
	var moves = this.poss.map(function(pos) {
		return that.validMove(pos)
	})
	return moves.every(function(x) {return x == false}) ? false : moves.filter(function(x) {return x != false &&  x != undefined})
}

Othello.prototype.move = function(pos) {
	var that = this
	var a = this.copy(this.validMove(pos))
	a.forEach(function(x) {
		x.forEach(function(y) {
			that.write(y, that.current.toString())
		})
	})
	
	this.history.push(this.copy(this.barr))
	this.last_move = a
	this.nextPlayer()
}

Othello.prototype.nextPlayer = function() {
	this.current < this.players.length - 1 ? this.current += 1 : this.current = 0
}

Othello.prototype.tokenCount = function() {
	var that = this
	
	this.count = this.players.map(function(x, p) {
		var c = 0;
		for (var i = 0; i < that.barr.length; i++) {
			if (that.barr[i] == p) {c++}
		}
		return c
	})
}

Othello.prototype.winner = function() {
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

var bt = new Board('8x8')
var rt = new RectangularBoard('8x8')
var ot = new Othello('8x8')

