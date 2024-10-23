import jsPDF from "jspdf";
import React from "react";

async function ReportPDF(newPDF = {}) {
  const PDF = newPDF.head.font
    ? newPDF
    : JSON.parse(localStorage.getItem("ReportPDF") || "{}");
  var doc = new jsPDF(PDF.head.orientation, "pt", PDF.head.format);
  var font = PDF.head.font?.length > 0 ? PDF.head.font : "Helvetica";
  var width = doc.internal.pageSize.getWidth();
  var height = doc.internal.pageSize.getHeight();
  var marginLeft = 30;
  var marginTop = 30;
  var formWidth = (width - marginLeft * 2) / 2 - 10;
  var formHigh = 20;
  var footerTop = height - marginTop;
  var lastObject = marginTop;
  var bodyPages = 0;
  var countPages = 0;

  const setText = (
    text = "",
    align = "left",
    fontSize = 11,
    fontThickness = "normal",
    textWidth = formWidth,
    textHigh = formHigh
  ) => {
    var newLastObject = lastObject;
    if (text.length > 0) {
      doc.setFontSize(fontSize);
      doc.setFont(font, fontThickness);
      var textSplit = doc.splitTextToSize(text, textWidth)[0];
      var textLength = 0;
      if (align === "center") {
        textLength =
          (width -
            doc.getStringUnitWidth(textSplit) * doc.internal.getFontSize()) /
            2 -
          marginLeft;
      } else if (align === "middle") {
        textLength = formWidth + 10;
      }
      doc.text(textSplit, marginLeft + textLength, (newLastObject += textHigh));
    }
    return newLastObject;
  };

  var imgWidth =
    parseInt(PDF.body.imgWidth, 10) > 0 ? parseInt(PDF.body.imgWidth, 10) : 64;
  var imgHeight =
    parseInt(PDF.body.imgHeight, 10) > 0
      ? parseInt(PDF.body.imgHeight, 10)
      : 64;

  //tableCrossword
  lastObject += 90;
  const sizeCell = 17;
  const startX =
    PDF.body.variant === "soup" || PDF.body.variant === "densesoup"
      ? 160
      : PDF.body.variant === "fillin"
      ? 140
      : 240;
  const startY = lastObject + 10;
  doc.setFontSize(10);
  const crossword = PDF.body.crossword;
  let crosswordCopy = JSON.parse(JSON.stringify(crossword));
  if (PDF.body.variant === "soup" || PDF.body.variant === "densesoup") {
    crossword.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === " ") {
          cell = String.fromCharCode(65 + Math.floor(Math.random() * 26));
          crosswordCopy[rowIndex][colIndex] = cell;
        }
        const x = startX + colIndex * sizeCell;
        const y = startY + rowIndex * sizeCell;
        const textWidth = doc.getTextWidth(cell);
        const textX = x + (sizeCell - textWidth) / 2;
        const textY = y + sizeCell / 2 + 3;
        doc.text(cell, textX, textY);
      });
    });
  } else {
    let coordinates = PDF.body.coordinates;

    crossword.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== " ") {
          const x = startX + colIndex * sizeCell;
          const y = startY + rowIndex * sizeCell;
          doc.rect(x, y, sizeCell, sizeCell);

          const cellCoordinates = coordinates.filter(
            (coord) => coord.row === rowIndex && coord.col === colIndex
          );

          cellCoordinates.forEach((coordinate, index) => {
            if (PDF.body.hint && Math.random() < 0.15) {
              doc.setFontSize(9);
              const textWidth = doc.getTextWidth(cell);
              const textX = x + (sizeCell - textWidth) / 2;
              const textY = y + sizeCell / 2 + 3;
              doc.text(cell, textX, textY);
            }
            if (PDF.body.variant === "crossword") {
              doc.setFontSize(5);
              doc.text(
                String(coordinate.order),
                x + sizeCell / 2 - 7,
                y + sizeCell / 2 - 3,
                {
                  align: "left",
                }
              );
            }
          });
        } else {
          const isSurroundedByEmptyCells =
            rowIndex > 0 &&
            crossword[rowIndex - 1][colIndex] !== " " &&
            rowIndex < crossword.length - 1 &&
            crossword[rowIndex + 1][colIndex] !== " " &&
            colIndex > 0 &&
            crossword[rowIndex][colIndex - 1] !== " " &&
            colIndex < row.length - 1 &&
            crossword[rowIndex][colIndex + 1] !== " ";

          if (isSurroundedByEmptyCells) {
            const x = startX + colIndex * sizeCell;
            const y = startY + rowIndex * sizeCell;
            doc.setFillColor(0, 0, 0);
            doc.rect(x, y, sizeCell, sizeCell, "F");
          }
        }
      });
    });
  }

  //wordList
  if (PDF.body.variant === "soup" || PDF.body.variant === "densesoup") {
    lastObject = setText(
      "Words to find: " + String(PDF.body.wordList.length),
      "left",
      10
    );
    if (PDF.body.hint) {
      PDF.body.wordList.sort((a, b) => a.localeCompare(b));
      PDF.body.wordList.forEach((word) => {
        setText(word, "left", 9);
        lastObject += 12;
      });
    }
  }

  //imgCrossword
  lastObject = startY - 10;
  doc.addPage();
  //wordList
  let coordinates = PDF.body.coordinates;
  if (PDF.body.variant === "soup" || PDF.body.variant === "densesoup") {
    lastObject = setText(
      "Words to find: " + String(PDF.body.wordList.length),
      "left",
      10
    );
    // PDF.body.wordList.sort((a, b) => a.localeCompare(b));
    PDF.body.coordinates.forEach((coordinate) => {
      setText(String(coordinate.order) + ": " + coordinate.word, "left", 9);
      lastObject += 12;
    });

    crossword.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = startX + colIndex * sizeCell;
        const y = startY + rowIndex * sizeCell;
        if (cell === " ") {
          cell = crosswordCopy[rowIndex][colIndex];
          doc.setTextColor(128, 128, 128);
          doc.setFont(font, "normal");
        } else {
          const cellCoordinates = coordinates.filter(
            (coord) => coord.row === rowIndex && coord.col === colIndex
          );
          doc.setFontSize(5);
          doc.setFont(font, "normal");
          doc.setTextColor(64, 64, 64);
          cellCoordinates.forEach((coordinate, index) => {
            doc.text(
              String(coordinate.order),
              x + sizeCell / 2 - 7,
              y + sizeCell / 2 - 3,
              {
                align: "left",
              }
            );
          });

          doc.setTextColor(0, 0, 0);
          doc.setFont(font, "bold");
          doc.setFontSize(9);
        }

        const textWidth = doc.getTextWidth(cell);
        const textX = x + (sizeCell - textWidth) / 2;
        const textY = y + sizeCell / 2 + 3;
        doc.text(cell, textX, textY);
      });
    });
  } else {
    crossword.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== " ") {
          const x = startX + colIndex * sizeCell;
          const y = startY + rowIndex * sizeCell;
          doc.rect(x, y, sizeCell, sizeCell);
          doc.setFontSize(9);
          const textWidth = doc.getTextWidth(cell);
          const textX = x + (sizeCell - textWidth) / 2;
          const textY = y + sizeCell / 2 + 3;
          doc.text(cell, textX, textY);
          if (PDF.body.variant === "crossword") {
            const cellCoordinates = coordinates.filter(
              (coord) => coord.row === rowIndex && coord.col === colIndex
            );
            doc.setFontSize(5);
            cellCoordinates.forEach((coordinate, index) => {
              doc.text(
                String(coordinate.order),
                x + sizeCell / 2 - 7,
                y + sizeCell / 2 - 3,
                {
                  align: "left",
                }
              );
            });
          }
        } else {
          const isSurroundedByEmptyCells =
            rowIndex > 0 &&
            crossword[rowIndex - 1][colIndex] !== " " &&
            rowIndex < crossword.length - 1 &&
            crossword[rowIndex + 1][colIndex] !== " " &&
            colIndex > 0 &&
            crossword[rowIndex][colIndex - 1] !== " " &&
            colIndex < row.length - 1 &&
            crossword[rowIndex][colIndex + 1] !== " ";

          if (isSurroundedByEmptyCells) {
            const x = startX + colIndex * sizeCell;
            const y = startY + rowIndex * sizeCell;
            doc.setFillColor(0, 0, 0); // Negro
            doc.rect(x, y, sizeCell, sizeCell, "F"); // 'F' para rellenar
          }
        }
      });
    });
  }
  doc.setTextColor(0, 0, 0);

  //page
  var totalPages = doc.internal.getNumberOfPages();

  bodyPages = totalPages - countPages;
  console.log(
    "totalPages: ",
    totalPages,
    ", countPages: ",
    countPages,
    ", bodyPages: ",
    bodyPages
  );
  for (var i = countPages + 1; i <= totalPages; i++) {
    doc.setPage(i);
    lastObject = marginTop;
    //h2
    lastObject = setText(PDF.body.h2, "left", 16, "bold", 400, 8) - 2;

    //h3
    // lastObject = setText(PDF.body.h3, "left", 11, "bold", 300, 20);
    lastObject += 20;
    doc.setFont(font, "bold");
    doc.setFontSize(11);
    const h3 = PDF.body.h3;
    doc.textWithLink(h3, marginLeft, lastObject, { url: h3 });
    lastObject += 20;
    const h4 = PDF.body.h4;
    doc.textWithLink(h4, marginLeft, lastObject, { url: h4 });

    //h4
    // if (PDF.body.h4?.length > 0) {
    //   doc.setFont(font, "normal");
    //   doc.setFontSize(11);
    //   var h4 = doc.splitTextToSize(PDF.body.h4, 200);
    //   doc.text(h4, marginLeft, (lastObject += 20));
    //   lastObject += (h4.length - 1) * 15;
    // }

    if (lastObject < marginTop + imgHeight) {
      lastObject = marginTop + imgHeight;
    }
    //h1
    lastObject = setText(
      PDF.body.h1,
      "center",
      20,
      "bold",
      width - marginLeft * 2 - 10,
      20
    );

    //img
    try {
      let img = new Image();
      img.src = PDF.body.img;
      doc.addImage(
        img,
        "PNG",
        width - marginLeft - imgWidth,
        marginTop,
        imgWidth,
        imgHeight
      );
    } catch (e) {
      console.log(e);
    }

    //form

    if (PDF.body.variant === "fillin") {
      var startColumn = 600;
      lastObject = startColumn;
      var columnWidth = (width - 2 * marginLeft) / 5;
      var currentColumn = 0;
      doc.setFontSize(9);

      var words = PDF.body.coordinates.map((coordinate) => coordinate.word);
      words.sort((a, b) => a.length - b.length);
      var groupedWords = words.reduce((groups, word) => {
        const length = word.length;
        if (!groups[length]) {
          groups[length] = [];
        }
        groups[length].push(word);
        return groups;
      }, {});

      // Imprimir las palabras ordenadas en el PDF con títulos
      Object.keys(groupedWords).forEach((length) => {
        const group = groupedWords[length];
        const title = `${length} letter words:`;

        // Imprimir el título del grupo
        doc.setFont(font, "bold");
        if (lastObject + 12 > height - marginTop) {
          currentColumn++;
          lastObject = startColumn;
        }
        if (currentColumn < 5) {
          doc.text(title, marginLeft + currentColumn * columnWidth, lastObject);
          lastObject += 12;
        }

        // Imprimir las palabras del grupo
        doc.setFont(font, "normal");
        group.forEach((word) => {
          if (lastObject + 12 > height - marginTop) {
            currentColumn++;
            lastObject = startColumn;
          }
          if (currentColumn < 5) {
            doc.text(
              word,
              marginLeft + currentColumn * columnWidth,
              lastObject
            );
            lastObject += 12;
          }
        });
        lastObject += 3;
      });
    }
    if (PDF.body.variant === "crossword") {
      lastObject = setText(PDF.body.formLeftTitle, "left", 10) + 5;
      let sizeForm = 9;
      doc.setFont(font, "normal");
      doc.setFontSize(sizeForm);
      PDF.body.formLeft?.forEach((element) => {
        let textSplit = doc.splitTextToSize(element, 180); //.slice(0, 4)
        doc.text(textSplit, marginLeft, (lastObject += sizeForm));
        lastObject += (textSplit.length - 1) * sizeForm + 3;
      });
      lastObject = 490;
      doc.setFontSize(10);
      doc.text(PDF.body.formRightTitle, startX - 15, lastObject);
      lastObject += 6;
      doc.setFontSize(sizeForm);
      PDF.body.formRight?.forEach((element) => {
        let textSplit = doc.splitTextToSize(element, 355); //.slice(0, 2)
        doc.text(textSplit, startX - 15, (lastObject += sizeForm));
        lastObject += (textSplit.length - 1) * sizeForm + 3;
      });
    }
  }

  countPages = totalPages;
  lastObject = marginTop;
  doc.addPage();

  doc.deletePage(doc.internal.getNumberOfPages());
  //save
  const time = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  doc.save(PDF.body.h1 + " (" + time + ").pdf");
  // window.open(doc.output("bloburl"));

  // localStorage.setItem("ReportPDF", "");
}

export default ReportPDF;
