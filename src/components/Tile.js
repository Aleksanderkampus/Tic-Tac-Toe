const Tile = (props) => {
  const matchingCords = props.moves.find((move) => {
    return move.cords.join() === props.cords.join();
  });

  const tileText = matchingCords ? matchingCords.player.symbol : "";

  return (
    <div
      key={props.cords}
      onClick={
        props.player === props.currentPlayer.user &&
        !props.isGameOver &&
        tileText === ""
          ? () => {
              props.makeMove(props.cords);
            }
          : () => {
              console.log("Not your turn");
            }
      }
      className="tile"
    >
      {tileText}
    </div>
  );
};

export default Tile;
