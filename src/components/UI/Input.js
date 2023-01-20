import "./Input.css";

const Input = (props) => {
  const classes = "input" + " " + props.classes;
  return <input className={classes} {...props.input} />;
};

export default Input;
