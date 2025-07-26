"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, Flag, Bomb } from "lucide-react"

type CellState = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

type GameState = "playing" | "won" | "lost"

const ROWS = 10
const COLS = 10
const MINES = 15

export default function MinesweeperApp() {
  const [board, setBoard] = useState<CellState[][]>([])
  const [gameState, setGameState] = useState<GameState>("playing")
  const [minesLeft, setMinesLeft] = useState(MINES)
  const [firstClick, setFirstClick] = useState(true)

  // 初始化空白棋盤
  const initializeBoard = useCallback(() => {
    const newBoard: CellState[][] = []
    for (let row = 0; row < ROWS; row++) {
      newBoard[row] = []
      for (let col = 0; col < COLS; col++) {
        newBoard[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        }
      }
    }
    return newBoard
  }, [])

  // 放置地雷
  const placeMines = useCallback((board: CellState[][], excludeRow: number, excludeCol: number) => {
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))
    let minesPlaced = 0

    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS)
      const col = Math.floor(Math.random() * COLS)

      if (!newBoard[row][col].isMine && !(row === excludeRow && col === excludeCol)) {
        newBoard[row][col].isMine = true
        minesPlaced++
      }
    }

    // 計算每個格子周圍的地雷數量
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i
              const newCol = col + j
              if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
                if (newBoard[newRow][newCol].isMine) count++
              }
            }
          }
          newBoard[row][col].neighborMines = count
        }
      }
    }

    return newBoard
  }, [])

  // 揭開格子
  const revealCell = useCallback((board: CellState[][], row: number, col: number): CellState[][] => {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return board
    if (board[row][col].isRevealed || board[row][col].isFlagged) return board

    const newBoard = board.map((r) => r.map((c) => ({ ...c })))
    newBoard[row][col].isRevealed = true

    // 如果是空格子，自動揭開周圍的格子
    if (newBoard[row][col].neighborMines === 0 && !newBoard[row][col].isMine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(newBoard, row + i, col + j)
        }
      }
    }

    return newBoard
  }, [])

  // 處理格子點擊
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState !== "playing") return

      setBoard((currentBoard) => {
        let newBoard = currentBoard.map((r) => r.map((c) => ({ ...c })))

        // 第一次點擊時放置地雷
        if (firstClick) {
          newBoard = placeMines(newBoard, row, col)
          setFirstClick(false)
        }

        if (newBoard[row][col].isFlagged) return newBoard

        // 如果點到地雷
        if (newBoard[row][col].isMine) {
          // 揭開所有地雷
          for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
              if (newBoard[r][c].isMine) {
                newBoard[r][c].isRevealed = true
              }
            }
          }
          setGameState("lost")
          return newBoard
        }

        // 揭開格子
        newBoard = revealCell(newBoard, row, col)

        // 檢查是否獲勝
        let revealedCount = 0
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (newBoard[r][c].isRevealed) revealedCount++
          }
        }

        if (revealedCount === ROWS * COLS - MINES) {
          setGameState("won")
        }

        return newBoard
      })
    },
    [gameState, firstClick, placeMines, revealCell],
  )

  // 處理長按標記
  const handleCellLongPress = useCallback(
    (row: number, col: number) => {
      if (gameState !== "playing") return

      setBoard((currentBoard) => {
        const newBoard = currentBoard.map((r) => r.map((c) => ({ ...c })))

        if (!newBoard[row][col].isRevealed) {
          newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged
          setMinesLeft((prev) => (newBoard[row][col].isFlagged ? prev - 1 : prev + 1))
        }

        return newBoard
      })
    },
    [gameState],
  )

  // 重新開始遊戲
  const resetGame = useCallback(() => {
    setBoard(initializeBoard())
    setGameState("playing")
    setMinesLeft(MINES)
    setFirstClick(true)
  }, [initializeBoard])

  // 初始化遊戲
  useEffect(() => {
    resetGame()
  }, [resetGame])

  // 獲取格子顯示內容
  const getCellContent = (cell: CellState) => {
    if (cell.isFlagged) return <Flag className="w-4 h-4 text-red-500" />
    if (!cell.isRevealed) return ""
    if (cell.isMine) return <Bomb className="w-4 h-4 text-red-600" />
    if (cell.neighborMines > 0) return cell.neighborMines
    return ""
  }

  // 獲取格子樣式
  const getCellStyle = (cell: CellState) => {
    let baseStyle = "w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold select-none "

    if (cell.isRevealed) {
      if (cell.isMine) {
        baseStyle += "bg-red-500 text-white"
      } else {
        baseStyle += "bg-gray-200 "
        // 根據周圍地雷數量設置顏色
        const colors = [
          "",
          "text-blue-600",
          "text-green-600",
          "text-red-600",
          "text-purple-600",
          "text-yellow-600",
          "text-pink-600",
          "text-black",
          "text-gray-600",
        ]
        baseStyle += colors[cell.neighborMines] || ""
      }
    } else {
      baseStyle += "bg-gray-300 hover:bg-gray-250 active:bg-gray-400"
    }

    return baseStyle
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        <Card className="p-6 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">踩地雷</h1>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-500" />
                <span className="font-semibold">{minesLeft}</span>
              </div>

              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <RotateCcw className="w-4 h-4" />
                重新開始
              </Button>
            </div>

            {gameState === "won" && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                🎉 恭喜獲勝！
              </div>
            )}

            {gameState === "lost" && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">💥 遊戲結束！</div>
            )}
          </div>

          <div className="grid grid-cols-10 gap-0.5 justify-center bg-gray-500 p-2 rounded">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellStyle(cell)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    handleCellLongPress(rowIndex, colIndex)
                  }}
                  onTouchStart={(e) => {
                    const timer = setTimeout(() => {
                      handleCellLongPress(rowIndex, colIndex)
                    }, 500)

                    const cleanup = () => {
                      clearTimeout(timer)
                      e.target.removeEventListener("touchend", cleanup)
                      e.target.removeEventListener("touchmove", cleanup)
                    }

                    e.target.addEventListener("touchend", cleanup)
                    e.target.addEventListener("touchmove", cleanup)
                  }}
                >
                  {getCellContent(cell)}
                </button>
              )),
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>點擊揭開格子</p>
            <p>長按標記地雷</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
