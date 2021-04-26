import React, { useEffect, useState } from "react";
import "./App.css";

const numRows: number = 50;
const numCols: number = 50;

const initGrid = (x: number, y: number): Grid => {
  const arr = [];
  for (let i = 0; i < x; i++) {
    arr.push(Array(numCols).map((c) => 0));
    for (let j = 0; j < y; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
};

type Grid = number[][];

const operations: number[][]= [
  [-1,-1],
  [-1, 0],
  [-1,1],
  [0, -1],
  [0,1],
  [1,-1],
  [1,0],
  [1, 1],
];

const simulate = (grid: Grid): Grid => {
  // Note! It's important that this be a deep clone, Immer offers the produce method.
  const newGrid = JSON.parse(JSON.stringify(grid));

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      let cell = grid[r][c];

      let liveNeighbors = 0;
      operations.forEach(([ro, co]) => {
        if (
          r + ro < numRows &&
          c + co < numCols &&
          r + ro >= 0 &&
          c + co >= 0
        ) {
          if (r === 1 && c === 1) {
            debugger;
          }
          const neighbor: number = grid[r+ro][c+co];
          liveNeighbors += neighbor;
        }
      });
      if (cell === 1) {
        debugger;
      }
      if (cell === 1 && liveNeighbors < 2) {
        cell = 0;
      } else if (cell === 1 && (liveNeighbors === 2 || liveNeighbors === 3)) {
        console.log(r, c);
        cell = 1;
      } else if (cell === 1 && liveNeighbors > 3) {
        cell = 0;
      } else if (cell === 0 && liveNeighbors === 3) {
        cell = 1;
      }
      newGrid[r][c] = cell;
    }
  }
  return newGrid;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return initGrid(numCols, numRows);
  });

  const [running, toggleRunning] = useState(false);

  useEffect(() => {
    let ticker: NodeJS.Timeout = setInterval(() => {}, 0);

    if (running) {
      ticker = setInterval(() => {
        setGrid((g) => {
          return simulate(g);
        });
      }, 100);
    }

    if (!running) {
      clearInterval(ticker);
    }

    const cleanUp = () => {
      clearInterval(ticker as any)
    };
    return cleanUp;
  }, [running]);

  const updateGrid = (x: number, y: number, val: number) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[x][y] = val;
    setGrid(newGrid);
  };

  return (
    <>
      <button
        onClick={() => {
          toggleRunning(!running);
        }}
      >
        {`${running ? "stop" : "start"}`}
      </button>
      <div className="game">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numCols}, 20px)`,
            gridTemplateRows: `repeat(${numRows}, 20px)`,
          }}
        >
          {grid.map((rows, i) => {
            return rows.map((col, j) => {
              const val = grid[i][j];
              let color = val === 1 ? "orange" : "blue";

              return (
                <div
                  key={`${i}--${j}`}
                  onClick={(_ev) => updateGrid(i, j, val === 1 ? 0 : 1)}
                  style={{
                    border: `1px solid black`,
                    background: `${color}`,
                  }}
                ></div />)
            });
          })}
        </div>
      </div>
    </>
  );
}

export default App;
