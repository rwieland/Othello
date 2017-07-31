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

GameStats.prototype.wins = function() {
	
}

GameStats.prototype.statistics = function(player = 'H', arr = this.data) {
	var result = {
		'wins': 0,
		'ties': 0,
		'losses': 0,
		'games with two players': 0,
		'games with no player': 0,
		'unfinished games': 0,
		'games played': 0,
		'total': arr.length
	}
	
	for (var i = 0; i < arr.length; i++) {		
		var leg = this.legend[arr[i][1]][0].split(', ')
		var winner = arr[i][leg.indexOf('Winner')]
		var players = arr[i][leg.indexOf('Players')]
		
		if (!players.split('').some(function(x) {return x == player})) {
			result['games with no player']++
		} else if (players[0] == players[1]) {
			result['games with two players']++	
		} else if (winner == 'F'){
			result['unfinished games']++
		} else {
			result['games played']++		
			if (winner == 'T') {
				result['ties']++
			} else if (players[parseInt(winner)] == player) {
				result['wins']++
			} else {
				result['losses']++
			}
		}		
	}
	return result
}

STATS = new GameStats

