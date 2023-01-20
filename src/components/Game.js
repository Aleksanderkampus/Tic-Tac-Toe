import { useEffect, useState } from "react";
import "./Game.css";
import Tile from "./Tile";

const Game = (props) => {
  const socket = props.socket;

  const [currentPlayer, setCurrentPlayer] = useState(props.playerWhoStarts);
  const [moves, setMoves] = useState([]);
  const [winner, setWinner] = useState();
  const [draw, setDraw] = useState(false);

  const makeMove = (cords) => {
    const newMoves = [...moves];
    newMoves.push({ player: currentPlayer, cords: cords });
    socket.emit("make-move", newMoves, currentPlayer.user, props.room);
  };

  const findWinner = (moves) => {
    const xValues = {};
    const yValues = {};

    let diagonal = 0;
    let reverseDiagonal = 0;

    for (const move of moves) {
      xValues[move.cords[0]] = xValues[move.cords[0]]
        ? xValues[move.cords[0]] + 1
        : 1;
      yValues[move.cords[1]] = yValues[move.cords[1]]
        ? yValues[move.cords[1]] + 1
        : 1;

      if (move.cords.join() === [1, 1].join()) {
        diagonal++;
      }
      if (move.cords.join() === [2, 2].join()) {
        diagonal++;
        reverseDiagonal++;
      }
      if (move.cords.join() === [3, 3].join()) {
        diagonal++;
      }
      if (move.cords.join() === [1, 3].join()) {
        reverseDiagonal++;
      }
      if (move.cords.join() === [3, 1].join()) {
        reverseDiagonal++;
      }
    }

    if (Object.values(xValues).find((x) => x === 3)) return true;
    if (Object.values(yValues).find((y) => y === 3)) return true;

    if (diagonal === 3) return true;
    if (reverseDiagonal === 3) return true;

    return false;
  };

  useEffect(() => {
    if (moves.length < 5) return;
    var currentPlayerMoved = moves[moves.length - 1].player;
    const filteredMoves = moves.filter((move) => {
      return move.player.user === currentPlayerMoved.user;
    });
    if (findWinner(filteredMoves)) {
      socket.emit("player-won", currentPlayerMoved, props.room);
    } else if (moves.length === 9) {
      socket.emit("gameDraw", props.room);
    }
  }, [moves]);

  useEffect(() => {
    socket.on("game-over", (winnerPlayer) => {
      setWinner(winnerPlayer);
    });

    socket.on("gameDraw", () => {
      setDraw(true);
    });

    socket.on("update-game", (moves, newCurrentPlayer) => {
      setCurrentPlayer(newCurrentPlayer);
      setMoves(moves);
    });
  }, []);

  return (
    <div className="game">
      {winner && (
        <div>
          Game won by {winner.name} symbol: {winner.symbol}
        </div>
      )}
      {draw && <div>Game ended in a draw</div>}
      <div className="row">
        {[
          [1, 1],
          [2, 1],
          [3, 1],
        ].map((cords) => {
          return (
            <Tile
              cords={cords}
              player={socket.id}
              currentPlayer={currentPlayer}
              makeMove={makeMove}
              moves={moves}
              isGameOver={winner}
            ></Tile>
          );
        })}
      </div>
      <div className="row">
        {[
          [1, 2],
          [2, 2],
          [3, 2],
        ].map((cords) => {
          return (
            <Tile
              cords={cords}
              player={socket.id}
              currentPlayer={currentPlayer}
              makeMove={makeMove}
              moves={moves}
              isGameOver={winner}
            ></Tile>
          );
        })}
      </div>
      <div className="row">
        {[
          [1, 3],
          [2, 3],
          [3, 3],
        ].map((cords) => {
          return (
            <Tile
              cords={cords}
              player={socket.id}
              currentPlayer={currentPlayer}
              makeMove={makeMove}
              moves={moves}
              isGameOver={winner}
            ></Tile>
          );
        })}
      </div>
    </div>
  );
};

export default Game;
