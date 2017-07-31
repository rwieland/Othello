var GameStats = function() {
	this.stat_str = ''
	this.data = []
	
	this.legend = {
		'0.2': ['Date, AI version, Board shape, Initial board, Move History, Winner, Players']
	}
}

GameStats.prototype.write = function(str) {
	this.stat_str += str + '\n'
	// Updates this.stat_str with new line of data in str
	var exp = new Date
	exp.setYear(exp.getYear() + 5)
	document.cookie = 'stats=' + this.stat_str //+ ';expires=' + exp.toUTCString()
	// Updates document.cookie with new line of data in str
	this.parse()
	// Updates this.data with new line of data in str
}

GameStats.prototype.parse = function() {
	var lines = this.stat_str.split('\n')
	lines = lines.slice(0, lines.length - 1)
	this.data = lines.map(function(x) {
		return x.split(',')
	})
}

GameStats.prototype.clear = function() {
	document.cookie = 'stats='
	this.stat_str = ''
	this.data = []
}

GameStats.prototype.statistics = function(player = 'H', arr = this.data) {
	var result = {
		'wins': 0,
		'wins as player 1': 0,
		'wins as player 2': 0,
		
		'ties': 0,
		'ties as player 1': 0,
		'ties as player 2': 0,
		
		'losses': 0,
		'losses as player 1': 0,
		'losses as player 2': 0,
		
		'1 player games played': 0,
		
		'games with 2 players': 0,
		'ties in 2 player games': 0,
		'player 1 wins in 2 player games': 0,
		
		'games with no player': 0,
		'unfinished games': 0,
		'total': arr.length
	}
	
	for (var i = 0; i < arr.length; i++) {		
		var leg = this.legend[arr[i][1]][0].split(', ')
		var winner = arr[i][leg.indexOf('Winner')]
		var players = arr[i][leg.indexOf('Players')]
		var player_i = players.indexOf(player)
		
		if (!players.split('').some(function(x) {return x == player})) {
			result['games with no player']++
		} else if (players[0] == players[1]) {
			result['games with 2 players']++
			if (winner == 'T') {
				result['ties in 2 player games']++
			} else if (winner == '0') {
				result['player 1 wins in 2 player games']++
			}	
		} else if (winner == 'F'){
			result['unfinished games']++
		} else {
			result['1 player games played']++		
			if (winner == 'T') {
				result['ties']++
				player_i == 0 ? result['ties as player 1']++ : result['ties as player 2']++
			} else if (players[parseInt(winner)] == player) {
				result['wins']++
				winner == '0' ? result['wins as player 1']++ : result['wins as player 2']++
			} else {
				result['losses']++
				winner == '0' ? result['losses as player 2']++ : result['losses as player 1']++
			}
		}		
	}
	return result
}

GameStats.prototype.dateFilter = function(end, start = new Date, arr = this.data) {
	return arr.filter(function(x) {
		var d = new Date(x[0])
		d = Date.parse(d)
		e = Date.parse(end)
		s = Date.parse(start)
		console.log(e, d, s)
		return e < d && d < s
	})
}	

STATS = new GameStats

