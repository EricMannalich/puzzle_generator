import React from "react";
import ListAlt from "@mui/icons-material/ListAlt";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import ExcelJS from "exceljs";
import Tooltip from "@mui/material/Tooltip";

const ExportExcel = ({ wordList = [], wordBD = {}, title = "MyTable" }) => {
  const saveExcel = async () => {
    const time = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    const table = {
      columns: ["WORD", "QUESTION", "ACTIVE"],
      rows: Object.entries(wordBD).map(([key, value]) => [
        key,
        value,
        wordList.includes(key) ? true : false,
      ]),
    };
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title.substring(0, 30));

    worksheet.addTable({
      name: "MyTable",
      ref: "A1",
      headerRow: true,
      totalsRow: false,
      style: {
        theme: "TableStyleMedium2",
        showRowStripes: true,
      },
      columns: table.columns.map((column) => ({
        name: column,
        filterButton: true,
      })),
      rows: table.rows,
    });

    // Save workbook to file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = title + " (" + time + ").xlsx";
    a.click();
  };
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Export Excel">
        <IconButton
          color="inherit"
          aria-label="Sync"
          onClick={saveExcel}
          //edge="start"
          sx={{ flexGrow: 0 }}
        >
          <ListAlt />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default React.memo(ExportExcel);
