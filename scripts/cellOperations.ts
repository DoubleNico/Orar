import { ref, reactive, computed } from 'vue'
import type { CellSettings } from '~/scripts/cellSettings'
import {
  isModalOpen,
  isSettingsModalOpen,
  openSettings,
  closeSettingsModal,
} from '~/scripts/modalState'

const rows = reactive([
  ['1', '+'],
  ['+', '0'],
])

const modalColumn = ref(0)
const modalRow = ref(0)
const cellName = ref('')
const selectedColor = ref('#000000')
const cellAlignment = ref<'center' | 'left' | 'right'>('center')
const wrapText = ref<
  'pre' | 'normal' | 'nowrap' | 'pre-wrap' | 'pre-line' | 'break-spaces'
>('pre')
const fontSize = ref(16)
const fontColor = ref('#000000')

const filteredRows = computed(() => {
  return rows.map((row) => row.filter((cell) => cell !== '0'))
})

function addColumn() {
  rows.forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      row.splice(row.length - 1, 0, '1')
    } else if (rowIndex < rows.length) {
      row.splice(row.length - 1, 0, '1')
    } else {
      row.splice(row.length - 1, 0, '0')
    }
  })
  validateTable()
}

function addRow() {
  if (rows.length > 0) {
    rows[rows.length - 1][0] = '1'
  }

  const numberOfColumns = rows[0].length
  const newRow = new Array(numberOfColumns).fill('1')
  newRow[0] = '+'
  newRow[numberOfColumns - 1] = '0'
  rows.push(newRow)
  validateTable()
}

function cleanTable() {
  rows[rows.length - 1].forEach((_cell, index) => {
    if (index !== 0) {
      rows[rows.length - 1][index] = '0'
    }
  })
}

function validateTable() {
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

function addCell(rowIndex: number, colIndex: number) {
  rows[rowIndex][colIndex] = '1'
  isModalOpen.value = false
}

const cellAlignments = reactive(new Map<string, CellSettings>())

function saveSettings(settings: CellSettings) {
  cellAlignments.set(`${modalRow.value}-${modalColumn.value}`, settings)
  selectedColor.value = settings.color
  cellAlignment.value = settings.alignment
  wrapText.value = settings.wrapText
  fontSize.value = settings.fontSize
  isSettingsModalOpen.value = false
  isModalOpen.value = true
}

function removeRow(rowIndex: number) {
  if (rows.length > 2) {
    rows.splice(rowIndex, 1)

    const newCellAlignments = new Map<string, CellSettings>()
    cellAlignments.forEach((value, key) => {
      const [rIndex, cIndex] = key.split('-').map(Number)
      if (rIndex < rowIndex) {
        newCellAlignments.set(key, value)
      } else if (rIndex > rowIndex) {
        const newKey = `${rIndex - 1}-${cIndex}`
        newCellAlignments.set(newKey, value)
      }
    })
    cellAlignments.clear()
    newCellAlignments.forEach((value, key) => {
      cellAlignments.set(key, value)
    })

    validateTable()
  }
}

function removeColumn(colIndex: number) {
  if (rows[0].length > 2) {
    rows.forEach((row) => row.splice(colIndex, 1))

    const newCellAlignments = new Map<string, CellSettings>()
    cellAlignments.forEach((value, key) => {
      const [rIndex, cIndex] = key.split('-').map(Number)
      if (cIndex < colIndex) {
        newCellAlignments.set(key, value)
      } else if (cIndex > colIndex) {
        const newKey = `${rIndex}-${cIndex - 1}`
        newCellAlignments.set(newKey, value)
      }
    })
    cellAlignments.clear()
    newCellAlignments.forEach((value, key) => {
      cellAlignments.set(key, value)
    })

    validateTable()
  }
}
function openModal(rowIndex: number, colIndex: number) {
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
    selectedColor.value = settings?.color ?? '#000000'
    cellAlignment.value = settings?.alignment ?? 'center'
    wrapText.value = settings?.wrapText ?? 'pre'
    fontSize.value = settings?.fontSize ?? 16
    fontColor.value = settings?.fontColor ?? '#000000'
  } else {
    selectedColor.value = '#000000'
    cellAlignment.value = 'center'
    wrapText.value = 'pre'
    fontSize.value = 16
    fontColor.value = '#000000'
  }

  isModalOpen.value = true
  modalRow.value = rowIndex
  modalColumn.value = colIndex
}

function deleteCell() {
  if (rows.length > 2 && rows[modalRow.value].length > 2) {
    rows[modalRow.value][modalColumn.value] = 'd'
    const key = `${modalRow.value}-${modalColumn.value}`
    cellAlignments.delete(key)
    cellName.value = ''
    isModalOpen.value = false
  }
}

function deleteCellContent() {
  rows[modalRow.value][modalColumn.value] = '1'
  cellName.value = ''
  isModalOpen.value = false
}

function updateCellContent(newContent: string) {
  rows[modalRow.value][modalColumn.value] = newContent || '1'
}
export {
  rows,
  isModalOpen,
  isSettingsModalOpen,
  modalColumn,
  modalRow,
  cellName,
  selectedColor,
  cellAlignment,
  wrapText,
  fontSize,
  fontColor,
  filteredRows,
  cellAlignments,
  addColumn,
  addRow,
  cleanTable,
  validateTable,
  addCell,
  openSettings,
  closeSettingsModal,
  saveSettings,
  removeRow,
  removeColumn,
  openModal,
  deleteCell,
  deleteCellContent,
  updateCellContent,
}
