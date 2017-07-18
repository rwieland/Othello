var toggleAIOptions = function() {
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

function simulateOthello(n, ai1, ai2, str = '8x8') {
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

