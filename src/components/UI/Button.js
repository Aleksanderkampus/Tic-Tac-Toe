import "./Button.css";

const Button = (props) => {
  const classes = "button" + " " + props.classes;
  return (
    <button
      type={props.type || "button"}
      className={classes}
      onClick={props.onClick}
      disabled={props.disabled || false}
    >
      {props.children}
    </button>
  );
};

export default Button;
