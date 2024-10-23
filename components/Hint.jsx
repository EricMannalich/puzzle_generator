import React from "react";
import { Box, FormControlLabel, Switch } from "@mui/material";

const Hint = ({ hint = "", setHint = () => {} }) => {
  return (
    <Box
      sx={{
        flexGrow: 0,
      }}
    >
      <FormControlLabel
        control={<Switch checked={hint} color="warning" />}
        label="Hint"
        onChange={() => {
          localStorage.setItem("puzzle_hint", JSON.stringify(!hint));
          setHint(!hint);
        }}
      />
    </Box>
  );
};
export default React.memo(Hint);
