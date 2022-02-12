import "./index.css";
import { useEffect, useState } from "react";
import BlueCandy from "./images/blue-candy.png";
import OrangeCandy from "./images/orange-candy.png";
import GreenCandy from "./images/green-candy.png";
import RedCandy from "./images/red-candy.png";
import YellowCandy from "./images/yellow-candy.png";
import PurpleCandy from "./images/purple-candy.png";
import blank from "./images/blank.png";
import ScoreBoard from "./components/ScoreBoard";

const width = 8;
const candyColors = [
  BlueCandy,
  GreenCandy,
  OrangeCandy,
  PurpleCandy,
  RedCandy,
  YellowCandy,
];
const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [score, setScore] = useState(0);

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = decidedColor === blank;
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      if (notValid.includes(i)) continue;
      if (
        rowOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        ) &&
        !isBlank
      ) {
        rowOfThree.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        setScore((score) => score + 3);
        return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = decidedColor === blank;
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      if (notValid.includes(i)) continue;
      if (
        rowOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor
        ) &&
        !isBlank
      ) {
        rowOfFour.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        setScore((score) => score + 4);
        return true;
      }
    }
  };
  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 55; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = decidedColor === blank;
      if (
        columnOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        ) &&
        !isBlank
      ) {
        columnOfThree.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        setScore((score) => score + 3);
        return true;
      }
    }
  };

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];

      const decidedColor = currentColorArrangement[i];
      const isBlank = decidedColor === blank;
      if (
        columnOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor
        ) &&
        !isBlank
      ) {
        columnOfFour.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        setScore((score) => score + 4);
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    //don't need to check last row
    for (let i = 0; i < 64 - width; i++) {
      //if it is blank below and current color is red then the blank will turn to red
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && currentColorArrangement[i] == blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNumber];
      }
      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  };

  const dragStart = (e) => {
    console.log(e.target);
    console.log("drag start");
    setSquareBeingDragged(e.target);
  };

  const dragDrop = (e) => {
    console.log(e.target);
    console.log("drag drop");
    setSquareBeingReplaced(e.target);
  };

  const dragEnd = (e) => {
    console.log(e.target);
    console.log("drag end");
    // check if move is valid
    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute("data-id")
    );
    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute("data-id")
    );

    currentColorArrangement[squareBeingReplacedId] =
      squareBeingDragged.getAttribute("src");
    currentColorArrangement[squareBeingDraggedId] =
      squareBeingReplaced.getAttribute("src");

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + width,
      squareBeingDraggedId + 1,
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if (
      squareBeingReplacedId &&
      validMove &&
      (isAColumnOfThree || isARowOfFour || isAColumnOfFour || isARowOfThree)
    ) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] =
        squareBeingReplaced.getAttribute("src");
      currentColorArrangement[squareBeingDraggedId] =
        squareBeingDragged.getAttribute("src");
      setCurrentColorArrangement([...currentColorArrangement]);
    }
    // console.log(score);
    // console.log(squareBeingDraggedId);
    // console.log(squareBeingReplacedId);
  };
  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < Math.pow(width, 2); i++) {
      const randomNumber = Math.floor(Math.random() * candyColors.length);
      const randomColor = candyColors[randomNumber];

      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfThree();
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfThree,
    currentColorArrangement,
    checkForColumnOfFour,
    checkForRowOfThree,
    checkForRowOfFour,
    moveIntoSquareBelow,
  ]);

  return (
    <div className="App">
      {" "}
      <ScoreBoard score={score} />
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            src={candyColor}
            data-id={index}
            key={index}
            // style={{ backgroundColor: candyColor }}
            alt={candyColor}
            draggable
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            onDragStart={dragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
