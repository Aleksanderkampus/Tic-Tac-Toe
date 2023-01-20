import logo from "./assets/logo.svg";
import "./App.css";
import Button from "./components/UI/Button";
import Input from "./components/UI/Input";
import { useState } from "react";
import io from "socket.io-client";
import Lobby from "./components/Lobby";

const socket = io.connect("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [error, setError] = useState();

  const handleError = (err, res) => {
    if (err) {
      setError(err.name);
    } else {
      setJoinedRoom(true);
    }
  };

  function randomString(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleJoinRoom = () => {
    socket.emit("connect-room", { room: room }, handleError);
  };

  const changeRoomCodeHandler = (e) => {
    setRoom(e.target.value);
  };

  const handleCreateRoom = () => {
    const roomId = randomString(6);
    setRoom(roomId);
    socket.emit("connect-room", { room: roomId }, handleError);
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <div onClick={handleReloadPage}>
        <img src={logo} alt=""></img>
      </div>
      {joinedRoom && <Lobby socket={socket} room={room}></Lobby>}
      {!joinedRoom && (
        <div className="main-menu">
          <Button onClick={handleCreateRoom}>Create game</Button>
          <div className="join-room">
            <Input
              input={{
                placeholder: "Join room",
                onChange: changeRoomCodeHandler,
              }}
            ></Input>
            {error && <p className="error">{error}</p>}
            <Button onClick={handleJoinRoom} disabled={room.length < 6}>
              &gt;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
