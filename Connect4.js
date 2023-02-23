import React from "react";

/*
 This is an react Component to play Connect 4 
 Joseph Mak 
*/

const WINCOUNT = 3; // because piece just added counts too
const BOARDHEIGHT = 6;
const BOARDWIDTH = 7;
const cleanBoard = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
];

class Connect4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: cleanBoard,
      playerTurn: 0,
      boardHeight: [0, 0, 0, 0, 0, 0, 0],
      message: "",
      moves: 0,
      gameOver: false,
      winnerCells: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  /* This method handles the column button click. c is the column number*/

  handleClick(c) {
    if (this.state.gameOver) {
      return;
    }
    if (this.state.moves === BOARDHEIGHT * BOARDWIDTH) {
      this.setState({ message: "Game over it is a draw!" });
      return;
    }

    if (this.state.boardHeight[c] === BOARDHEIGHT) {
      this.setState({
        message: "Column " + (c + 1) + " already at top, try again"
      });
      return;
    }

    this.setState({ message: "" });

    // keep track of height
    let boardHeightCopy = this.state.boardHeight;
    let height = boardHeightCopy[c] + 1;
    boardHeightCopy[c] = height;
    //console.log(boardHeightCopy);
    this.setState({ boardHeight: boardHeightCopy });

    // update Board
    let boardCopy = this.state.board;
    //console.log("playerTurn: "+this.state.playerTurn+" column: "+c);

    let r = BOARDHEIGHT - height;
    boardCopy[r][c] = this.state.playerTurn + 1;

    //console.log(this.state.board);
    this.setState({ board: boardCopy });

    this.setState({ moves: this.state.moves + 1 });
    if (this.checkWinner(r, c)) {
      this.setState({
        message: "Game over! " + this.getPlayerName() + " is the winner!",
        gameOver: true
      });
      return;
    }

    // update turn
    if (this.state.playerTurn === 0) this.setState({ playerTurn: 1 });
    else {
      this.setState({ playerTurn: 0 });
    }
  }

  getPlayerName() {
    if (this.state.playerTurn === 0) return "X";
    if (this.state.playerTurn === 1) return "O";
    return this.state.playerTurn;
  }

  getCoordinate(r, c) {
    return "(" + r + "," + c + ")";
  }

  isWinnerCell(r, c) {
    const coordinate = this.getCoordinate(r, c);
    return this.state.winnerCells.includes(coordinate);
  }

  checkWinner(r, c) {
    let board = this.state.board;
    let turn = this.state.playerTurn + 1;
    //    console.log(this.state.playerTurn + " just placed at " + r + " " + c);

    var east = 0,
      west = 0,
      south = 0;
    var southeast = 0,
      southwest = 0,
      northeast = 0,
      northwest = 0;
    var eastcells = [],
      westcells = [],
      southcells = [];
    var southeastcells = [],
      southwestcells = [],
      northeastcells = [],
      northwestcells = [];

    // check east
    let x = c + 1;
    while (x < BOARDWIDTH && board[r][x] === turn) {
      eastcells.push(this.getCoordinate(r, x));
      east++;
      x++;
    }

    // check west
    x = c - 1;
    while (x >= 0 && board[r][x] === turn) {
      westcells.push(this.getCoordinate(r, x));
      west++;
      x--;
    }

    // check south
    let y = r + 1;
    while (y < BOARDHEIGHT && board[y][c] === turn) {
      southcells.push(this.getCoordinate(y, c));
      south++;
      y++;
    }

    // check SE
    x = c + 1;
    y = r + 1;
    while (x < BOARDWIDTH && y < BOARDHEIGHT && board[y][x] === turn) {
      southeastcells.push(this.getCoordinate(y, x));
      southeast++;
      x++;
      y++;
    }

    // check SW
    x = c - 1;
    y = r + 1;
    while (x >= 0 && y < BOARDHEIGHT && board[y][x] === turn) {
      southwestcells.push(this.getCoordinate(y, x));
      southwest++;
      x--;
      y++;
    }

    // check NW
    x = c - 1;
    y = r - 1;
    while (x >= 0 && y >= 0 && board[y][x] === turn) {
      northwestcells.push(this.getCoordinate(y, x));
      northwest++;
      x--;
      y--;
    }

    // check NE
    x = c + 1;
    y = r - 1;
    while (x <= BOARDWIDTH && y >= 0 && board[y][x] === turn) {
      northeastcells.push(this.getCoordinate(y, x));
      northeast++;
      x++;
      y--;
    }

    /*
    console.log(
      "east=" +
        east +
        " west=" +
        west +
        " south=" +
        south +
        " southeast:" +
        southeast +
        " southwest:" +
        southwest +
        " northeast:" +
        northeast +
        " northwest:" +
        northwest
    );
*/
    var winnercells = [];
    winnercells.push(this.getCoordinate(r, c));
    if (south >= WINCOUNT) {
      winnercells.push(...southcells);
    }
    if (east + west >= WINCOUNT) {
      winnercells.push(...eastcells);
      winnercells.push(...westcells);
    }
    if (northwest + southeast >= WINCOUNT) {
      winnercells.push(...northwestcells);
      winnercells.push(...southeastcells);
    }
    if (northeast + southwest >= WINCOUNT) {
      winnercells.push(...northeastcells);
      winnercells.push(...southwestcells);
    }
    if (winnercells.length > 1) {
      //  console.log("winner coor: " + winnercells[0]);
      this.setState({ winnerCells: winnercells });
      return true;
    }
    return false;
  }

  render() {
    return (
      <>
        <table border="1">
          <tbody>
            <tr>
              <th>
                <button onClick={(e) => this.handleClick(0)}>1</button>
              </th>
              <th>
                <button onClick={(e) => this.handleClick(1)}>2</button>
              </th>
              <th>
                <button onClick={(e) => this.handleClick(2)}>3</button>
              </th>
              <th>
                <button onClick={(e) => this.handleClick(3)}>4</button>
              </th>
              <th>
                <button onClick={(e) => this.handleClick(4)}>5</button>
              </th>
              <th>
                <button onClick={(e) => this.handleClick(5)}>6</button>
              </th>
              <th>
                <button onClick={(e) => this.handleClick(6)}>7</button>
              </th>
            </tr>
            {this.state.board.map((row, r) => (
              <tr key={r}>
                {row.map((col, c) => (
                  <Cell
                    key={r + "," + c}
                    row={r}
                    col={c}
                    value={this.state.board[r][c]}
                    isWinner={this.isWinnerCell(r, c)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p/>
        Player Turn: {this.getPlayerName()}
        <p />
        Moves made: {this.state.moves}
        <p />
        {this.state.message}
        <p />
      </>
    );
  }
}

/* This is a function component that draws a cell */
function Cell(props) {
  let content = "";
  if (props.value === 0) content = "";
  if (props.value === 1) content = "X";
  if (props.value === 2) content = "O";
  let color = "white";
  if (props.isWinner) color = "pink";
  return (
    <td align="center" height="30" style={{ backgroundColor: color }}>
      {content}
    </td>
  );
}

export default Connect4;
