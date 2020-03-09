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
		let bar = [];
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
			moveFrom: [-1,-1],
			message: "",
			winner: null
		};
	}
	handleClick(src) {
		//if move from has not been selected
		if(JSON.stringify(this.state.moveFrom) === JSON.stringify([-1,-1])) {
			//if it is your turn and you selected your piece
			if(!this.state.player || this.state.board[src[0]][0] !== "a")
				return;
			console.log(src);
		}
		else {
			//check that the move is valid, then execute
		}
	}
	hasValidMoves() {
		return true;
	}
	handleDice() {
		if(!this.state.player || this.state.moves.length !== 0) {
			return;
		}
		const roll =  [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
		const newMoves = roll[0] === roll[1] ? [roll[0],roll[0],roll[0],roll[0]] : [roll[0], roll[1]];
		this.setState((state) => {
			return {dice: roll,
				moves: newMoves,
				message: "You Rolled " + roll + "\nYour Moves: " + newMoves}
		});
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
	getValidMoves(src) {

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
		for(const [value,index] of this.props.board[i]) {
			pieces.push(<div className={"piece " + value} onClick={() => this.props.onClick([i, value])}></div>);
		}
		return(
			<div className={(i > 11 ? "arrow-down" : "arrow-up") + (i % 2 === 0 ? " even" : " odd") + (this.props.hiPoints[i] ? " hiPoint" : "") + (this.props.selPoint[i] ? " selPoint" : "")}>
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

