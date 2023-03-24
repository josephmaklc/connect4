import React, { useState } from 'react';

/*
 This is an react Component to play Connect 4, using Hooks 
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



function Connect4Hook() {

 const [board, setBoard] = useState(cleanBoard);
 const [playerTurn, setPlayerTurn] = useState(0);
 const [boardHeight, setBoardHeight] = useState([0, 0, 0, 0, 0, 0, 0]);
 const [message,setMessage]=useState("");
 const [moves,setMoves]=useState(0);
 const [gameOver,setGameOver]=useState(false);
 const [winnerCells,setWinnerCells]=useState([]); 

  const getPlayerName = () => {
    if (playerTurn === 0) return "X";
    if (playerTurn === 1) return "O";
    return playerTurn;
  }

  const getCoordinate = (r, c) => {
    return "(" + r + "," + c + ")";
  }

  const isWinnerCell = (r, c) => {
    const coordinate = getCoordinate(r, c);
    return winnerCells.includes(coordinate);
  }

  const checkWinner = (r, c) => {
    let turn = playerTurn + 1;
    //    console.log(playerTurn + " just placed at " + r + " " + c);

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
      eastcells.push(getCoordinate(r, x));
      east++;
      x++;
    }

    // check west
    x = c - 1;
    while (x >= 0 && board[r][x] === turn) {
      westcells.push(getCoordinate(r, x));
      west++;
      x--;
    }

    // check south
    let y = r + 1;
    while (y < BOARDHEIGHT && board[y][c] === turn) {
      southcells.push(getCoordinate(y, c));
      south++;
      y++;
    }

    // check SE
    x = c + 1;
    y = r + 1;
    while (x < BOARDWIDTH && y < BOARDHEIGHT && board[y][x] === turn) {
      southeastcells.push(getCoordinate(y, x));
      southeast++;
      x++;
      y++;
    }

    // check SW
    x = c - 1;
    y = r + 1;
    while (x >= 0 && y < BOARDHEIGHT && board[y][x] === turn) {
      southwestcells.push(getCoordinate(y, x));
      southwest++;
      x--;
      y++;
    }

    // check NW
    x = c - 1;
    y = r - 1;
    while (x >= 0 && y >= 0 && board[y][x] === turn) {
      northwestcells.push(getCoordinate(y, x));
      northwest++;
      x--;
      y--;
    }

    // check NE
    x = c + 1;
    y = r - 1;
    while (x <= BOARDWIDTH && y >= 0 && board[y][x] === turn) {
      northeastcells.push(getCoordinate(y, x));
      northeast++;
      x++;
      y--;
    }

 
    var winnercells = [];
    winnercells.push(getCoordinate(r, c));
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
      setWinnerCells(winnercells);
      return true;
    }
    return false;
  }


  const handleClick = (c) => {
    if (gameOver) {
      return;
    }
    if (moves === BOARDHEIGHT * BOARDWIDTH) {
      setMessage("Game over it is a draw!");
      return;
    }

    if (boardHeight[c] === BOARDHEIGHT) {
      setMessage("Column " + (c + 1) + " already at top, try again");
      return;
    }

    setMessage("");

    // keep track of height
    let boardHeightCopy = boardHeight;
    let height = boardHeightCopy[c] + 1;
    boardHeightCopy[c] = height;
    setBoardHeight(boardHeightCopy);

    // update Board
    let boardCopy = board;
    //console.log("playerTurn: "+playerTurn+" column: "+c);

    let r = BOARDHEIGHT - height;
    boardCopy[r][c] = playerTurn + 1;

    //console.log(board);
    setBoard(boardCopy);

    setMoves(moves + 1);
    if (checkWinner(r, c)) {
      setMessage("Game over! " + getPlayerName() + " is the winner!");
      setGameOver(true);
      return;
    }

    console.log("s1: "+playerTurn);
    // update turn
    if (playerTurn === 0) setPlayerTurn(1);
    else {
      setPlayerTurn(0);
    }
  }

   return (
      <>
        <table border="1">
          <tbody>
            <tr>
              <th>
                <button onClick={(e) => handleClick(0)}>1</button>
              </th>
              <th>
                <button onClick={(e) => handleClick(1)}>2</button>
              </th>
              <th>
                <button onClick={(e) => handleClick(2)}>3</button>
              </th>
              <th>
                <button onClick={(e) => handleClick(3)}>4</button>
              </th>
              <th>
                <button onClick={(e) => handleClick(4)}>5</button>
              </th>
              <th>
                <button onClick={(e) => handleClick(5)}>6</button>
              </th>
              <th>
                <button onClick={(e) => handleClick(6)}>7</button>
              </th>
            </tr>
            {board.map((row, r) => (
              <tr key={r}>
                {row.map((col, c) => (
                  <Cell
                    key={r + "," + c}
                    row={r}
                    col={c}
                    value={board[r][c]}
                    isWinner={isWinnerCell(r, c)}
                  />
                ))}
              </tr>
            ))}
		</tbody>
            </table>
        <p/>
        Player Turn: {getPlayerName()}
        <p />
        Moves made: {moves}
        <p />
        {message}
        <p />
      </>
    );

}

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

export default Connect4Hook;
