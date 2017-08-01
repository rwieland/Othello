var GameStats = function() {
	this.stat_str = this.getStats()
	// A string of games played stored in a cookie
	this.data = []
	// An array of game logs
	this.parse()
	// Converts stat_str into data	
	
	this.legend = {
		'0.2': ['Date, AI version, Board shape, Initial board, Move History, Winner, Players']
	}
	// A legend for understanding game logs based on version number
}

GameStats.prototype.write = function(str) {
	this.stat_str += str + '    '
	// Updates this.stat_str with new line of data in str
	var exp = new Date
	this.setStats(this.stat_str)
	// Updates document.cookie with new line of data in str
	this.parse()
	// Updates this.data with new line of data in str
}

GameStats.prototype.parse = function() {
	var lines = this.stat_str.split('    ')
	this.data = lines.map(function(x) {
		return x.split(',')
	})
}

GameStats.prototype.clear = function() {
	document.cookie = "stats="
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
		return e < d && d < s
	})
}

GameStats.prototype.setStats = function(cvalue) {
    var expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
    document.cookie = "stats=" + cvalue + ";" + expires + ";path=/";
}

GameStats.prototype.getStats = function() {
    var name = "stats=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

GameStats.prototype.display = function() {
	var today = new Date()
	var yesterday = new Date()
	var last_week = new Date()
	var last_month = new Date()
	
	yesterday.setDate(yesterday.getDate() - 1)
	last_week.setDate(last_week.getDate() - 7)
	last_month.setDate(last_month.getDate() - 30)
	
	console.log(today, yesterday, last_week, last_month)
}

STATS = new GameStats

