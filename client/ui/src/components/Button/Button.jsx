import MUIButton from "@mui/material/Button";

const Button = (props) => {
  return (
    <MUIButton
    variant="contained"
    color="primary"
    sx={{
      border: "none",
      boxShadow: 0,
      color: "#1f1f1f",
      textTransform: "none",
      fontSize: 16,
      "&:hover": {
        color: "white",
        boxShadow: 0,
      },
    }}
    onClick={props.onClick}
  >
    {props.children}
  </MUIButton>
  )
}

export default Button