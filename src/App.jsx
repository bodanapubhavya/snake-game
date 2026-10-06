import { useEffect, useState } from "react";
import "./App.css";

const BOARD_SIZE = 20;

function getRandomFood(snake) {
  let food;

  do {
    food = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (
    snake.some(
      (part) => part.x === food.x && part.y === food.y
    )
  );

  return food;
}

function App() {
  const initialSnake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];

  const [snake, setSnake] = useState(initialSnake);

  const [food, setFood] = useState({
    x: 15,
    y: 10,
  });

  const [direction, setDirection] = useState("RIGHT");

  const [score, setScore] = useState(0);

  const [gameOver, setGameOver] = useState(false);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowUp" && direction !== "DOWN") {
        setDirection("UP");
      }

      if (event.key === "ArrowDown" && direction !== "UP") {
        setDirection("DOWN");
      }

      if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        setDirection("LEFT");
      }

      if (event.key === "ArrowRight" && direction !== "LEFT") {
        setDirection("RIGHT");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [direction]);

  // Game movement
  useEffect(() => {
    if (gameOver) {
      return;
    }

    const interval = setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];

        const newHead = {
          x: head.x,
          y: head.y,
        };

        // Move snake
        if (direction === "UP") {
          newHead.y--;
        }

        if (direction === "DOWN") {
          newHead.y++;
        }

        if (direction === "LEFT") {
          newHead.x--;
        }

        if (direction === "RIGHT") {
          newHead.x++;
        }

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE
        ) {
          setGameOver(true);
          return currentSnake;
        }

        // Snake collision
        if (
          currentSnake.some(
            (part) =>
              part.x === newHead.x &&
              part.y === newHead.y
          )
        ) {
          setGameOver(true);
          return currentSnake;
        }

        // Add new head
        const newSnake = [newHead, ...currentSnake];

        // Food collision
        if (
          newHead.x === food.x &&
          newHead.y === food.y
        ) {
          setScore((previousScore) => previousScore + 1);

          setFood(getRandomFood(newSnake));
        } else {
          // Remove tail
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => {
      clearInterval(interval);
    };
  }, [direction, food, gameOver]);

  // Restart game
  const restartGame = () => {
    const newSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];

    setSnake(newSnake);

    setFood(getRandomFood(newSnake));

    setDirection("RIGHT");

    setScore(0);

    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="game-card">

        <h1>🐍 Snake Game</h1>

        <div className="score">
          Score: {score}
        </div>

        <div className="board">

          {Array.from({
            length: BOARD_SIZE * BOARD_SIZE,
          }).map((_, index) => {
            const x = index % BOARD_SIZE;

            const y = Math.floor(
              index / BOARD_SIZE
            );

            const snakePart = snake.find(
              (part) =>
                part.x === x &&
                part.y === y
            );

            const isFood =
              food.x === x &&
              food.y === y;

            return (
              <div
                key={index}
                className={`cell ${
                  snakePart ? "snake" : ""
                } ${
                  snakePart === snake[0]
                    ? "head"
                    : ""
                } ${
                  isFood ? "food" : ""
                }`}
              >
                {isFood && "🍎"}
              </div>
            );
          })}

          {gameOver && (
            <div className="game-over">

              <h2>Game Over!</h2>

              <p>
                Final Score: {score}
              </p>

              <button
                onClick={restartGame}
              >
                Play Again
              </button>

            </div>
          )}

        </div>

        <p className="instructions">
          Use ⬆️ ⬇️ ⬅️ ➡️ to move
        </p>

        {!gameOver && (
          <button
            className="restart"
            onClick={restartGame}
          >
            Restart Game
          </button>
        )}

      </div>
    </div>
  );
}

export default App;