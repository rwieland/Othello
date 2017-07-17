Othello.prototype.randomMove = function(moves = this.validMoves(this.players[this.current])) {
	var i = Math.floor(Math.random() * moves.length)
	this.move(moves[i][0][0], this.players[this.current])
	this.play()
}

// Selects the moves from a set of moves that net the most tokens.
// Selects a random move from the selected set.
Othello.prototype.mostTokensMove = function(moves = this.validMoves(this.players[this.current])) {
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

// AI takes corners when available.
Othello.prototype.strategicMove = function(moves = this.validMoves(this.players[this.current])) {
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

Othello.prototype.weightedMove = function(moves = this.validMoves(this.players[this.current])) {
	var move_weights = moves.map(function(x) {return WEIGHTS[`${x[0][0][0]}${x[0][0][1]}`]})
	var maximum = Math.max(...move_weights)
	var filtered = moves.filter(function(x, i) {move_weights[i] == maximum})
	this.randomMove(filtered)
}

