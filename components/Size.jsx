import React from "react";
import { InputLabel, TextField, InputAdornment } from "@mui/material";
import { PhotoSizeSelectSmall } from "@mui/icons-material";

const Size = ({ size = 10, setSize = () => {}, disabled = false }) => {
  return (
    <>
      <InputLabel>Size</InputLabel>

      <TextField
        fullWidth
        value={size}
        variant="standard"
        type={"number"}
        size="small"
        color="inherit"
        disabled={disabled}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PhotoSizeSelectSmall />
              </InputAdornment>
            ),
          },
        }}
        onChange={(event) => {
          if (event.target.value >= 0 && event.target.value < 26) {
            localStorage.setItem("puzzle_size", event.target.value);
            setSize(parseInt(event.target.value, 10));
          }
        }}
      />
    </>
  );
};
export default React.memo(Size);
