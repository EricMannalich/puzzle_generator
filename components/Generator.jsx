const HORIZONTAL = "horizontal";
const VERTICAL = "vertical";
const DIAGONAL_DOWN = "diagonal_down";
const DIAGONAL_UP = "diagonal_up";

function placeWord(grid, word, row, col, direction, size = 0, space = true) {
  // Place a word in the grid.
  if (direction === HORIZONTAL) {
    if (size > 0) {
      if (col > 0) {
        if (grid[row][col - 1] === " ") {
          grid[row][col - 1] = "-";
        }
      }
      if (col + word.length < size) {
        if (grid[row][col + word.length] === " ") {
          grid[row][col + word.length] = "-";
        }
      }
    }
    for (let i = 0; i < word.length; i++) {
      if (space) {
        if (row > 0 && grid[row - 1][col + i] === " ") {
          grid[row - 1][col + i] = "+";
        }
        if (row < size - 1 && grid[row + 1][col + i] === " ") {
          grid[row + 1][col + i] = "+";
        }
      }
      grid[row][col + i] = word[i];
    }
  } else if (direction === VERTICAL) {
    if (size > 0) {
      if (row > 0) {
        if (grid[row - 1][col] === " ") {
          grid[row - 1][col] = "-";
        }
      }
      if (row + word.length < size) {
        if (grid[row + word.length][col] === " ") {
          grid[row + word.length][col] = "-";
        }
      }
    }
    for (let i = 0; i < word.length; i++) {
      if (space) {
        if (col > 0 && grid[row + i][col - 1] === " ") {
          grid[row + i][col - 1] = "*";
        }
        if (col < size - 1 && grid[row + i][col + 1] === " ") {
          grid[row + i][col + 1] = "*";
        }
      }
      grid[row + i][col] = word[i];
    }
  } else if (direction === DIAGONAL_DOWN) {
    for (let i = 0; i < word.length; i++) {
      grid[row + i][col + i] = word[i];
    }
  } else if (direction === DIAGONAL_UP) {
    for (let i = 0; i < word.length; i++) {
      grid[row - i][col + i] = word[i];
    }
  }
  return word;
}

function canPlaceWord(grid, size, word, row, col, direction) {
  // Check if a word can be placed at a specific position.
  if (direction === HORIZONTAL) {
    if (col + word.length > size) {
      return false;
    }
    if (col > 0) {
      if (![" ", "-", "*"].includes(grid[row][col - 1])) {
        return false;
      }
    }
    if (col + word.length < size) {
      if (![" ", "-", "*"].includes(grid[row][col + word.length])) {
        return false;
      }
    }
    for (let i = 0; i < word.length; i++) {
      if (![" ", "*", word[i]].includes(grid[row][col + i])) {
        return false;
      }
    }
  } else if (direction === VERTICAL) {
    if (row + word.length > size) {
      return false;
    }
    if (row > 0) {
      if (![" ", "-", "+"].includes(grid[row - 1][col])) {
        return false;
      }
    }
    if (row + word.length < size) {
      if (![" ", "-", "+"].includes(grid[row + word.length][col])) {
        return false;
      }
    }
    for (let i = 0; i < word.length; i++) {
      if (![" ", "+", word[i]].includes(grid[row + i][col])) {
        return false;
      }
    }
  } else if (direction === DIAGONAL_DOWN) {
    if (row + word.length > size || col + word.length > size) {
      return false;
    }
    for (let i = 0; i < word.length; i++) {
      if (![" ", word[i]].includes(grid[row + i][col + i])) {
        return false;
      }
    }
  } else if (direction === DIAGONAL_UP) {
    if (row - word.length < -1 || row > size - 1 || col + word.length > size) {
      return false;
    }
    for (let i = 0; i < word.length; i++) {
      if (![" ", word[i]].includes(grid[row - i][col + i])) {
        return false;
      }
    }
  }
  return true;
}

function findIntersection(grid, size, word, DIAGONAL = true) {
  //Find all valid positions to place a word intersecting with already placed words.
  let possiblePositions = [];
  for (let i = 0; i < word.length; i++) {
    let letter = word[i];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === letter) {
          if (
            row - i >= 0 &&
            canPlaceWord(grid, size, word, row - i, col, VERTICAL)
          ) {
            return [row - i, col, VERTICAL];
          }
          if (
            col - i >= 0 &&
            canPlaceWord(grid, size, word, row, col - i, HORIZONTAL)
          ) {
            return [row, col - i, HORIZONTAL];
          }
          if (
            DIAGONAL &&
            row - i >= 0 &&
            col - i >= 0 &&
            canPlaceWord(grid, size, word, row - i, col - i, DIAGONAL_DOWN)
          ) {
            return [row - i, col - i, DIAGONAL_DOWN];
          }
          if (
            DIAGONAL &&
            col - i >= 0 &&
            canPlaceWord(grid, size, word, row + i, col - i, DIAGONAL_UP)
          ) {
            return [row + i, col - i, DIAGONAL_UP];
          }
        }
      }
    }
  }
  if (possiblePositions.length > 0) {
    return possiblePositions[
      Math.floor(Math.random() * possiblePositions.length)
    ];
  }
  return null;
}

