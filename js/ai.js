Othello.prototype.randomMove = function(moves) {
	// Plays a random move
	if (moves == undefined) {moves = this.validMoves()}
	var i = Math.floor(Math.random() * moves.length)
	this.move(moves[i][0][0])
	this.play()
}

Othello.prototype.mostTokensMove = function(moves = this.validMoves()) {
	// Selects the moves from a set of moves that net the most tokens.
	// Selects a random move from the selected set.
	var net_tokens = moves.map(function(x) {
		var tokens = 1 - x.length
		x.map(function(y) {
			tokens += y.length
		})
		return tokens
	})
	
	var max_tokens = Math.max.apply(null, net_tokens)
	var max_moves = moves.filter(function(x,i) {
		return net_tokens[i] === max_tokens
	})
	
	this.randomMove(max_moves)
}

Othello.prototype.strategicMove = function(moves = this.validMoves()) {
	// Takes a corner when available. Otherwise the move with the most tokens.
	var that = this
	var corner_moves = moves.filter(function(position) {
		return that.crns.some(function(corner) {
			return corner.every(function(x, i) {
				return x == position[0][0][i]
			})
		})
	})
	
	if (corner_moves[0]) {
		return that.mostTokensMove(corner_moves)
	}
	
	this.mostTokensMove(moves)
}

Othello.prototype.moveWeights = function(moves = this.validMoves()) {
	// Returns an array of move weights for a provided array of moves
	var that = this
	if (this.t_weights === undefined) {this.transformWeights()}
	if (moves === false) {return [0]}
	return moves.map(function(x) {
		return that.t_weights[x[0][0].join('.')]
	})
}

Othello.prototype.transformWeights = function() {
	var trans = this.dims.map(function(x) {
		y = [0]
		for (var i = 1; i < x; i++) {
			if (i == x - 1) {
				y.push(7)
			} else if (i == Math.floor(x/2) - 1) {
				y.push(3)
			} else if (i == Math.floor(x/2)) {
				y.push(4)
			} else if (i < Math.floor(x/2) - 1) {
				if (i % 2 == 0) {
					y.push(2)
				} else {
					y.push(1)					
				}
			} else {
				if ((x - 1 - i) % 2 == 0) {
					y.push(5)
				} else {
					y.push(6)
				}
			}
		}
		return y
	})
	
	this.t_weights = {}
	var that = this
	this.poss.forEach(function(x) {
		var w = 1
		for (var i = 0; i < x.length - 1; i++) {
			for (var j = 1; j < x.length; j++) {
				ti = trans[i][x[i]]
				tj = trans[j][x[j]]
				w *= that.weights[`${ti}${tj}`]				
			}
		}
		that.t_weights[x.join('.')] = w
	})
}

Othello.prototype.weightedMove = function(moves = this.validMoves()) {
	// Plays the move with the highest move weight
	var move_weights = this.moveWeights(moves)
	var maximum = Math.max(...move_weights)
	var filtered = moves.filter(function(x, i) {return move_weights[i] == maximum})
	this.randomMove(filtered)
}

Othello.prototype.nextMoveMaxWeights = function(moves = this.validMoves()) {
	// Returns an array of move weights based on what the next player can play
	if (this.t_weights === undefined) {this.transformWeights()}
	var that = this
	return moves.map(function(x) {
		var a = new Othello(that.dims.join('x'))
		a.t_weights = that.t_weights
		a.barr = a.copy(that.barr)
		a.current = that.current
		a.move(x[0][0], a.players[a.current])
		
		var move_weights = a.moveWeights()
		return Math.max(...move_weights)
	})
}

Othello.prototype.counterMove = function(moves = this.validMoves()) {
	// Plays a move that minimizes the next players move weights
	var move_weights = this.nextMoveMaxWeights(moves)
	var minimum = Math.min(...move_weights)
	var filtered = moves.filter(function(x, i) {return move_weights[i] == minimum})
	this.randomMove(filtered)
}

Othello.prototype.mixedMove = function(moves = this.validMoves()) {
	// Plays a move that maximizes a calculated move weight
	// The calculated move weight is the move weight minus the next move weight
	var move_weights = this.moveWeights(moves)
	var next_move_weights = this.nextMoveMaxWeights(moves)
	var calculated_weights = move_weights.map(function(x, i) {return x - next_move_weights[i]})
	var maximum = Math.max(...calculated_weights)
	var filtered = moves.filter(function(x, i) {return calculated_weights[i] == maximum})
	this.randomMove(filtered)
}

