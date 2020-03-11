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
				["a","a"],
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
	handleClick(src) {
		//make sure it is your turn
		if(!this.state.player) {
			return
		}
		//if move from has not been selected
		if(this.state.moveFrom === -1) {
			if(!this.state.board[src].includes("b")) {
				return;
			}
			//if you have units on the bar
			if(this.state.bar[0] !== 0) {
				//move pieces off the bar
				return
			}
			else {
				//if it is your turn and you selected your piece
				if(!this.state.player || this.state.board[src][0] !== "a") {
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
		else {
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
					let newMessage = newMoves.length === 0 ? "It is the AI's turn now" : "You Rolled " + this.state.dice + "\nYour Moves: " + newMoves;
					//todo: add check at end of move to see if more moves exists, if not go to next player
					this.setState((state) => {
						return {
							board: newBoard,
							player: true,
							moves: newMoves,
							selPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
							hiPoints: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
							moveFrom: -1,
							message: newMessage}
						});
					return;
				}
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
		if(this.hasValidMove(newMoves)) {
			this.setState((state) => {
				return {dice: roll,
					moves: newMoves,
					message: "You Rolled " + roll + "\nYour Moves: " + newMoves}
			});
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
	hasValidMove(dice) {
		//give some available moves (dice) check each point [0,23] and check if it includes "b", if it does then run get valid moves on that position, if the length of that is greater than 0, return true
		//first check if you have a piece on the bar, if you do, check to see if you can get off the bar first
		if(this.state.bar[0] === 0) {
			//increment through all points
			for(var index = 0; index < 24; index++) {
				//check if you have a piece on that point
				if(this.state.board[index].includes("b")) {
					//iterate through dice
					for(const die of dice) {
						if(index + die > 23) {
							if(this.canBoardOff()) {
								return true;
							}
							continue;
						}
						if(this.state.board[index + die].length < 2 || this.state.board[index + die][1] === "b") {
							return true;
						}
					}
				}
			}
		}
		else {
			for(const die of dice) {
				if(this.state.board[die].length < 2 || this.state.board[die][1] === "b") {
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
			}	
		}
		else {
			for(const move of this.state.moves) {
				//check move
				console.log(move);
				if(move + src > 23) {
					continue;
				}
				console.log(move + src);
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