function generateSoup(words, size, dense) {
  let grid = Array.from({ length: size }, () => Array(size).fill(" "));
  let coordinatesWords = [];
  let firstWord = true;

  for (let index = 0; index < words.length; index++) {
    let word = words[index];
    let placed = false;
    let attempts = 0;

    if (word.length > size) {
      continue;
    }

    let reverseRandomWord = word;
    if (Math.random() < 0.5) {
      reverseRandomWord = word.split("").reverse().join("");
    }

    if (dense) {
      if (firstWord) {
        firstWord = false;
        let direction = [HORIZONTAL, VERTICAL, DIAGONAL_DOWN, DIAGONAL_UP][
          Math.floor(Math.random() * 4)
        ];
        let row = Math.floor(size / 2 + 1);
        let col = Math.floor(Math.random() * 4);
        if (canPlaceWord(grid, size, reverseRandomWord, row, col, direction)) {
          placeWord(grid, reverseRandomWord, row, col, direction, size);
          coordinatesWords.push({
            id: index,
            row: row,
            col: col,
            direction: direction,
            len: word.length,
            word: word,
          });
          placed = true;
          continue;
        }
      }

      let intersection = findIntersection(grid, size, reverseRandomWord);
      if (intersection) {
        let [row, col, direction] = intersection;
        placeWord(grid, reverseRandomWord, row, col, direction, size);
        coordinatesWords.push({
          id: index,
          row: row,
          col: col,
          direction: direction,
          len: word.length,
          word: word,
        });
        placed = true;
      }
    }

    while (!placed && attempts < 100) {
      let direction = [HORIZONTAL, VERTICAL, DIAGONAL_DOWN, DIAGONAL_UP][
        Math.floor(Math.random() * 4)
      ];
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);
      if (canPlaceWord(grid, size, reverseRandomWord, row, col, direction)) {
        placeWord(grid, reverseRandomWord, row, col, direction, size);
        coordinatesWords.push({
          id: index,
          row: row,
          col: col,
          direction: direction,
          len: word.length,
          word: word,
        });
        placed = true;
      }
      attempts++;
    }
  }
  return [grid, coordinatesWords];
}

function generateCrossword(words, size, dense) {
  let grid = Array.from({ length: size }, () => Array(size).fill(" "));
  let coordinatesWords = [];
  let firstWord = true;
  let wordsListDict = [];

  for (let index = 0; index < words.length; index++) {
    let word = words[index];
    if (word.length > size) {
      continue;
    }

    if (firstWord) {
      firstWord = false;
      let direction = [HORIZONTAL, VERTICAL][Math.floor(Math.random() * 2)];
      let row, col;
      if (direction === HORIZONTAL) {
        row = Math.floor(size / 2 + 1);
        col = Math.floor(Math.random() * (size - word.length));
      } else {
        row = Math.floor(Math.random() * (size - word.length));
        col = Math.floor(size / 2 + 1);
      }
      placeWord(grid, word, row, col, direction, size);
      coordinatesWords.push({
        id: index,
        row: row,
        col: col,
        direction: direction,
        len: word.length,
        word: word,
      });
      continue;
    }

    let intersection = findIntersection(grid, size, word, false);
    if (intersection) {
      let space = Math.random() < 0.5 ? true : dense;
      let [row, col, direction] = intersection;
      placeWord(grid, word, row, col, direction, size, space);
      coordinatesWords.push({
        id: index,
        row: row,
        col: col,
        direction: direction,
        len: word.length,
        word: word,
      });
      continue;
    } else {
      wordsListDict.push({ word: word, index: index });
    }
  }

  for (let wordDict of wordsListDict) {
    let intersection = findIntersection(grid, size, wordDict.word, false);
    if (intersection) {
      let space = Math.random() < 0.5 ? true : dense;
      let [row, col, direction] = intersection;
      placeWord(grid, wordDict.word, row, col, direction, size, space);
      coordinatesWords.push({
        id: wordDict.index,
        row: row,
        col: col,
        direction: direction,
        len: wordDict.word.length,
        word: wordDict.word,
      });
    }
  }

  return [grid, coordinatesWords];
}

export function puzzleGenerator(words, size, variant) {
  words.sort((a, b) => b.length - a.length);
  size = Math.max(10, Math.min(size, 25));
  let grid, coordinatesWords;

  if (variant === "crossword") {
    [grid, coordinatesWords] = generateCrossword(words, size, false);
  } else if (variant === "fillin") {
    [grid, coordinatesWords] = generateCrossword(words, size, true);
  } else if (variant === "soup") {
    [grid, coordinatesWords] = generateSoup(words, size, false);
  } else if (variant === "densesoup") {
    [grid, coordinatesWords] = generateSoup(words, size, true);
  } else {
    return { words: words, grid: {}, coordinates: [] };
  }

  coordinatesWords.sort((a, b) => a.row - b.row || a.col - b.col);
  let order = 0;

  for (let i = 0; i < coordinatesWords.length; i++) {
    if (
      i > 0 &&
      coordinatesWords[i].row === coordinatesWords[i - 1].row &&
      coordinatesWords[i].col === coordinatesWords[i - 1].col
    ) {
      coordinatesWords[i].order = order;
    } else {
      order++;
      coordinatesWords[i].order = order;
    }
  }

  grid = grid.map((row) =>
    row.map((cell) => (["-", "+", "*"].includes(cell) ? " " : cell))
  );
  let result = { words: words, grid: grid, coordinates: coordinatesWords };
  return result;
}
