import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
	constructor(props) {
		super(props);
		let board = [
				["b", "b"],
				[],
				[],
				[],
				[],
				["a","a","a","a","a"],
				[],
				["a","a","a"],
				[],
				[],
				[],
				["b","b","b","b","b"],
				["a","a","a","a","a"],
				[],
				[],
				[],
				["b","b","b"],
				[],
				["b","b","b","b","b"],
				[],
				[],
				[],
				[],
				["a","a"]
			];
		let bar = [0,0];
		let dice = [0,0];
		this.state = {
			board: board,
			hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
			selPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
			bar: bar,
			dice: dice,
			moves: [],
			stepNumber: 0,
			player: true,
			moveFrom: -1,
			message: "",
			winner: null
		};
	}
	handleClick(src, callback=this.fetchAi.bind(this)) {
		console.log(src);
		//make sure it is your turn
		if(!this.state.player) {
			return;
		}
		//if move from has not been selected
		if(this.state.moveFrom === -1) {
			//if you have units on the bar
			if(this.state.bar[0] !== 0) {
				//move pieces off the bar
				if(this.state.hiPoints[src]) {
					console.log("you clicked on a highlighted point");
					//move there
					let newBoard = [];
					let newBar = this.state.bar.slice();
					let newMoves = this.state.moves.slice();
					let newHiPoints = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
					for(let index = 0; index < 24; index++) {
						newBoard.push(this.state.board[index].slice());
					}
					if(newBoard[src].length < 2 || newBoard[src][0] === "b") {
						//move there
						newBoard[src].push("b");
						newBar[0]--;
						if(newBoard[src][0] === "a") {
							newBoard[src].shift();
							newBar[1]++;
						}
						if(src + 1 === newMoves[0]) {
							newMoves.shift();
						}
						else {
							newMoves.pop();
						}
						if(newBar[0] !== 0) {
							for(const move of newMoves) {
								if(newBoard[move-1].length < 2 || newBoard[move-1][0] === "b") {
									newHiPoints[move-1] = true;
								}
							}
							//todo: check that some thing here is true
							if(newHiPoints.includes(true) && newMoves.length > 0) {
								//set new state and continue your turn
								this.setState((state) => {
									return {
										board: newBoard,
										bar: newBar,
										moves: newMoves,
										message: "You rolled " + this.state.dice + "\nYour Moves: " + newMoves,
										hiPoints: newHiPoints
									}
								});
							}
							else {
								this.setState((state) => {
									return {
										board: newBoard,
										bar: newBar,
										moves: [],
										player: false,
										message: "It is the AI's turn now",
										dice: [],
										hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]}
								}, this.fetchAi);
								//console.log("before fetch Ai, line 110");
								//callback();
								return;
							}
						}
						//the bar is now empty
						else {
							if(this.hasValidMove(newMoves, newBoard)) {
								this.setState((state) => {
									return {
										board: newBoard,
										bar: newBar,
										moves: newMoves,
										hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]}
									});
							}
							else {
								this.setState((state) => {
									return {
										board: newBoard,
										bar: newBar,
										moves: [],
										player: false,
										message: "It is now the AI's turn",
										dice: [],
										hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]}
								}, this.fetchAi);
								//console.log("before fetch ai, line 135");
								//callback();
								return;
							}
							return;
						}
					}
					//invalid move, return
					else {
						return;
					}
				}
				//invalid move, return
				return;
			}
			//bar is empty and you are moving one of your pieces on the board
			if(!this.state.board[src].includes("b")) {
				return;
			}
			else {
				//if it is your turn and you selected your piece
				//todo: add check to see if that piece can get off the board, if it can, do that
				if(this.canBoardOff()) {
					//you can board off from this position
					if(Math.max(...this.state.moves) + src > 23) {
						console.log(Math.max(...this.state.moves));
						let newBoard = [];
						let newMoves = this.state.moves.slice();
						for(let index = 0; index < 24; index++) {
							newBoard.push(this.state.board[index].slice());
						}
						//if we need to determine lowest acceptable move to board off
						if(this.state.moves.length > 1) {
							//if the lowest move is valid
							if(Math.min(...newMoves) + src > 23) {
								let move = Math.min(...newMoves);
								console.log(move);
								if(newMoves[0] > newMoves[newMoves.length-1]) {
									newMoves.pop();
								}
								else {
									newMoves.shift();
								}
							}
							else {
								let move = Math.max(...newMoves);
								if(newMoves[0] > newMoves[newMoves.length-1]) {
									newMoves.shift();
								}
								else {
									newMoves.pop();
								}
							}
							newBoard[src].pop();
							if(this.hasValidMove(newMoves, newBoard)) {
								this.setState((state) => {
									return {
										board: newBoard,
										moves: newMoves,
										message: "You moved a piece off the board, good job!\nMoves left: " + newMoves,
										hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]}
									});
							}
							else {
								this.setState((state) => {
									return {
										board: newBoard,
										moves: [],
										player: false,
										message: "You moved a piece off the board, good job! You have no more valid moves. It is now the AI's turn.",
										dice: [],
										hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]}
								}, this.fetchAi);
								//console.log("before fetch ai, line 135");
								//callback();
								return;
							}
							return;
						}
						else {
							newBoard[src].pop();
							this.setState((state) => {
								return {
									board: newBoard,
									moves: [],
									player: false,
									message: "It is now the AI's turn",
									dice: [],
									hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]}
							}, this.fetchAi);
						}
					}
				}
				if(this.state.player && this.state.board[src][0] === "b") {
					let newSelPoints = this.state.selPoints.slice();
					newSelPoints[src] = true;
					let newHiPoints = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
					const validMoves = this.getValidMoves(src);
					for(const move of validMoves) {
						newHiPoints[move] = true;
					}
					this.setState((state) => {
						return {
							hiPoints: newHiPoints,
							selPoints: newSelPoints,
							moveFrom: src}
						});
					
				}
				console.log(src);
			}
		}
		//you have already selected a piece
		else {
			//deselecting the selected piece
			if(src === this.state.moveFrom) {
				this.setState((state) => {
					return {
						selPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
						hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
						moveFrom: -1}
					});
				return;
			}
			else {
				if(this.state.hiPoints[src]) {
					//execute move
					let newBoard = [];
					let newBar = this.state.bar.slice();
					for(let index = 0; index < 24; index++) {
						newBoard.push(this.state.board[index].slice());
					}
					let newMoves = this.state.moves.slice();
					if(src - this.state.moveFrom === newMoves[0]) {
						newMoves.shift();
					}
					else {
						newMoves.pop();
					}
					newBoard[src].push(newBoard[this.state.moveFrom].pop());
					if(newBoard[src][0] == "a") {
						newBoard[src].shift();
						newBar[1]++;
					}
					let newPlayer = this.hasValidMove(newMoves, newBoard) ? true : false;
					let newMessage = !newPlayer ? "It is the AI's turn now" : "You Rolled " + this.state.dice + "\nYour Moves: " + newMoves;
					console.log("New Player: " + newPlayer);
					console.log("New Message: " + newMessage);
					this.setState((state) => {
						return {
							board: newBoard,
							bar: newBar,
							player: newPlayer,
							moves: newMoves,
							selPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
							hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
							moveFrom: -1,
							message: newMessage}
						},this.fetchAi);
					return;
				}
				//deselecting selected piece
				else {
					this.setState((state) => {
						return {
							selPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
							hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
							moveFrom: -1}
						});
					return;
				}
			}
			console.log(this.state);
		}
	}

	handleDice() {
		if(!this.state.player || this.state.moves.length !== 0) {
			return;
		}
		const roll =  [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
		const newMoves = roll[0] === roll[1] ? [roll[0],roll[0],roll[0],roll[0]] : [roll[0], roll[1]];
		if(this.hasValidMove(newMoves, this.state.board)) {
			if(this.state.bar[0] === 0) {
				this.setState((state) => {
					return {dice: roll,
						moves: newMoves,
						message: "You Rolled " + roll + "\nYour Moves: " + newMoves}
				});
			}
			else {
				let newHiPoints = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
				for(const move of newMoves) {
					if(this.state.board[move - 1].length < 2 || this.state.board[move - 1][0] === "b") {
						newHiPoints[move-1] = true;
					}
				}
				this.setState((state) => {
					return {dice: roll,
						moves: newMoves,
						message: "You Rolled " + roll + "\nYour Moves: " + newMoves,
						hiPoints: newHiPoints}
				});
			}
		}
		else {
			//todo: set state and send this to next players move
			this.setState((state) => {
				return {dice: roll,
					moves: [],
					player: false,
					message: "You Rolled " + roll + "\nBut you have no valid moves"}
			});
		}
	}
	fetchAi() {
		console.log("in fetch ai");
		console.log(this.state);
		if(this.state.player) {
			return;
		}
		let api_load = JSON.stringify(this.state);
		fetch('/backgammon_bot/?state=' + api_load)
		.then(res => res.json())
		.then((data) => {
			console.log(data);
			this.setState((state) => {
				return {player: true,
					board: data["board"],
					bar: data["bar"].reverse(),
					moves: [],
					dice: [0,0],
					message: "The AI moved. Now it is your turn"}
				});
		})
        	.catch(console.log);
	}
	render() {
		const board = this.state.board;
		const bar = this.state.bar;
		return(
			<div id="container">
				<div id="bg">
				</div>
				<div className="game">
					<h2>B<span>a</span>ckgam<span>m</span>on</h2>
					<div id="board">
						<Bar bar={this.state.bar} />
						<Board board={this.state.board} hiPoints={this.state.hiPoints} selPoints={this.state.selPoints} onClick={(src) => this.handleClick(src)}/>
						<DiceArea dice={this.state.dice} onClick={() => this.handleDice()} />
					</div>
					<StatArea message={this.state.message} player={this.state.player}/>
				</div>
			</div>
		);
	}
	hasValidMove(dice, board) {
		//give some available moves (dice) check each point [0,23] and check if it includes "b", if it does then run get valid moves on that position, if the length of that is greater than 0, return true
		//first check if you have a piece on the bar, if you do, check to see if you can get off the bar first
		if(this.state.bar[0] === 0) {
			//increment through all points
			for(var index = 0; index < 24; index++) {
				//check if you have a piece on that point
				if(board[index].includes("b")) {
					//iterate through dice
					for(const die of dice) {
						if(index + die > 23) {
							if(this.canBoardOff()) {
								return true;
							}
							continue;
						}
						if(board[index + die].length < 2 || board[index + die][1] === "b") {
							return true;
						}
					}
				}
			}
		}
		else {
			for(const die of dice) {
				if(board[die].length < 2 || board[die][1] === "b") {
					return true;
				}
			}
		}
		return false;
	}
	getValidMoves(src) {
		console.log("src:");
		console.log(src);
		console.log("moves:");
		console.log(this.state.moves);
		let legalMoves = [];
		//if you can board off
		if(this.canBoardOff()) {
			for(const move of this.state.moves) {
				//todo: add boarding off moves and regular moves
				if(move + src > 23) {
					legalMoves.push(24);
				}
				else {
					if(!(this.state.board[move + src].length > 1 && this.state.board[move + src][1] === "a")) {
						legalMoves.push(move + src);
					}
				}
			}	
		}
		else {
			for(const move of this.state.moves) {
				//check move
				if(move + src > 23) {
					continue;
				}
				if(!(this.state.board[move + src].length > 1 && this.state.board[move + src][1] === "a")) {
					legalMoves.push(move + src);
				}
			}
		}
		return legalMoves;
	}

	canBoardOff() {
		if(this.state.bar[0] !== 0) {
			return false;
		}
		for(var index = 0; index < 18; index++) {
			if(this.state.board[index].includes("b")) {
				return false;
			}
		}
		return true;	
	}
}

