import React from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import { Brightness7, Brightness4 } from "@mui/icons-material";

const ColorMode = ({ mode = "", setMode = () => {} }) => {
  const handleMode = () => {
    let newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };
  return (
    <Box
      sx={{
        flexGrow: 0,
      }}
    >
      <Tooltip title="Change the colors of the visual interface">
        <IconButton onClick={() => handleMode()} color="inherit">
          {mode === "dark" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default React.memo(ColorMode);
