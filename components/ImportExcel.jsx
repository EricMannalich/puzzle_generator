import React from "react";
import PublishIcon from "@mui/icons-material/Publish";
import ExcelJS from "exceljs";
import { Tooltip, IconButton } from "@mui/material";

const ImportExcel = ({
  setData = () => {},
  headerColumns = 0,
  disabled = undefined,
}) => {
  function handleData(data) {
    const newData = data.map((obj) => {
      const newObj = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const newKey = key
            .replace(/ /g, "_")
            .replace(/[^a-zA-Z0-9_]/g, "")
            .toLowerCase();
          newObj[newKey] = obj[key];
        }
      }
      return newObj;
    });

    setData(newData);
  }

  const loadExcel = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (!file.name.endsWith(".xlsx")) {
      alert("Incompatible file");
      return;
    }
    reader.onload = async (e) => {
      const buffer = new Uint8Array(e.target.result);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.worksheets[0];
      worksheet.spliceRows(1, headerColumns);
      let data = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          let rowData = {};
          row.eachCell((cell, colNumber) => {
            if (typeof cell.value === "object") {
              if ("result" in cell.value) {
                rowData[worksheet.getRow(1).getCell(colNumber).value] = Number(
                  cell.value.result
                );
              } else if ("sharedFormula" in cell.value) {
                rowData[worksheet.getRow(1).getCell(colNumber).value] = 0;
              } else {
                rowData[worksheet.getRow(1).getCell(colNumber).value] =
                  cell.value;
              }
            } else {
              rowData[worksheet.getRow(1).getCell(colNumber).value] =
                cell.value;
            }
          });

          data.push(rowData);
        }
      });
      handleData(data);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Tooltip title="Import Excel">
      <span>
        <input
          type="file"
          accept=".xlsx"
          hidden
          onChange={loadExcel}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <IconButton
            disabled={disabled}
            color="inherit"
            aria-label="Sync"
            component="span"
            sx={{ flexGrow: 0 }}
          >
            <PublishIcon />
          </IconButton>
        </label>
      </span>
    </Tooltip>
  );
};

export default React.memo(ImportExcel);
