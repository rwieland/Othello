// GLOBAL VARIABLES:
var DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0]]
var PLAYER_LIST = ['B', 'W']
var CURRENT_PLAYER = 0
var BOARD = []

// FUNCTIONS FOR MANAGING THE GAME:
// Sets BOARD to standard starting positions.
function createNewBoard() {
	BOARD = [
		new Array(8).fill(' '),
		new Array(8).fill(' '),
		new Array(8).fill(' '),
		[' ', ' ', ' ', 'W', 'B', ' ', ' ', ' '],
		[' ', ' ', ' ', 'B', 'W', ' ', ' ', ' '],
		new Array(8).fill(' '),
		new Array(8).fill(' '),
		new Array(8).fill(' ')		
	]
	return BOARD
}

// Returns the next position in a certain direction.
function nextInLine(position, direction) {
	
}

// Returns a row if it is valid for user input.
// Defaults to CURRENT_PLAYER.
function validRow(position, direction, player = CURRENT_PLAYER) {
	
}

// Checks if a player can play a certain position.
// Defaults to CURRENT_PLAYER.
function validMove(position, player = CURRENT_PLAYER) {

}

// Finds all valid moves for a certain player.
// Defaults to CURRENT_PLAYER.
function validMoves(player = CURRENT_PLAYER) {
	
}

// Executes a move by the CURRENT_PLAYER at a certain position.
function move(position) {
	
}

// Cycles to next player.
function nextPlayer() {
	return CURRENT_PLAYER < PLAYER_LIST.length - 1 ? CURRENT_PLAYER += 1 : CURRENT_PLAYER = 0
}

// Returns a count of tokens by type on the board.
function tokenCount() {
	
}

// Returns the winner if there is one.
function winner() {
	
}

// Cycles functions until a winner is declared.
function play() {
	
}

// FUNCTIONS FOR DISPLAY AND USER INPUT:
// TODO: Add functions for game display and user input.
