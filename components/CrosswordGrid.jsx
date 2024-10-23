import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toSvg } from "html-to-image";
import { createPortal } from "react-dom";

const celLeng = 40;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  width: celLeng,
  height: celLeng,
  textAlign: "center",
  verticalAlign: "middle",
  padding: 0,
  fontSize: "1.2rem",
  position: "relative",
}));

const StyledTableRow = styled(TableRow)(() => ({
  height: celLeng,
}));

const Line = styled("div")(({ theme, direction, length }) => {
  const styles = {
    position: "absolute",
    backgroundColor: theme.palette.primary.main,
  };

  switch (direction) {
    case "horizontal":
      return {
        ...styles,
        height: 2,
        width: `${length * celLeng - celLeng}px`,
        top: "50%",
        left: "50%",
      };
    case "vertical":
      return {
        ...styles,
        width: 2,
        height: `${length * celLeng - celLeng}px`,
        top: "50%",
        left: "50%",
      };
    case "diagonal_down":
      return {
        ...styles,
        width: `${length * celLeng * Math.sqrt(2) - celLeng * Math.sqrt(2)}px`,
        height: 2,
        top: "50%",
        left: "50%",
        transform: "rotate(45deg)",
        transformOrigin: "left center",
      };
    case "diagonal_up":
      return {
        ...styles,
        width: `${length * celLeng * Math.sqrt(2) - celLeng * Math.sqrt(2)}px`,
        height: 2,
        top: "50%",
        left: "50%",
        transform: "rotate(-45deg)",
        transformOrigin: "left center",
      };
    default:
      return styles;
  }
});

const HiddenContainer = ({ children }) => {
  return createPortal(
    <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
      {children}
    </div>,
    document.body
  );
};

const CrosswordGrid = ({ grid, size, coordinates }) => {
  const elementRef = React.useRef(null);
  const [imageSrc, setImageSrc] = React.useState("");

  React.useEffect(() => {
    const captureImage = async () => {
      const svgDataUrl = await toSvg(elementRef.current);
      setImageSrc(svgDataUrl);
    };

    captureImage();
  }, [grid]);

  return (
    <>
      <HiddenContainer>
        <TableContainer
          component={Paper}
          sx={{
            width: celLeng * size,
          }}
          ref={elementRef}
        >
          <Table>
            <TableBody>
              {grid.map((row, rowIndex) => (
                <StyledTableRow key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    const cellCoordinates = coordinates.filter(
                      (coord) =>
                        coord.row === rowIndex && coord.col === colIndex
                    );

                    return (
                      <StyledTableCell key={colIndex}>
                        <span
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 3,
                            fontSize: "0.50em",
                            color: "gray",
                          }}
                        >
                          {cellCoordinates[0]?.order}
                        </span>
                        {cell}
                        {cellCoordinates.map((coordinate, index) => (
                          <Line
                            key={index}
                            direction={coordinate.direction}
                            length={coordinate.len}
                          />
                        ))}
                      </StyledTableCell>
                    );
                  })}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>{" "}
      </HiddenContainer>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Captured Component"
          style={{ width: "100%", height: "auto" }}
        />
      )}
    </>
  );
};

export default React.memo(CrosswordGrid);
