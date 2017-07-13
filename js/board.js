var Board = function(str){
	this.dims = str.split('x').map(function(x) {return parseInt(x)}); 
	// An array with the absolute lengths of each dimension
	this.barr = new Array(this.dims.reduce(function(a, b) {return a*b}, 1)).fill(' '); 
	// An one dimensional array of the board
	this.disp = ['x', 'y'].concat(new Array(this.dims.length - 2).fill(0))
	// An array of dimensions to display
	this.setDiml()
	// An array of dimension lengths within this.barr
	this.setPoss() 
	// An array of positions on the board as arrays
	this.disp = ['x', 'y'].concat(new Array(this.dims.length - 2).fill(0))
}

Board.prototype.setDiml = function() { 
	// Sets this.diml to an array with the lengths of each dimension within this.barr
	var that = this
	this.diml = this.dims.map(function(x, i) {
		return that.dims.slice(0, i + 1).reduce(
			function(a, b) {return a/b}, that.barr.length)
	})
}

Board.prototype.setPoss = function() {
	// Sets this.poss to an array of all positions in this.barr
	var that = this
	this.poss = this.barr.map(function(x, i) {return that.toPos(i)})
}

Board.prototype.toPos = function(ind) { 
	// Converts an index in this.barr to a position array
	return 0 > ind || ind > this.barr.length ? undefined 
		: this.diml.map(function(x) {
			var i = Math.floor(ind / x)
			ind %= x
			return i
		})
}
	
Board.prototype.toInd = function(pos) { 
	// Converts a position arry into an index in this.barr
	var that = this
	if (pos.length != this.dims.length || pos.some(function(x) {return x < 0})) {
		return undefined
	} else {
		return pos.reduce(function(a, b, i) {
			return a + b * that.diml[i]
		}, 0)
	}
}

Board.prototype.next = function(pos, dct) {
	var nxt = pos.map(function(x,i) {return x + dct[i]})
	return this.read(nxt) ? nxt : false
}
	
Board.prototype.read = function(pos) { // Reads a position in this.barr
	return this.barr[this.toInd(pos)]
}
	
Board.prototype.write = function(pos, value) { 
	// Writes a value to a position in this.barr
	var i = this.toInd(pos)
	return this.barr[i] ? this.barr[i] = value : undefined
}

Board.prototype.copy = function(arr) { // Returns a shallow copy of an array
	return arr.map(function(x) {return x})
}

var RectangularBoard = function(str) {
	Board.call(this, str)
	this.setDcts()
	// An array of directions on the board
	this.setCrns()
	// An array of corners on the board
}

RectangularBoard.prototype = Object.create(Board.prototype)
RectangularBoard.prototype.constructor = Board

RectangularBoard.prototype.setDcts = function() {
	// Sets this.dcts to an array of directions on the board
	var str = '3x'.repeat(this.dims.length).slice(0, -1)
	var a = new Board(str)
	this.dcts = 
		a.poss.filter(function(x) {
			return !x.every(function(y) {return y == 1})
		}).map(function(x) {
			return x.map(function(y) {return y - 1})
		})
}

RectangularBoard.prototype.setCrns = function() {
	var that = this
	this.crns = this.poss.filter(function(pos) {
		return pos.every(function(x, i) {
			return x == 0 || x == that.dims[i] - 1
		})
	})
}

RectangularBoard.prototype.to2D = function() {
	var row_index = this.disp.indexOf('x')
	var column_index = this.disp.indexOf('y')
	var that = this
	var filtered_indices = this.poss.filter(function(x) { 
		// Filters indices into desired dimensions
		return x.every(function(y, i) {
			return !Number.isInteger(that.disp[i]) || y == that.disp[i]
		})
	})
	
	var result = []
	for (var i = 0; i < 8; i++) { // Sorts filtered indices into a 2d array.
		var row = filtered_indices.filter(function(x) {
			return x[row_index] == i
		})
		row.sort(function(a, b) {return a[column_index] - b[column_index]})
		result.push(row)
	}
	return result
}

RectangularBoard.prototype.log = function() {
	var that = this
	var arr = this.to2D().map(function(x) {return x.map(function(y) {return that.read(y)})}) 
		// Translates index to value
	var label = new Array(this.dims[this.disp.indexOf('x')]).fill('')
	label = label.map(function(x, i) {return i})
	console.log('  ' + label.join(' '))
	arr.map(function(x, i) {console.log(i + '|' + x.join('|') + '|')})
}

