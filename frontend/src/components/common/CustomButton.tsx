import React from "react";
import { Button, ButtonProps, styled } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  label: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, ...rest }) => {
  return <StyledButton {...rest}>{label}</StyledButton>;
};


export default CustomButton;
const StyledButton = styled(Button)({
  textTransform: "none",
background:
          "linear-gradient(135deg,hsl(246, 79.90%, 48.80%),hsla(330, 71.20%, 42.20%, 0.53),hsl(310, 38.90%, 28.20%))",
  fontWeight: 600,
  color: "#1e88e5",
  "&:hover": {
    
  },
  borderRadius:"18px"
});
