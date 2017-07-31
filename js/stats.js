var GameStats = function() {
	this.stat_str = ''
	this.data = []
}

GameStats.prototype.write = function(str) {
	this.stat_str += str + '\n'
	document.cookie = this.stat_str
	this.parse()
}

GameStats.prototype.parse = function() {
	var lines = this.stat_str.split('\n')
	lines = lines.slice(0, lines.length - 1)
	this.data = lines.map(function(x) {
		return x.split(',')
	})
}

GameStats.prototype.clear = function() {
	document.cookie = ''
	this.stat_str = ''
	this.data = []
}