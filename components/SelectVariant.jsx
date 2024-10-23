import React from "react";
import { InputLabel, Select, MenuItem } from "@mui/material";

const SelectVariant = ({ variant = "", setVariant = () => {} }) => {
  return (
    <>
      <InputLabel id="demo-simple-select-label">Variant</InputLabel>
      <Select
        value={variant}
        size="small"
        onChange={(e) => {
          setVariant(e.target.value);
          localStorage.setItem("puzzle_variant", e.target.value);
        }}
        sx={{ width: "100%" }}
      >
        <MenuItem value={"crossword"}>Crossword</MenuItem>
        <MenuItem value={"fillin"}>Fill-In</MenuItem>
        <MenuItem value={"soup"}>Word Search</MenuItem>
        <MenuItem value={"densesoup"}>Dense Word Search</MenuItem>
      </Select>
    </>
  );
};
export default React.memo(SelectVariant);
