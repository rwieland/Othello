var newGame = function() {
	var dims = document.getElementById('dimensions-option')
	var x = new Othello(dims.value)
	x.start()
}

var toggleAIOptions = function() {
	// Toggles displayed options based on the number of players selected
	var ai = document.getElementById('ai').parentElement
	var human = document.getElementById('human').parentElement
	if (opt('players') == '1') {
		ai.style.display = ''
		human.style.display = ''
	} else {
		ai.style.display = 'none'
		human.style.display = 'none'
	}
}

var simulateOthello = function(n, ai1, ai2, str = '8x8') {
	// Simulates n games with ai's 1 and 2 on a board str
	var c = 0
	while (c < n) {
		var x = new Othello(str)
		x.players = [ai1, ai2]
		x.sim = true
		x.play()
		x.log()
		c++
	}
}

