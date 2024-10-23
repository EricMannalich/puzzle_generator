import React from "react";
import {
  AppBar,
  Box,
  Paper,
  Grid2 as Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ColorMode from "./components/ColorMode";
import Hint from "./components/Hint";
import SelectVariant from "./components/SelectVariant";
import Size from "./components/Size";
import InputTitle from "./components/InputTitle";
import WordList from "./components/WordList";
import { toAlphaUpperCase } from "./components/Functions";
import ImportExcel from "./components/ImportExcel";
import ExportExcel from "./components/ExportExcel";
import ExportPDF from "./components/ExportPDF";
import Reload from "./components/Reload";
import { puzzleGenerator } from "./components/Generator";
import CrosswordGrid from "./components/CrosswordGrid";
import QuestionsList from "./components/QuestionsList";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  const [mode, setMode] = React.useState(
    localStorage.getItem("mode") || "light"
  );

  const [variant, setVariant] = React.useState(
    localStorage.getItem("puzzle_variant") || "crossword"
  );

  // const size = 20;
  const [size, setSize] = React.useState(
    variant === "crossword"
      ? 20
      : parseInt(JSON.parse(localStorage.getItem("puzzle_size") || "20"), 10)
  );
  const [title, setTitle] = React.useState(
    localStorage.getItem("puzzle_title") || "Puzzle"
  );
  const [hint, setHint] = React.useState(
    localStorage.getItem("puzzle_hint")
      ? localStorage.getItem("puzzle_hint") === "true"
      : true
  );
  const [wordList, setWordList] = React.useState(
    JSON.parse(localStorage.getItem("puzzle_words") || null) || []
  );

  const [wordBD, setWordBD] = React.useState(
    JSON.parse(localStorage.getItem("puzzle_wordBD") || "{}")
  );

  React.useEffect(() => {
    if (wordList) {
      const newWordBD = { ...wordBD };
      wordList.forEach((element) => {
        if (!(element in newWordBD)) {
          newWordBD[element] = "";
        }
      });
      setWordBD(newWordBD);
      localStorage.setItem("puzzle_wordBD", JSON.stringify(newWordBD));
    }
  }, [wordList]);

  const importExcelData = (data = []) => {
    let wordBDcopy = { ...wordBD };
    let word_list = [];
    data.forEach((element) => {
      const newWordExcel = toAlphaUpperCase(element["word"], size);
      if (newWordExcel.length > 2) {
        wordBDcopy[newWordExcel] = element["question"];
        if (
          (element["active"] === undefined || element["active"]) &&
          word_list.length <= 50
        ) {
          !word_list.includes(newWordExcel) && word_list.push(newWordExcel);
        }
      }
    });
    setWordBD(wordBDcopy);
    localStorage.setItem("puzzle_wordBD", JSON.stringify(wordBDcopy));
    word_list.sort((a, b) => a.localeCompare(b));
    setWordList(word_list);
    localStorage.setItem("puzzle_words", JSON.stringify(word_list));
    handlePuzzle(word_list, size, variant);
  };

  const [puzzle, setPuzzle] = React.useState({});

  const handlePuzzle = (
    wordListPuzzle = wordList,
    sizePuzzle = size ? size : 10,
    variantPuzzle = variant
  ) => {
    console.log(
      "wordListPuzzle: ",
      wordListPuzzle,
      ", sizePuzzle: ",
      sizePuzzle,
      ", variantPuzzle: ",
      variantPuzzle
    );
    let newSize = Math.max(10, Math.min(sizePuzzle, 25));
    setSize(newSize);
    localStorage.setItem("puzzle_size", JSON.stringify(newSize));
    let newPuzzle = puzzleGenerator(wordListPuzzle, newSize, variantPuzzle);
    console.log(newPuzzle);
    setPuzzle(newPuzzle);
  };

  const [horizontalWord, setHorizontalWord] = React.useState(
    JSON.parse(localStorage.getItem("puzzle_horizontal") || "{}")
  );
  const [verticalWord, setVerticalWord] = React.useState(
    JSON.parse(localStorage.getItem("puzzle_vertical") || "{}")
  );
  React.useEffect(() => {
    if (variant === "crossword") {
      const coordinates = puzzle.coordinates;
      if (coordinates) {
        let horizontal = coordinates
          ?.filter((coord) => coord.direction === "horizontal")
          ?.reduce((acc, coord) => {
            acc[coord.order] = wordBD[coord.word];
            return acc;
          }, {});
        setHorizontalWord(horizontal);
        localStorage.setItem("puzzle_horizontal", JSON.stringify(horizontal));
        let vertical = coordinates
          ?.filter((coord) => coord.direction === "vertical")
          ?.reduce((acc, coord) => {
            acc[coord.order] = wordBD[coord.word];
            return acc;
          }, {});
        setVerticalWord(vertical);
        localStorage.setItem("puzzle_vertical", JSON.stringify(vertical));
      }
    }
  }, [puzzle.coordinates, wordBD]);

  // React.useEffect(() => {
  //   handlePuzzle();
  // }, []);

  React.useEffect(() => {
    let newSize = Math.max(10, Math.min(size, 25));
    if (variant === "crossword") {
      newSize = 20;
    }
    handlePuzzle(wordList, newSize);
  }, [variant]);

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <AppBar position="static" sx={{ height: 50 }}>
        <Toolbar sx={{ paddingBottom: 2 }}>
          <img src="./logo.png" alt="Logo" width="40" />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, marginLeft: 1 }}
          >
            Puzzle Generator
          </Typography>
          <Hint hint={hint} setHint={setHint} />
          <ImportExcel setData={importExcelData} />
          <ExportExcel wordBD={wordBD} wordList={wordList} title={title} />
          <ExportPDF
            crossword={puzzle.grid}
            wordList={puzzle.words}
            title={title}
            variant={variant}
            horizontalWord={horizontalWord}
            verticalWord={verticalWord}
            coordinates={puzzle.coordinates}
            hint={hint}
          />
          <Reload requestSync={handlePuzzle} />
          <ColorMode mode={mode} setMode={setMode} />
        </Toolbar>
      </AppBar>
      <Paper
        sx={{
          width: "95%",
          minWidth: 300,
          maxWidth: 1500,
          margin: "auto",
          marginTop: 3,
        }}
      >
        <Grid container spacing={2} margin={2} sx={{ padding: 2 }}>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <SelectVariant variant={variant} setVariant={setVariant} />
          </Grid>

          <Grid size={{ xs: 12, sm: 8, md: 6 }}>
            <InputTitle title={title} setTitle={setTitle} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <Size
              size={size}
              setSize={setSize}
              disabled={variant === "crossword"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <WordList
              wordList={wordList}
              setWordList={setWordList}
              size={size}
              coordinates={puzzle.coordinates}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 8 }}>
            <Box paddingTop={1} paddingBottom={1}>
              {puzzle?.grid && (
                <CrosswordGrid
                  grid={puzzle.grid}
                  size={Math.max(10, Math.min(size, 25))}
                  coordinates={puzzle.coordinates}
                />
              )}
            </Box>
          </Grid>
          {variant === "crossword" && puzzle.coordinates?.length > 0 && (
            <QuestionsList
              coordinates={puzzle.coordinates}
              wordBD={wordBD}
              setWordBD={setWordBD}
            />
          )}
        </Grid>
      </Paper>
    </ThemeProvider>
  );
}

export default React.memo(App);
