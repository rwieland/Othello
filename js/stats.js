var GameStats = function() {
	this.stat_string = ''
}

GameStats.prototype.write = function(str) {
	this.stat_string += str + '\n'
}