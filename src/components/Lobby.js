import React, { useEffect, useState } from "react";
import "../App.css";
import Game from "./Game";
import Card from "./UI/Card";
import Input from "./UI/Input";
import Button from "./UI/Button";

export default function Lobby(props) {
  const socket = props.socket;
  const [players, setPlayers] = useState([]);
  const [allPlayersReady, setAllPlayerReady] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerSymbol, setPlayerSymbol] = useState("");
  const [otherPlayerSymbol, setOtherPlayerSymbol] = useState();

  useEffect(() => {
    socket.on("update-players", async (allPlayers, _otherPlayerSymbol) => {
      var allReady = true;
      for (const player of allPlayers) {
        if (!player.isReady || allPlayers.length < 2) {
          allReady = false;
          break;
        }
      }
      setPlayerSymbol("");
      setOtherPlayerSymbol(_otherPlayerSymbol);
      setAllPlayerReady(allReady);
      setPlayers(allPlayers);
    });
  }, [socket]);

  const playerIsReady = () => {
    socket.emit(
      "player-ready",
      props.room,
      socket.id,
      playerName,
      playerSymbol
    );
  };

  const changePlayerNameHandler = (e) => {
    setPlayerName(e.target.value);
  };

  const changePlayerSymbol = (e) => {
    console.log(e.target.innerText);
    setPlayerSymbol(e.target.innerText);
  };

  return (
    <>
      {allPlayersReady && (
        <Game
          room={props.room}
          playerWhoStarts={players[0]}
          socket={socket}
        ></Game>
      )}
      {!allPlayersReady && (
        <>
          <div className="lobby-card">
            <h2>Lobby code</h2>
            <h2>{props.room}</h2>
          </div>
          <div className="all-players">
            {players.map((player, i) => (
              <Card
                key={player.user}
                classes={player.isReady ? "ready-card" : ""}
              >
                <div className="inner-card">
                  <h2>Player {i + 1}</h2>
                  {player.isReady && (
                    <>
                      <h2>{player.name}</h2>
                      <h2>Symbol {player.symbol}</h2>
                      <h2>Ready</h2>
                    </>
                  )}
                  {player.user === socket.id && !player.isReady && (
                    <>
                      <Input
                        input={{
                          placeholder: "Name",
                          onChange: changePlayerNameHandler,
                        }}
                      />
                      <div>
                        <p>Choose your symbol</p>
                        <div>
                          <Button
                            onClick={changePlayerSymbol}
                            disabled={otherPlayerSymbol === "X"}
                            classes="clicked-button"
                          >
                            X
                          </Button>
                          <Button
                            onClick={changePlayerSymbol}
                            disabled={otherPlayerSymbol === "O"}
                            classes="clicked-button"
                          >
                            O
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={playerIsReady}
                        disabled={playerName.length < 1 || playerSymbol === ""}
                      >
                        Ready
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
