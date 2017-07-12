var Othello = function(str) {
	RectangularBoard.call(this, str)
	this.players = ['B', 'W']
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
}

Othello.prototype.validRow = function(pos, dct, player) {
	var n = this.next(pos, dct)
	var nv = this.read(n)
	if (this.read(pos) == ' ' && nv != ' ' && nv != false && nv != player) {
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


var bt = new Board('8x8')
var rt = new RectangularBoard('8x8')
var ot = new Othello('8x8')