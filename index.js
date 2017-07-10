// GLOBAL VARIABLES AND CONSTANTS:
var DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
var PLAYERS = ['B', 'W'];
var CURRENT = 0; // The current player.
var BOARD = [];
var POSITIONS = [];
var COUNT = []; // Token count
var COLORS = {'B': 'black', 'W': 'white'};
var TURN_HISTORY = [];
var DISPLAY_DIMENSIONS = ['x', 'y'];
var LAST_AI_MOVES = [];
var TURN_COUNT = 0;
var CORNERS = [];

const STANDARD_BOARD = [
	new Array(8).fill(' '),
	new Array(8).fill(' '),
	new Array(8).fill(' '),
	[' ', ' ', ' ', 'W', 'B', ' ', ' ', ' '],
	[' ', ' ', ' ', 'B', 'W', ' ', ' ', ' '],
	new Array(8).fill(' '),
	new Array(8).fill(' '),
	new Array(8).fill(' ')		
];

const BLACK_BOARD = [
	new Array(8).fill('B'),
	new Array(8).fill('B'),
	new Array(8).fill('B'),
	new Array(8).fill('B'),
	new Array(8).fill('B'),
	new Array(8).fill('B'),
	new Array(8).fill('B'),
	new Array(8).fill('B')
];

const TIE_BOARD = [
	new Array(8).fill('B'),
	new Array(8).fill('B'),
	new Array(8).fill('B'),
	new Array(8).fill('B'),
	new Array(8).fill('W'),
	new Array(8).fill('W'),
	new Array(8).fill('W'),
	new Array(8).fill('W')
];

const GAME_OPTIONS = document.getElementById('game-options')
const GAME = document.getElementById('game')

// FUNCTIONS FOR MANAGING THE GAME:

// Returns an array of arrays of indices for all elements in arr1.
// Used to find all positions on board.
function indices(arr1, arr2 = []) {
	var result = []
	for (var i = 0; i < arr1.length; i++) {
		if (Array.isArray(arr1[i])) {
			indices(arr1[i], arr2.concat([i])).map(function(x) {result.push(x)})
		} else {
			result.push(arr2.concat([i]))
		}
	}
	return result
}

// Returns a copy of an array
function copyArray(arr) {
	return arr.map(function(x) {
		return Array.isArray(x) ? copyArray(x) : x
	})
}


// Updates an array at a position to a value.
function updatePosition(arr, position, value) {
	return arr.map(function(x, i) {
		return i == position[0] ? Array.isArray(x) ? updatePosition(x, position.slice(1), value) : value : x
	})
}

// Sets directions for n dimensions
function setDirections(n) {
	var d = new Array(3)
	for (var i = 1; i < n; i++) {
		d = new Array(3).fill(d)
	}
	d = indices(d).map(function(x) {return x.map(function(y) {return y - 1})})
	return DIRECTIONS = d.filter(function(x) {return !x.every(function(y) {return y == 0})}) 
}

function setCorners(arr) {
	return [].concat(...[0, arr.length - 1].map(function(x) {
		if (Array.isArray(arr[x])) {
			return setCorners(arr[x]).map(function(y) {
				return [].concat([x], y)
			})
		} else {
			return [[x]]
		}
	}))
}

// Sets BOARD to standard starting positions.
function newBoard(n = 2) {
	BOARD = new Array(8).fill(' ') // Preliminary determination of board shape to set POSITIONS.
	var c = 1
	while (c < n) {
		BOARD = new Array(8).fill(copyArray(BOARD))
		c++
	}
	POSITIONS = indices(BOARD)
	POSITIONS.forEach(function(x) {
		if (x.every(function(y) {return y == 3 || y == 4})) { // If a position should have a token.
			var i = x.reduce(function(a, b) { // Determines if a position should be W or B.
				return b == 4 ? a + 1 : a			
			}, 0)
			i % 2 == 0 ? BOARD = updatePosition(BOARD, x, 'B') : BOARD = updatePosition(BOARD, x, 'W')
		}
	})
	
	setDirections(n)
	DISPLAY_DIMENSIONS = ['x', 'y'].concat(new Array(n - 2).fill(3)) // Set display dimensions to work for n dimensions
	return BOARD
}

