import React from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { toAlphaUpperCase } from "./Functions";

const WordList = ({
  wordList = [],
  setWordList = () => {},
  size = 10,
  coordinates = [],
}) => {
  const [newWord, setNewWord] = React.useState("");
  const addWordList = () => {
    let newWords = [...wordList, newWord.substr(0, size)];
    setWordList(newWords.sort((a, b) => a.localeCompare(b)));
    setNewWord("");
    localStorage.setItem("puzzle_words", JSON.stringify(newWords));
  };
  const deleteWordList = (index) => {
    let newWords = wordList.filter((_, i) => i !== index);
    setWordList(newWords);
    localStorage.setItem("puzzle_words", JSON.stringify(newWords));
  };
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", padding: 1 }}>
        <TextField
          label="Add word"
          variant="standard"
          size="small"
          value={newWord}
          onChange={(event) =>
            setNewWord(toAlphaUpperCase(event.target.value, size))
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              newWord.length >= 3 &&
              wordList?.length < 50 &&
              !wordList.includes(newWord)
            ) {
              addWordList();
            }
          }}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          color="inherit"
          onClick={addWordList}
          sx={{ flexGrow: 0 }}
          disabled={
            newWord.length < 3 ||
            wordList?.length >= 50 ||
            wordList.includes(newWord)
          }
        >
          <Add />
        </IconButton>
        <Typography sx={{ flexGrow: 0 }}>{wordList?.length}</Typography>
      </Box>
      <List component="div" disablePadding>
        {wordList.map((word, index) => {
          const wordWithId = coordinates?.find((coord) => coord.word === word);
          const displayText = wordWithId
            ? wordWithId.order < 10
              ? `0${String(wordWithId.order)} - ${word}`
              : `${String(wordWithId.order)} - ${word}`
            : `NA - ${word}`;
          return (
            <ListItem
              key={word + String(index)}
              sx={{
                display: "flex",
                marginBottom: -1,
                pl: 1,
                pt: 0,
                pb: 0,
                // width: "110%",
              }}
            >
              <ListItemText
                primary={displayText}
                sx={{
                  flexGrow: 1,
                  color: coordinates?.some((c) => c.word === word)
                    ? "primary.main"
                    : "warning.main",
                }}
              />

              <IconButton
                color="inherit"
                aria-label="Sync"
                component="span"
                sx={{ flexGrow: 0 }}
                onClick={() => {
                  deleteWordList(index);
                }}
              >
                <Delete />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
export default React.memo(WordList);
