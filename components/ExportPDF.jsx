import React from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import ReportPDF from "./ReportPDF";
import { Tooltip, IconButton } from "@mui/material";

const convertObjectToList = (obj) => {
  return Object.entries(obj).map(([key, value]) => `${key}: ${value || " "}`);
};

const ExportPDF = ({
  crossword,
  wordList,
  title,
  variant,
  coordinates,
  horizontalWord,
  verticalWord,
  hint = false,
}) => {
  const savePDF = () => {
    const horizontalWordList = convertObjectToList(horizontalWord);
    const verticalWordList = convertObjectToList(verticalWord);
    let formLeft = [];
    let formRight = [];
    let formLeftTitle = "";
    let formRightTitle = "";

    if (horizontalWordList.length >= verticalWordList.length) {
      formLeftTitle = "Horizontal";
      formRightTitle = "Vertical";
      formLeft = horizontalWordList;
      formRight = verticalWordList;
    } else {
      formLeftTitle = "Vertical";
      formRightTitle = "Horizontal";
      formLeft = verticalWordList;
      formRight = horizontalWordList;
    }
    const head = {
      orientation: "portrait",
      format: "letter",
      font: "Helvetica",
      save: title,
    };
    const body = {
      h1: title,
      h2: "Puzzle Generator",
      h3: "",
      h4: "linkedin.com/in/eric-manalich-cossio",
      img: "./logo.png",
      imgWidth: 60,
      imgHeight: 60,
      formLeftTitle: formLeftTitle,
      formLeft: formLeft,
      formRightTitle: formRightTitle,
      formRight: formRight,
      wordList: wordList,
      crossword: crossword,
      coordinates: coordinates,
      variant: variant,
      hint: hint,
    };
    const PDF = { head: head, body: body };
    console.log("PDF", PDF);
    ReportPDF(PDF);
  };

  return (
    <Tooltip title="Export PDF">
      <span>
        <IconButton color="inherit" onClick={() => savePDF()}>
          <LocalPrintshopIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default React.memo(ExportPDF);