// Converts an n dimensional board to two dimensions for display.
function toTwoDimensions(arr, disp) {
	var row_index = disp.indexOf('x')
	var column_index = disp.indexOf('y')
	var filtered_indices = indices(arr).filter(function(x) { // Filters indices into desired dimensions
		return x.every(function(y, i) {
			return !Number.isInteger(disp[i]) || y == disp[i]
		})
	})
	
	var result = []
	for (var i = 0; i < 8; i++) { // Sorts filtered indices into a 2d array.
		var row = filtered_indices.filter(function(x) {
			return x[row_index] == i
		})
		row.sort(function(a, b) {return a[column_index] - b[column_index]})
		result.push(row)
	}
	return result
}

// Logs the BOARD in the console.
function consoleLogBoard(arr, disp) {
	narr = toTwoDimensions(arr, disp).map(function(x) {return x.map(function(y) {return readBoard(y, arr)})}) // Translates index to value
	console.log('  0 1 2 3 4 5 6 7')
	narr.map(function(x, i) {console.log(i + '|' + x.join('|') + '|')})
}

// Returns a position if it is on the BOARD.
function checkBoard(position, arr = BOARD) {
	var x = arr[position[0]]
	return x == undefined ? false : Array.isArray(x) ? checkBoard(position.slice(1), x) ? position : false : position
}

// Returns the value at a BOARD position if it exists.
function readBoard(position, arr = BOARD) {
	var x = arr[position[0]]
	return x == undefined ? false : Array.isArray(x) ? readBoard(position.slice(1), x) : x
}

// Returns the next position in a certain direction.
function nextInLine(position, direction, arr = BOARD) {	
	return checkBoard(position.map(function(x,i) {return x + direction[i]}), arr)
}

// Returns a row if it is valid for user input.
function validRow(position, direction, player) {
	var next = nextInLine(position, direction)
	var next_is = readBoard(next)
	if (readBoard(position) == ' ' && next_is != ' ' && next_is != false && next_is != player) {
		var row = [copyArray(position), copyArray(next)]
		var valid = function() {
			next = nextInLine(next, direction)
			if (readBoard(next) == false || readBoard(next) == ' ') {
				return false
			} else if (readBoard(next) == player) {
				return row
			} else {
				row.push(copyArray(next))
				return valid()
			}
		}
		return valid()
	} else {
		return false
	}
}

// Checks if a player can play a certain position.
function validMove(position, player) {
	if (readBoard(position) != ' ') {
		return false
	} else {
		var moves = DIRECTIONS.map(function(direction) {
			return validRow(position, direction, player)
		})
		return moves.every(function(x) {return x == false}) ? false : moves.filter(function(x) {return x != false &&  x != undefined})
	}
}

// Finds all valid moves for a certain player.
function validMoves(player) {
	var moves = POSITIONS.map(function(position) {
		return validMove(position, player)
	})
	return moves.every(function(x) {return x == false}) ? false : moves.filter(function(x) {return x != false &&  x != undefined})
}

// Executes a move by the CURRENT at a certain position.
function move(position, player) {
	validMove(position, player).forEach(function(x) {
		x.forEach(function(y) {
			BOARD = updatePosition(BOARD, y, player)
		})
	})
}

// Cycles to the next player.
function nextPlayer() {
	return CURRENT < PLAYERS.length - 1 ? CURRENT += 1 : CURRENT = 0
}

// Returns a count of tokens by PLAYERS on the BOARD.
function tokenCount(arr = BOARD) {
	var merged = arr.join().split(',') //
	COUNT = PLAYERS.map(function(player) {
		var count = 0;
		for (var i = 0; i < merged.length; i++) {
			if (merged[i] == player) {
				count += 1
			}
		}
		return count
	})
	return COUNT
}

