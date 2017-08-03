var GameStats = function() {
	
	this.stat_str = localStorage.getItem('stat_str')
	// A string of games played stored in localStorage
	if (this.stat_str == null) {
		this.data = []
	} else {
		this.parse()
	}
	// Converts stat_str into data	if there is data in stat_str
	this.legend = {
		'0.2': ['Date, AI version, Board shape, Initial board, Move History, Winner, Players']
	}
	// A legend for understanding game logs based on version number
}

GameStats.prototype.write = function(str) {
	if (this.stat_str == null) {
		stat_str = str
	} else {
		this.stat_str += '    ' + str
	}	
	// Updates this.stat_str with new line of data in str
	var exp = new Date
	localStorage.setItem('stat_str', this.stat_str)
	// Updates localStorage with new line of data in str
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
	localStorage.removeItem('stat_str')
	this.stat_str = null
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

GameStats.prototype.display = function() {
	document.getElementById('main-menu').classList.toggle('hide')
	
	stats_display = document.createElement('div')
	stats_display.setAttribute('class', 'game-overlay')
	title = document.createElement('h2')
	stats_table = document.createElement('table')
	clear_button = document.createElement('button')
	return_button = document.createElement('button')
	
	stats_display.appendChild(title)
	stats_display.appendChild(stats_table)
	stats_display.appendChild(clear_button)
	stats_display.appendChild(return_button)
	stats_display.id = 'stats-display'
	
	title.innerHTML = 'Game Statistics'
	
	stats_table.style.width = '100%'
	
	var today = new Date()
	var yesterday = new Date()
	var last_week = new Date()
	var last_month = new Date()
	
	var row_dates = [
		yesterday.setDate(yesterday.getDate() - 1),
		last_week.setDate(last_week.getDate() - 7),
		last_month.setDate(last_month.getDate() - 30),
		new Date(0)
	]
	
	var row_labels = [
		'Past Day',
		'Past Week',
		'Past Month',
		'All Time'
	]
	
	var col_labels = [
		'',
		'Wins',
		'Losses',
		'Ties',
		'Total',
		'Win %'
	]
	
	var top_row = document.createElement('tr')
	for (i = 0; i < col_labels.length; i++) {
		var entry = document.createElement('th')
		entry.innerHTML = col_labels[i]
		top_row.appendChild(entry)
	}
	stats_table.appendChild(top_row)
	
	
	for (i = 0; i < row_dates.length; i++) {
		stats_table.appendChild(this.newStatsRow(row_dates[i], row_labels[i]))
	}
	
	var that = this
	
	clear_button.innerHTML = 'Clear Statistics'
	clear_button.onclick = function() {
		that.clear()
		document.getElementById('main-menu').classList.toggle('hide')
		stats_display.remove()
		alert('Statistics cleared')
	}
	
	return_button.innerHTML = 'Back'
	return_button.onclick = function() {
		document.getElementById('main-menu').classList.toggle('hide')
		stats_display.remove()
	}
	
	document.getElementById('game').appendChild(stats_display)
}

GameStats.prototype.newStatsRow = function(end_date, label) {
	var stats = this.statistics('H', this.dateFilter(end_date))
	var row = document.createElement('tr')

	var displayStats = [
		label,
		stats['wins'],
		stats['ties'],
		stats['losses'],
		stats['1 player games played'],
		Math.floor(stats['wins'] / stats['1 player games played'] * 100)
	]

	displayStats.forEach(function(x){
		var entry = document.createElement('td')
		entry.innerHTML = x
		row.appendChild(entry)
	})
	
	return row
}

STATS = new GameStats

