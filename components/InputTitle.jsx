import React from "react";
import { InputLabel, TextField } from "@mui/material";

const InputTitle = ({ title = "", setTitle = () => {} }) => {
  return (
    <>
      <InputLabel>Title</InputLabel>
      <TextField
        fullWidth
        value={title}
        variant="standard"
        size="small"
        onChange={(event) => {
          localStorage.setItem("puzzle_title", event.target.value);
          setTitle(event.target.value);
        }}
      />
    </>
  );
};
export default React.memo(InputTitle);