// Returns the winner if there is one.
function winner() {
	return !PLAYERS.every(function(x) {return validMoves(x) == false}) ? false:
		tokenCount()[0] == COUNT[1] ? 'T' : COUNT.indexOf(Math.max.apply(null, COUNT))	
}

// FUNCTIONS FOR DISPLAY AND USER INPUT:
// Starts game
function start() {
	var dim = parseInt(document.getElementById('dimensions-option').value, 10)
	if (isNaN(dim) || dim < 2) {
		alert('There must be at least two dimensions')
	} else {
		GAME_OPTIONS.style.display = 'none'
		CURRENT = 0
		newBoard(dim)
		drawBoard()
		CORNERS = setCorners(BOARD)
		TURN_HISTORY = [[copyArray(BOARD), CURRENT]]
		turn()
		if (dim > 2) {
			changeViewPlane(dim)
		}
	}
}

// Sets up interface for changing the view plane.
function changeViewPlane(dim) {
	var container = document.createElement('div')
	var menu = document.createElement('ul')
	var go_button = document.createElement('button')
	container.appendChild(menu)
	container.appendChild(go_button)
	document.body.appendChild(container)
	
	container.id = 'plane-navigation'
	
	for (var i = 0; i < dim; i++) {
		var list_element = document.createElement('li')
		var box = document.createElement('textarea')
		var x = DISPLAY_DIMENSIONS[i]
		
		box.value = isNaN(parseInt(x)) ? x : parseInt(x) + 1
		box.id = 'd' + (i + 1)
		box.rows = 1
		box.cols = 3
		list_element.innerHTML = 'D' + (i + 1) + ': '
		
		list_element.appendChild(box)
		menu.appendChild(list_element)
	}

	go_button.innerHTML = 'Go'
	go_button.addEventListener('click', function(event) {
		var input_plane = []
		var text_areas = menu.querySelectorAll('textarea')
		text_areas.forEach(function(x) {input_plane.push(x.value)})
		
		var x_found = false
		var y_found = false
		var valid_input = true
		input_plane.forEach(function(i) {
			if (i == 'x') {
				x_found ? valid_input = false : x_found = true
			} else if (i == 'y') {
				y_found ? valid_input = false : y_found = true
			} else if (isNaN(parseInt(i)) || parseInt(i) > 8 || parseInt(i) < 1) {
				valid_input = false 
			}
		})	
		
		if (valid_input) {
			DISPLAY_DIMENSIONS = input_plane.map(function(x) {
				return isNaN(parseInt(x)) ? x : parseInt(x) - 1
			})
			drawBoard()
			turn()
			if (opt('players') == 1) {
				highlightLastAIMoves()
			}
		} else {
			alert('Invalid Input: One value should be "x". One value shoud be "y". The rest should be between 1 and 8')
			DISPLAY_DIMENSIONS.map(function(x, i) {
				isNaN(parseInt(x)) ? text_areas[i].value = x : text_areas[i].value = parseInt(x) + 1
			})
		}
	})
}

// Gets selected options.
function opt(x) {
	var e = document.getElementById(x)
	return e.options[e.selectedIndex].value
}

// Converts a position to an html selection.
function toSel(position) {
	return document.getElementById('t' + position.join(''))
}

// Converts a selected id to a position.
function toPos(sel) {
	return sel.id.split('').slice(1).map(function(x) {return parseInt(x)})
}

// Draws the state of the BOARD.
function drawBoard(arr = BOARD, dim = DISPLAY_DIMENSIONS) {
	clearBoard()
	scoreboard(arr)
	GAME.style.backgroundColor = 'black'
	var display_board = toTwoDimensions(arr, dim)
	var game = document.querySelector('#game')
	display_board.forEach(function(x) {
		var row = document.createElement('div')
		row.className = 'row'
		x.forEach(function(y) {
			var tile_border = document.createElement('div')
			var tile = document.createElement('div')
			tile_border.className = 'tile-border'
			tile.className = 'tile'
			tile.id = 't' + y.join('')
			if (readBoard(y, arr) != ' ') {
				var token = document.createElement('div')
				token.className = 'token'
				token.style.background = COLORS[readBoard(y, arr)]
				tile.appendChild(token)
			}
			tile_border.appendChild(tile)
			row.appendChild(tile_border)	
		})
		game.appendChild(row)
	})
}

