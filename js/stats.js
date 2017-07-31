var GameStats = function() {
	this.stat_str = ''
	this.data = []
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

STATS = new GameStats