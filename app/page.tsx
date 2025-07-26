"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RotateCcw, Flag, Bomb, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type CellState = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

type GameState = "playing" | "won" | "lost"

type Difficulty = "beginner" | "intermediate" | "expert" | "custom"

const DIFFICULTY_SETTINGS = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
  custom: { rows: 10, cols: 10, mines: 15 },
}

export default function MinesweeperApp() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner")
  const [customSettings, setCustomSettings] = useState(DIFFICULTY_SETTINGS.custom)
  const [gameSettings, setGameSettings] = useState(DIFFICULTY_SETTINGS.beginner)
  const [board, setBoard] = useState<CellState[][]>([])
  const [gameState, setGameState] = useState<GameState>("playing")
  const [minesLeft, setMinesLeft] = useState(gameSettings.mines)
  const [firstClick, setFirstClick] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // 初始化空白棋盤
  const initializeBoard = useCallback((rows: number, cols: number) => {
    const newBoard: CellState[][] = []
    for (let row = 0; row < rows; row++) {
      newBoard[row] = []
      for (let col = 0; col < cols; col++) {
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
  const placeMines = useCallback(
    (board: CellState[][], excludeRow: number, excludeCol: number, rows: number, cols: number, mines: number) => {
      const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))
      let minesPlaced = 0

      while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows)
        const col = Math.floor(Math.random() * cols)

        if (!newBoard[row][col].isMine && !(row === excludeRow && col === excludeCol)) {
          newBoard[row][col].isMine = true
          minesPlaced++
        }
      }

      // 計算每個格子周圍的地雷數量
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (!newBoard[row][col].isMine) {
            let count = 0
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                const newRow = row + i
                const newCol = col + j
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                  if (newBoard[newRow][newCol].isMine) count++
                }
              }
            }
            newBoard[row][col].neighborMines = count
          }
        }
      }

      return newBoard
    },
    [],
  )

  // 揭開格子
  const revealCell = useCallback(
    (board: CellState[][], row: number, col: number, rows: number, cols: number): CellState[][] => {
      if (row < 0 || row >= rows || col < 0 || col >= cols) return board
      if (board[row][col].isRevealed || board[row][col].isFlagged) return board

      const newBoard = board.map((r) => r.map((c) => ({ ...c })))
      newBoard[row][col].isRevealed = true

      // 如果是空格子，自動揭開周圍的格子
      if (newBoard[row][col].neighborMines === 0 && !newBoard[row][col].isMine) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            revealCell(newBoard, row + i, col + j, rows, cols)
          }
        }
      }

      return newBoard
    },
    [],
  )

  // 處理格子點擊
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState !== "playing") return

      setBoard((currentBoard) => {
        let newBoard = currentBoard.map((r) => r.map((c) => ({ ...c })))

        // 第一次點擊時放置地雷
        if (firstClick) {
          newBoard = placeMines(newBoard, row, col, gameSettings.rows, gameSettings.cols, gameSettings.mines)
          setFirstClick(false)
        }

        if (newBoard[row][col].isFlagged) return newBoard

        // 如果點到地雷
        if (newBoard[row][col].isMine) {
          // 揭開所有地雷
          for (let r = 0; r < gameSettings.rows; r++) {
            for (let c = 0; c < gameSettings.cols; c++) {
              if (newBoard[r][c].isMine) {
                newBoard[r][c].isRevealed = true
              }
            }
          }
          setGameState("lost")
          return newBoard
        }

        // 揭開格子
        newBoard = revealCell(newBoard, row, col, gameSettings.rows, gameSettings.cols)

        // 檢查是否獲勝
        let revealedCount = 0
        for (let r = 0; r < gameSettings.rows; r++) {
          for (let c = 0; c < gameSettings.cols; c++) {
            if (newBoard[r][c].isRevealed) revealedCount++
          }
        }

        if (revealedCount === gameSettings.rows * gameSettings.cols - gameSettings.mines) {
          setGameState("won")
        }

        return newBoard
      })
    },
    [gameState, firstClick, placeMines, revealCell, gameSettings],
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
    setBoard(initializeBoard(gameSettings.rows, gameSettings.cols))
    setGameState("playing")
    setMinesLeft(gameSettings.mines)
    setFirstClick(true)
  }, [initializeBoard, gameSettings])

  // 應用新設定
  const applySettings = useCallback(() => {
    let newSettings = gameSettings

    if (difficulty === "custom") {
      // 驗證自定義設定
      const validRows = Math.max(5, Math.min(30, customSettings.rows))
      const validCols = Math.max(5, Math.min(30, customSettings.cols))
      const maxMines = Math.floor(validRows * validCols * 0.8)
      const validMines = Math.max(1, Math.min(maxMines, customSettings.mines))

      newSettings = {
        rows: validRows,
        cols: validCols,
        mines: validMines,
      }
      setCustomSettings(newSettings)
    } else {
      newSettings = DIFFICULTY_SETTINGS[difficulty]
    }

    setGameSettings(newSettings)
    setSettingsOpen(false)
  }, [difficulty, customSettings, gameSettings])

  // 初始化遊戲
  useEffect(() => {
    resetGame()
  }, [resetGame])

  // 獲取格子顯示內容
  const getCellContent = (cell: CellState) => {
    if (cell.isFlagged) return <Flag className="w-3 h-3 text-red-500" />
    if (!cell.isRevealed) return ""
    if (cell.isMine) return <Bomb className="w-3 h-3 text-red-600" />
    if (cell.neighborMines > 0) return cell.neighborMines
    return ""
  }

  // 獲取格子樣式
  const getCellStyle = (cell: CellState) => {
    const baseSize =
      gameSettings.cols > 16 ? "w-6 h-6 text-xs" : gameSettings.cols > 12 ? "w-7 h-7 text-sm" : "w-8 h-8 text-sm"
    let baseStyle = `${baseSize} border border-gray-400 flex items-center justify-center font-bold select-none `

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
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-800">踩地雷</CardTitle>

              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Settings className="w-4 h-4" />
                    設定
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>遊戲設定</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="difficulty">難度</Label>
                      <Select value={difficulty} onValueChange={(value: Difficulty) => setDifficulty(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">初級 (9×9, 10雷)</SelectItem>
                          <SelectItem value="intermediate">中級 (16×16, 40雷)</SelectItem>
                          <SelectItem value="expert">高級 (16×30, 99雷)</SelectItem>
                          <SelectItem value="custom">自定義</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {difficulty === "custom" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="rows">行數 (5-30)</Label>
                            <Input
                              id="rows"
                              type="number"
                              min="5"
                              max="30"
                              value={customSettings.rows}
                              onChange={(e) =>
                                setCustomSettings((prev) => ({
                                  ...prev,
                                  rows: Number.parseInt(e.target.value) || 10,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="cols">列數 (5-30)</Label>
                            <Input
                              id="cols"
                              type="number"
                              min="5"
                              max="30"
                              value={customSettings.cols}
                              onChange={(e) =>
                                setCustomSettings((prev) => ({
                                  ...prev,
                                  cols: Number.parseInt(e.target.value) || 10,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="mines">
                            地雷數 (1-{Math.floor(customSettings.rows * customSettings.cols * 0.8)})
                          </Label>
                          <Input
                            id="mines"
                            type="number"
                            min="1"
                            max={Math.floor(customSettings.rows * customSettings.cols * 0.8)}
                            value={customSettings.mines}
                            onChange={(e) =>
                              setCustomSettings((prev) => ({
                                ...prev,
                                mines: Number.parseInt(e.target.value) || 15,
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}

                    <Button onClick={applySettings} className="w-full">
                      應用設定
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Flag className="w-5 h-5 text-red-500" />
                  <span className="font-semibold">{minesLeft}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {gameSettings.rows}×{gameSettings.cols}
                </div>
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
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">🎉 恭喜獲勝！</div>
            )}

            {gameState === "lost" && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">💥 遊戲結束！</div>
            )}
          </CardHeader>

          <CardContent>
            <div className="flex justify-center">
              <div
                className="inline-block bg-gray-500 p-2 rounded overflow-auto max-w-full"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${gameSettings.cols}, 1fr)`,
                  gap: "1px",
                }}
              >
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
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center space-y-1">
              <p>點擊揭開格子，長按標記地雷</p>
              <p>
                當前難度:{" "}
                {difficulty === "beginner"
                  ? "初級"
                  : difficulty === "intermediate"
                    ? "中級"
                    : difficulty === "expert"
                      ? "高級"
                      : "自定義"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