// Displays current scores.
function scoreboard(arr = BOARD) {
	var scoreboard = document.getElementById('scoreboard').firstChild
	scoreboard.innerHTML = `B: ${tokenCount(arr)[0]} W: ${tokenCount(arr)[1]}<br>Turn: ${TURN_COUNT + 1}`	
}

// Clears the board from #game.
function clearBoard() {
	var previous_board = document.querySelectorAll('.row')
	for (var n = 0; n < previous_board.length; n++) {
		previous_board[n].remove()
	}
}

// Cycles functions until a winner is declared.
function turn() {
	TURN_COUNT += 1
	if (winner() !== false) { // If there is a winner
		winDisplay()
	} else if (validMoves(PLAYERS[CURRENT])) { // If the current player can make a move.
		if (opt('players') == '2' || opt('human') == CURRENT.toString()) { // If it is a humans turn.
			validMoves(PLAYERS[CURRENT]).forEach(function(x) {				
				if (toSel(x[0][0])) {
					if (opt('highlight') == 1) {
						addHighlighting(x[0][0], 'yellow')
					}
					toSel(x[0][0]).addEventListener('click', function(event) {
						move(toPos(event.target), PLAYERS[CURRENT])
						drawBoard()
						TURN_HISTORY.push([copyArray(BOARD), CURRENT, toPos(event.target)])
						nextPlayer()						
						turn()
					})
				}
			})
		} else { // If it is the AIs turn
			switch(opt('ai')) {
				case '0':
					randomMove()
					break
				case '1':
					mostTokensMove()
					break
				case '2':
					strategicMove()
			}			
		}
	} else { // If the current player cannot make a move but there is no winner.
		nextPlayer()
		turn()
	}
}

// Creates display upon someone winning the game.
function winDisplay() {
	clearBoard()
	var plane_navigation = document.getElementById('plane-navigation')
	plane_navigation ? plane_navigation.remove() : null
	win_display = document.createElement('div')
	win_display.setAttribute('class', 'game-overlay')
	message = document.createElement('h2')
	reset_button = document.createElement('button')
	replay_button = document.createElement('button')
	win_display.appendChild(message)
	win_display.appendChild(reset_button)
	win_display.appendChild(replay_button)
	
	if (winner() == "T") {
		message.innerHTML = 'Tie'
	} else if (PLAYERS[winner()] == 'B') {
		message.innerHTML = 'Black Wins'
	} else if (PLAYERS[winner()] == 'W') {
		message.innerHTML = 'White Wins'
	} else {
		message.innerHTML = 'Indecisive'
	}
	
	reset_button.innerHTML = 'New Game'
	reset_button.onclick = function() {
		GAME_OPTIONS.style.display = ''
		win_display.remove()
	}
	
	replay_button.innerHTML = 'View Game'
	replay_button.onclick = function() {
		replay()
		win_display.remove()
	}
	
	GAME.style.backgroundColor = 'gray'
	GAME.appendChild(win_display)
}

// Undoes the most recent turn.
function undoTurn() {
	TURN_HISTORY.pop()
	BOARD = TURN_HISTORY[TURN_HISTORY.length - 1][0]
	CURRENT = TURN_HISTORY[TURN_HISTORY.length - 1][1]
	drawBoard()
	turn()
}

// Highlights tiles a color.
function addHighlighting(position, color) {
	toSel(position).style.background = color
}

// Highlights the move that the AI last played and what pieces were turned.
function highlightLastAIMoves() {
	LAST_AI_MOVES.forEach(function(x, i) {
		x.forEach(function(y, j) {
			if (toSel(y)) {
				i == 0 && j == 0 ? addHighlighting(y, 'red') : addHighlighting(y, 'pink')
			}
		})
	})
}

