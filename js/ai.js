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
	return moves.map(function(x) {
		return that.weights[`${x[0][0][0]}${x[0][0][1]}`]
	})
}

Othello.prototype.weightedMove = function(moves = this.validMoves()) {
	// Plays the move with the highest move weight
	var move_weights = this.moveWeights(moves)
	var maximum = Math.max(...move_weights)
	var filtered = moves.filter(function(x, i) {return move_weights[i] == maximum})
	console.log(filtered)
	this.randomMove(filtered)
}

Othello.prototype.nextMoveMaxWeights = function(moves = this.validMoves()) {
	// Returns an array of move weights based on what the next player can play
	var that = this
	return moves.map(function(x) {
		var a = new Othello('8x8')
		a.barr = a.copy(that.barr)
		a.current = that.current
		a.move(x[0][0], a.players[a.current])
		
		var move_weights = a.moveWeights()
		return Math.max(...move_weights)
	})
}

Othello.prototype.counterMove = function(moves = this.validMoves()) {
	// Plays a move that minimizes the next players move weights
	var move_weights = this.nextMoveMaxWeights()
	var minimum = Math.min(...move_weights)
	var filtered = moves.filter(function(x, i) {return move_weights[i] == minimum})
	console.log(filtered)
	this.randomMove(filtered)
}

