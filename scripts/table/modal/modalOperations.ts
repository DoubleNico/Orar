import {
  cellAlignment,
  cellAlignments,
  cellName,
  fontColor,
  fontSize,
  modalColumn,
  modalRow,
  rows,
  selectedColor,
  wrapText,
} from '../state'
import { isModalOpen } from './modalState'

export function openModal(rowIndex: number, colIndex: number) {
  if (
    rows[rowIndex][colIndex] === '0' ||
    rows[rowIndex][colIndex] === '+' ||
    rows[rowIndex][colIndex] === 'd'
  ) {
    return
  }

  cellName.value =
    rows[rowIndex][colIndex] === '1' ? '' : rows[rowIndex][colIndex]

  const key = `${rowIndex}-${colIndex}`

  if (cellAlignments.has(key)) {
    const settings = cellAlignments.get(key)
    selectedColor.value = settings?.color ?? ''
    cellAlignment.value = settings?.alignment ?? 'center'
    wrapText.value = settings?.wrapText ?? 'pre'
    fontSize.value = settings?.fontSize ?? 16
    fontColor.value = settings?.fontColor ?? ''
  } else {
    selectedColor.value = ''
    cellAlignment.value = 'center'
    wrapText.value = 'pre'
    fontSize.value = 16
    fontColor.value = ''
  }

  isModalOpen.value = true
  modalRow.value = rowIndex
  modalColumn.value = colIndex
}
