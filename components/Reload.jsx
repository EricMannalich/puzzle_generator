import React from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import { Sync } from "@mui/icons-material";

const Reload = ({
  requestSync = () => {
    window.location.reload(true);
  },
}) => {
  return (
    <Box
      sx={{
        flexGrow: 0,
      }}
    >
      <Tooltip title="Reload">
        <IconButton
          color="inherit"
          aria-label="Sync"
          onClick={() => requestSync()}
        >
          <Sync />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default React.memo(Reload);