function Bar(props) {
	return (
		<div id="bar">
			<p>Player Pieces: {props.bar[0]}</p>
			<p>Bot Pieces: {props.bar[1]}</p>
		</div>
	);
}
class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			board : props.board
		};
	}
	renderPoint(i) {
		const pieces = [];
		for(const value of this.props.board[i]) {
			pieces.push(<div className={"piece " + value} onClick={() => this.props.onClick(i)}></div>);
		}
		return(
			<div className={(i > 11 ? "arrow-down" : "arrow-up") + (i % 2 === 0 ? " even" : " odd") + (this.props.hiPoints[i] ? " hiPoint" : "") + (this.props.selPoints[i] ? " selPoint" : "")} onClick={() => this.props.onClick(i)}>
				{pieces}
			</div>
		);
	}
	render() {
		return(
			<div id="playingBoard">
				<div id="leftBin">
					<div className="top-row">
						{this.renderPoint(12)}
						{this.renderPoint(13)}
						{this.renderPoint(14)}
						{this.renderPoint(15)}
						{this.renderPoint(16)}
						{this.renderPoint(17)}
					</div>
					<div className="bottom-row">
						{this.renderPoint(11)}
						{this.renderPoint(10)}
						{this.renderPoint(9)}
						{this.renderPoint(8)}
						{this.renderPoint(7)}
						{this.renderPoint(6)}
					</div>
				</div>
				<div id="middleBar"></div>
				<div id="rightBin">
					<div className="top-row">
						{this.renderPoint(18)}
						{this.renderPoint(19)}
						{this.renderPoint(20)}
						{this.renderPoint(21)}
						{this.renderPoint(22)}
						{this.renderPoint(23)}
					</div>
					<div className="bottom-row">
						{this.renderPoint(5)}
						{this.renderPoint(4)}
						{this.renderPoint(3)}
						{this.renderPoint(2)}
						{this.renderPoint(1)}
						{this.renderPoint(0)}
					</div>
				</div>
			</div>
		);
	}
}

function DiceArea(props) {
	return (
		<div id="diceArea">
			<div className="dice"><p>{props.dice[0]}</p></div>
			<div className="dice"><p>{props.dice[1]}</p></div>
			<button type="button" id="rollButton" onClick={() => props.onClick()}>Roll Dice</button>
		</div>
	);
}

function StatArea(props) {
	return(
		<div className="stats">
			<p>Player: {props.player ? "Your Turn" : "Their Turn"}</p>
			<p>{props.message}</p>
		</div>
	);
}

// ===================

ReactDOM.render(
	<Game />,
	document.getElementById("root")
);

