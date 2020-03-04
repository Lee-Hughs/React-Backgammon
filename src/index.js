import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Game extends React.Component {
	constructor(props) {
		super(props);
		let squares = [];
		squares.push(["b",null,"b",null,"b",null,"b",null]);
		squares.push([null,"b",null,"b",null,"b",null,"b"]);
		squares.push(["b",null,"b",null,"b",null,"b",null]);

		squares.push([null, null, null, null, null, null, null, null]);
		squares.push([null, null, null, null, null, null, null, null]);
		
		squares.push([null,"r",null,"r",null,"r",null,"r"]);
		squares.push(["r",null,"r",null,"r",null,"r",null]);
		squares.push([null,"r",null,"r",null,"r",null,"r"]);

		this.state= {
			squares: squares,
			stepNumber: 0,
			player: 'Rr',
			moveFrom: [-1,-1],
			winner: null
		};
	}
}



// ===================

ReactDOM.render(
	<Game />,
	document.getElementById("root")
);

