// GLOBAL VARIABLES AND CONSTANTS:
var DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
var PLAYERS = ['B', 'W'];
var CURRENT = 0; // The current player.
var BOARD = [];
var POSITIONS = [];
var COUNT = []; // Token count
var COLORS = {'B': 'black', 'W': 'white'}
var TURN_HISTORY = []

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

// Sets directions for n dimensions
function setDirections(n) {
	var d = new Array(3)
	for (var i = 1; i < n; i++) {
		d = new Array(3).fill(d)
	}
	d = indices(d).map(function(x) {return x.map(function(y) {return y - 1})})
	return DIRECTIONS = d.filter(function(x) {return !x.every(function(y) {return y == 0})}) 
}

// Sets BOARD to standard starting positions.
// TODO: UPDATE FOR N DIMENSIONS
function newBoard(arr = STANDARD_BOARD) {
	BOARD = copyArray(arr)
	POSITIONS = indices(BOARD)
	return BOARD
}

// Logs the BOARD in the console.
// TODO: UPDATE FOR N DIMENSIONS
function consoleLogBoard(arr = BOARD) {
	console.log('  0 1 2 3 4 5 6 7')
	arr.map(function(x, i) {console.log(i + '|' + x.join('|') + '|')})
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
// TODO: UPDATE FOR N DIMENSIONS
function move(position, player) {
	validMove(position, player).map(function(x) {
		x.map(function(y) {
			BOARD[y[0]][y[1]] = player
		})
	})
}

// Cycles to the next player.
function nextPlayer() {
	return CURRENT < PLAYERS.length - 1 ? CURRENT += 1 : CURRENT = 0
}

// Returns a count of tokens by PLAYERS on the BOARD.
// TODO: UPDATE FOR N DIMENSIONS
function tokenCount() {
	var merged = [].concat.apply([], BOARD) //
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
// TODO: UPDATE FOR N DIMENSIONS
function start() {
	GAME_OPTIONS.style.display = 'none'
	newBoard()
	drawBoard()
	TURN_HISTORY = [[copyArray(BOARD), CURRENT]]
	turn()	
}

// Gets selected options.
function opt(x) {
	var e = document.getElementById(x)
	return e.options[e.selectedIndex].value
}

// Converts a position to an html selection.
// TODO: UPDATE FOR N DIMENSIONS
function toSel(position) {
	return document.getElementById(`t${position[0]}${position[1]}`)
}

// Converts a selected id to a position.
// TODO: UPDATE FOR N DIMENSIONS
function toPos(sel) {
	return sel.id.split('').slice(1).map(function(x) {return parseInt(x)})
}

// Draws the state of the BOARD.
// TODO: UPDATE FOR N DIMENSIONS
function drawBoard(arr = BOARD) {
	clearBoard()
	scoreboard()
	GAME.style.backgroundColor = 'black'
	var game = document.querySelector('#game')
	for (var i = 0; i < arr.length; i++) {
		var row = document.createElement('div')
		row.className = 'row'
		for (var j = 0; j < arr[i].length; j++) {
			var tile_border = document.createElement('div')
			var tile = document.createElement('div')
			tile_border.className = 'tile-border'
			tile.className = 'tile'
			tile.id = `t${i}${j}`
			if (readBoard([i,j], arr) != ' ') {
				var token = document.createElement('div')
				token.className = 'token'
				token.style.background = COLORS[readBoard([i,j], arr)]
				tile.appendChild(token)
			}
			tile_border.appendChild(tile)
			row.appendChild(tile_border)	
		}
		game.appendChild(row)
	}
}

// Displays current scores.
function scoreboard() {
	var scoreboard = document.getElementById('scoreboard').firstChild
	scoreboard.innerHTML = `B: ${tokenCount()[0]} W: ${tokenCount()[1]}`	
}

// Clears the board from #game.
function clearBoard() {
	var previous_board = document.querySelectorAll('.row')
	for (var n = 0; n < previous_board.length; n++) {
		previous_board[n].remove()
	}
}

// Cycles functions until a winner is declared.
// TODO: UPDATE FOR N DIMENSIONS
function turn() {
	if (winner() !== false) { // If there is a winner
		winDisplay()
	} else if (validMoves(PLAYERS[CURRENT])) { // If the current player can make a move.
		if (opt('players') == '2' || opt('human') == CURRENT.toString()) { // If it is a humans turn.
			validMoves(PLAYERS[CURRENT]).map(function(x) {
				if (opt('highlight') == 1) {
					addHighlighting(x[0][0], 'yellow')
				}
				toSel(x[0][0]).addEventListener('click', function(event) {
					move(toPos(event.target), PLAYERS[CURRENT])
					drawBoard()
					nextPlayer()
					TURN_HISTORY.push([copyArray(BOARD), CURRENT])
					turn()
				})
			})
		} else { // If it is the AIs turn
			switch(opt('ai')) {
				case '0':
					randomMove()
					break
				case '1':
					mostTokensMove()
					break
			}			
		}
	} else { // If the current player cannot make a move but there is no winner.
		nextPlayer()
		TURN_HISTORY.push([copyArray(BOARD), CURRENT])
		turn()
	}
}

// Creates display upon someone winning the game.
function winDisplay() {
	clearBoard()
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

// Console logs the turn history.
// TODO: UPDATE FOR N DIMENSIONS
function consoleLogTurnHistory() {
	TURN_HISTORY.map(function(x) {consoleLogBoard(x[0])})
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
	var turn = 0
	
	first.innerHTML = '<<'
	first.onclick = function() {
		turn = 0
		first.style.display = 'none'
		previous.style.display = 'none'
		next.style.display = ''
		last.style.display = ''
		drawBoard(TURN_HISTORY[turn][0])
	}
	first.style.display = 'none'
	
	previous.innerHTML = '<'
	previous.onclick = function() {
		turn -= 1
		if (turn <= 0) {
			first.style.display = 'none'
			previous.style.display = 'none'
		}
		next.style.display = ''
		last.style.display = ''
		drawBoard(TURN_HISTORY[turn][0])
	}	
	previous.style.display = 'none'
	
	done.innerHTML = 'Done'
	done.onclick = function() {
		winDisplay()
		replay_menu.remove()
	}
	
	next.innerHTML = '>'
	next.onclick = function() {
		turn += 1
		first.style.display = ''
		previous.style.display = ''
		if (turn >= TURN_HISTORY.length - 1) {
			next.style.display = 'none'
			last.style.display = 'none'
		}
		drawBoard(TURN_HISTORY[turn][0])
	}	
	
	last.innerHTML = '>>'
	last.onclick = function() {
		turn = TURN_HISTORY.length - 1
		first.style.display = ''
		previous.style.display = ''
		next.style.display = 'none'
		last.style.display = 'none'
		drawBoard(TURN_HISTORY[turn][0])
	}
	
	drawBoard(TURN_HISTORY[turn][0])
}

// FUNCTIONS FOR DUMB 'AI'

// Selects a random move from a set of moves.
function randomMove(moves = validMoves(PLAYERS[CURRENT]), player = PLAYERS[CURRENT]) {
	var i = Math.floor(Math.random() * moves.length)
	move(moves[i][0][0], player)
	drawBoard()
	moves[i].map(function(x) {
		x.map(function(y) {
			addHighlighting(y, 'pink')
		})
	})
	addHighlighting(moves[i][0][0], 'red')
	nextPlayer()	
	TURN_HISTORY.push([copyArray(BOARD), CURRENT])
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

// TODO: Make prettier interface.
// TODO: Smarter AI.
// TODO: Add more dimensions.
/* FUNCTIONS TO UPDATE FOR N DIMENSIONS:
	- newBoard
	- consoleLogBoard
	- checkBoard
	- readBoard
	- nextInLine
	- move
	- tokenCount
	- start
	- toSel
	- toPos
	- drawBoard
	- turn
	- consoleLogTurnHistory
*/