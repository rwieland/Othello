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

// Sets BOARD to standard starting positions.
function newBoard(arr = STANDARD_BOARD) {
	BOARD = copyArray(arr)
	POSITIONS = indices(BOARD)
	return BOARD
}

// Logs the BOARD in the console.
function consoleLogBoard() {
	console.log('  0 1 2 3 4 5 6 7')
	BOARD.map(function(x, i) {console.log(i + '|' + x.join('|') + '|')})
}

// Returns a position if it is on the BOARD.
function checkBoard(position) {
	return BOARD[position[0]] ? BOARD[position[0]][position[1]] ? position : false : false
}

// Returns the value at a BOARD position if it exists.
function readBoard(position) {
	return checkBoard(position) ? BOARD[position[0]][position[1]] : false
}

// Returns the next position in a certain direction.
function nextInLine(position, direction) {
	return checkBoard([position[0] + direction[0], position[1] + direction[1]])
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
function start() {
	GAME_OPTIONS.style.display = 'none'
	newBoard()
	drawBoard()
	TURN_HISTORY.push([copyArray(BOARD), CURRENT])
	turn()	
}

// Converts a position to an html selection.
function toSel(position) {
	return document.getElementById(`t${position[0]}${position[1]}`)
}

// Converts a selected id to a position.
function toPos(sel) {
	return sel.id.split('').slice(1).map(function(x) {return parseInt(x)})
}

// Draws the state of the BOARD.
function drawBoard() {
	clearBoard()
	for (var i = 0; i < BOARD.length; i++) {
		var row = document.createElement('div')
		row.className = 'row'
		for (var j = 0; j < BOARD[i].length; j++) {
			var tile = document.createElement('div')
			tile.className = 'tile'
			tile.id = `t${i}${j}`
			if (readBoard([i,j]) != ' ') {
				var token = document.createElement('div')
				token.className = 'token'
				token.style.background = COLORS[readBoard([i,j])]
				tile.appendChild(token)
			}
			row.appendChild(tile)
	
		}
		var game = document.querySelector('#game')
		game.appendChild(row)
	}
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
	if (winner() !== false) {
		console.log(winner())
	} else {
		validMoves(PLAYERS[CURRENT]).map(function(x) {
			toSel(x[0][0]).addEventListener('click', function(event) {
				move(toPos(event.target), PLAYERS[CURRENT])
				drawBoard()
				nextPlayer()
				TURN_HISTORY.push([copyArray(BOARD), CURRENT])
				turn()
			})
		})
	}
}

// Undoes the most recent turn.
function undoTurn() {
	TURN_HISTORY.pop()
	BOARD = TURN_HISTORY[TURN_HISTORY.length - 1][0]
	CURRENT = TURN_HISTORY[TURN_HISTORY.length - 1][1]
	drawBoard()
	turn()
}

// Highlights valid tiles.
function addHighlighting() {
	
}

// FUNCTIONS FOR DUMB 'AI'
// TODO: Add functions for dumb 'ai'
