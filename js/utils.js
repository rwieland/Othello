var newGame = function() {
	// Creates a new game
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

var toggleAdvancedOptions = function() {
	// Toggles the display of advanced options in the options menu
	var ao = document.getElementById('advanced-options')
	// The advanced-options button
	
	var hghl = document.getElementById('highlight').parentElement
	var dims = document.getElementById('dimensions-option').parentElement
	// The advanced options
	
	if (dims.classList == 'hide') {
		ao.innerHTML = 'Hide Advanced Options'
	} else {
		ao.innerHTML = 'Advanced Options'
	}
	
	hghl.classList.toggle('hide')
	dims.classList.toggle('hide')
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

