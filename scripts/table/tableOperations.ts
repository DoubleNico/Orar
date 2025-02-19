import { rows } from './state'

export function cleanTable() {
  rows[rows.length - 1].forEach((_cell, index) => {
    if (index !== 0) {
      rows[rows.length - 1][index] = '0'
    }
  })
}

export function validateTable() {
  const numberOfRows = rows.length
  const numberOfColumns = rows[0].length

  rows[0][numberOfColumns - 1] = '+'
  rows[numberOfRows - 1][0] = '+'

  for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
    for (let colIndex = 0; colIndex < numberOfColumns; colIndex++) {
      if (rowIndex === 0 && colIndex === numberOfColumns - 1) continue
      if (rowIndex === numberOfRows - 1 && colIndex === 0) continue
      if (
        rows[rowIndex][colIndex] === '0' ||
        rows[rowIndex][colIndex] === '1'
      ) {
        rows[rowIndex][colIndex] = colIndex === numberOfColumns - 1 ? '0' : '1'
      }
    }
  }
  cleanTable()
}
