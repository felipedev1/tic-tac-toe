import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square(props) {
  return (
    <button className={`square ${props.squaresWinner ? 'destaque' : ''}`}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    const won = this.props.sequence &&
      (this.props.sequence[0] === i
        || this.props.sequence[1] === i
        || this.props.sequence[2] === i)

    return (<Square
      squaresWinner={won}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />
    )
  }

  createBoard() {
    let numSquare = 0;
    const board = [];
    for (let a = 0; a < 3; a += 1) {
      const columns = [];
      for (let b = 0; b < 3; b += 1) {
        columns.push(this.renderSquare(numSquare++));
      }
      board.push(<div className="board-row">{columns}</div>);
    }

    return board;
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares).winner || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? "X" : "O"
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }


  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const { winner, squaresWin } = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ?
        'go to move # ' + move :
        'go to game start'
      const atualy = move === this.state.stepNumber ? 'actuality' : ''
      return (
        <li key={move}>
          <button className={`history ${atualy}`}
          onClick={() => this.jumpTo(move)}>
            {desc}
          
          </button>
        </li>
      )
    })

    let status
    let classStatus = ''
    if (winner) {
      classStatus = 'status-win'
      status = 'Winner - ' + winner
    } else if (this.state.stepNumber === 9) {
      classStatus = 'status-draw'
      status = 'Draw'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? "X" : "O")
      classStatus = 'status'
    }
    return (
      <div className="game">
        <div className={`status ${classStatus}`}>
          {status}
        </div>
        <div>
          <div className="game-board">
            <Board
              sequence={squaresWin}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)} />
          </div>
          <div className="game-info">

            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return (
        {
          winner: squares[a],
          squaresWin: lines[i]
        }
      )
    }
  }
  return {
    winner: false,
    squaresWin: null
  };
}