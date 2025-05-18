import type { Course } from '../backend/types/Course'
import type { CellSettings } from './types/CellSettings'

export const rows = reactive([
  ['1', '+'],
  ['+', '0'],
])

export const modalColumn = ref(0)
export const modalRow = ref(0)
export const columnsCount = ref(0)
export const rowsCount = ref(1)
export const cellName = ref('')
export const selectedColor = ref('')
export const cellAlignment = ref<'center' | 'left' | 'right'>('center')
export const wrapText = ref<
  'pre' | 'normal' | 'nowrap' | 'pre-wrap' | 'pre-line' | 'break-spaces'
>('pre')
export const fontSize = ref(16)
export const fontColor = ref('')

export const cellAlignments = reactive(new Map<string, CellSettings>())
export const coursesList = reactive(new Map<string, Course>())

export const filteredRows = computed(() => {
  return rows.map((row) => row.filter((cell) => cell !== '0'))
})

export const newCoursesList = new Map<string, Course>()
export const newCellAlignments = new Map<string, CellSettings>()
