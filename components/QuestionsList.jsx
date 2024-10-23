import React from "react";
import {
  Grid2 as Grid,
  Typography,
  List,
  ListItem,
  TextField,
} from "@mui/material";

const QuestionsList = ({
  coordinates = {},
  wordBD = [],
  setWordBD = () => {},
}) => {
  const handleWordBD = (key, value) => {
    setWordBD((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography>Horizontal</Typography>
        <List component="div" disablePadding>
          {coordinates
            ?.filter((coord) => coord.direction === "horizontal")
            ?.map((coord) => (
              <ListItem
                key={coord.id}
                sx={{
                  pl: 1,
                  pt: 0,
                  pb: 0,
                }}
              >
                <Typography>{coord.order + "-"}</Typography>
                <TextField
                  value={wordBD[coord.word] || ""}
                  onChange={(e) => {
                    handleWordBD(coord.word, e.target.value);
                  }}
                  size="small"
                  variant="standard"
                  fullWidth
                />
              </ListItem>
            ))}
        </List>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography>Vertical</Typography>
        <List component="div" disablePadding>
          {coordinates
            ?.filter((coord) => coord.direction === "vertical")
            ?.map((coord) => (
              <ListItem
                key={coord.id}
                sx={{
                  pl: 1,
                  pt: 0,
                  pb: 0,
                }}
              >
                <Typography>{coord.order + "-"}</Typography>
                <TextField
                  value={wordBD[coord.word] || ""}
                  onChange={(e) => {
                    handleWordBD(coord.word, e.target.value);
                  }}
                  size="small"
                  variant="standard"
                  fullWidth
                />
              </ListItem>
            ))}
        </List>
      </Grid>
    </>
  );
};
export default React.memo(QuestionsList);