// Console logs the turn history.
// TODO: UPDATE FOR N DIMENSIONS
function consoleLogTurnHistory(disp = DISPLAY_DIMENSIONS) {
	TURN_HISTORY.forEach(function(x) {consoleLogBoard(x[0], disp)})
}


function replay() {
	var replay_menu = document.createElement('div')
	var first = document.createElement('button')
	var previous = document.createElement('button')
	var done = document.createElement('button')
	var next = document.createElement('button')
	var last = document.createElement('button')
	
	document.body.appendChild(replay_menu)
	replay_menu.appendChild(first)
	replay_menu.appendChild(previous)
	replay_menu.appendChild(done)
	replay_menu.appendChild(next)
	replay_menu.appendChild(last)
	
	replay_menu.style.textAlign = 'center'
	TURN_COUNT = 0
	
	first.innerHTML = '<<'
	first.onclick = function() {
		TURN_COUNT = 0
		drawBoard(TURN_HISTORY[TURN_COUNT][0])
	}
	
	previous.innerHTML = '<'
	previous.onclick = function() {
		if (TURN_COUNT > 0) {
			TURN_COUNT -= 1
		}
		drawBoard(TURN_HISTORY[TURN_COUNT][0])
	}
	
	done.innerHTML = 'Done'
	done.onclick = function() {
		winDisplay()
		replay_menu.remove()
	}
	
	next.innerHTML = '>'
	next.onclick = function() {
		if (TURN_COUNT < TURN_HISTORY.length - 1) {
			TURN_COUNT += 1
		}
		drawBoard(TURN_HISTORY[TURN_COUNT][0])
	}	
	
	last.innerHTML = '>>'
	last.onclick = function() {
		TURN_COUNT = TURN_HISTORY.length - 1
		drawBoard(TURN_HISTORY[TURN_COUNT][0])
	}
	
	drawBoard(TURN_HISTORY[TURN_COUNT][0])
	if (DISPLAY_DIMENSIONS.length > 2) {
		changeViewPlane(DISPLAY_DIMENSIONS.length)
	}
}

// FUNCTIONS FOR DUMB 'AI'

// Selects a random move from a set of moves.
function randomMove(moves = validMoves(PLAYERS[CURRENT]), player = PLAYERS[CURRENT]) {
	var i = Math.floor(Math.random() * moves.length)
	move(moves[i][0][0], player)
	drawBoard()
	LAST_AI_MOVES = moves[i]
	highlightLastAIMoves()
	TURN_HISTORY.push([copyArray(BOARD), CURRENT, moves[i][0][0]])
	nextPlayer()
	turn()
}

// Selects the moves from a set of moves that net the most tokens.
// Selects a random move from the selected set.
function mostTokensMove(moves = validMoves(PLAYERS[CURRENT]), player = PLAYERS[CURRENT]) {
	var net_tokens = moves.map(function(x) {
		var tokens = 1 - x.length
		x.map(function(y) {
			tokens += y.length
		})
		return tokens
	})
	
	var max_tokens = Math.max.apply(null, net_tokens)
	var max_moves = moves.filter(function(x,i) {
		return net_tokens[i] === max_tokens
	})
	randomMove(max_moves, player)
}

// AI takes corners when available.
function strategicMove(moves = validMoves(PLAYERS[CURRENT]), player = PLAYERS[CURRENT]) {
	var corner_moves = moves.filter(function(position) {
		return CORNERS.some(function(corner) {
			return corner.every(function(x, i) {
				return x == position[0][0][i]
			})
		})
	})
	
	if (corner_moves[0]) {
		return mostTokensMove(corner_moves, player)
	}
	
	mostTokensMove(moves, player)
}

// Hides AI options from the options menu when playing 2 player.
function hideOptions() {
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

function shortLog() {
	return TURN_HISTORY.slice(1).map(function(x) {return x.slice(1)}).join().split(',').join('')
}
