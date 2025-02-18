<template>
  <div v-if="loading" class="flex items-center justify-center">
    <div
      class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"
    ></div>
  </div>
  <div v-else class="table-container flex items-center justify-center">
    <table class="border-collapse table-fixed shadow-lg mt-10">
      <thead>
        <tr v-if="rows[0].length > 2">
          <th
            v-for="(col, colIndex) in rows[0] && rows[0].length - 1"
            :key="colIndex"
          >
            <button
              v-if="colIndex !== 0 && colIndex !== rows[0].length - 1"
              :tabindex="isModalOpen ? -1 : 0 || isSettingsModalOpen ? -1 : 0"
              class="add-button font-bold cursor-pointer text-removeColumn background-removeColumn background-removeColumn-hover text-4xl w-32 h-12"
              :title="`Remove column number ${colIndex + 1}`"
              @click.stop="removeColumn(colIndex, scheduleId, config)"
            >
              &#10005;
            </button>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex">
          <td
            v-for="(cell, colIndex) in row"
            id="cell"
            :key="colIndex"
            class="border border-table w-32 h-12 background-table-hover cursor-pointer relative"
            :title="`Click to add settings to Row: ${rowIndex + 1}, Column: ${colIndex + 1}`"
            :style="{
              backgroundColor:
                cellAlignments.get(`${rowIndex}-${colIndex}`)?.color || '',
            }"
            :class="{
              'color-button': cell === '+',
              'background-table':
                cell === '1' ||
                !cellAlignments.get(`${rowIndex}-${colIndex}`)?.color,
              'background-deleteCell': cell === 'd',
              hidden: cell === '0',
              'text-left':
                cellAlignments.get(`${rowIndex}-${colIndex}`)?.alignment ===
                'left',
              'text-center':
                cellAlignments.get(`${rowIndex}-${colIndex}`)?.alignment ===
                'center',
              'text-right':
                cellAlignments.get(`${rowIndex}-${colIndex}`)?.alignment ===
                'right',
            }"
            @click="openModal(rowIndex, colIndex)"
          >
            <p
              :style="{
                whiteSpace: cellAlignments.get(`${rowIndex}-${colIndex}`)
                  ?.wrapText,
                fontSize: `${cellAlignments.get(`${rowIndex}-${colIndex}`)?.fontSize}px`,
                color: cellAlignments.get(`${rowIndex}-${colIndex}`)?.fontColor,
              }"
            >
              {{
                cell !== '1' && cell !== 'd' && cell !== '+' && cell !== '0'
                  ? cell
                  : ''
              }}
            </p>
            <span
              v-if="cell === 'd'"
              class="font-bold cursor-pointer flex items-center justify-center text-addColumn text-4xl"
              title="Click to add Cell"
              @click.stop="addCell(scheduleId, config, rowIndex, colIndex)"
              >+</span
            >

            <span
              v-if="rowIndex === 0 && colIndex === row.length - 1"
              class="add-button font-bold cursor-pointer flex items-center justify-center text-addColumn text-4xl"
              title="Click to add Column"
              @click.stop="addColumn(scheduleId, config)"
              >+</span
            >
            <span
              v-if="rowIndex === rows.length - 1 && colIndex === 0"
              class="add-button font-bold cursor-pointer flex items-center justify-center text-addRow text-4xl"
              title="Click to add Row"
              @click.stop="addRow(scheduleId, config)"
              >+</span
            >
          </td>

          <td v-if="rowIndex !== 0 && rowIndex !== rows.length - 1">
            <button
              class="font-bold cursor-pointer flex items-center justify-center text-removeRow background-removeRow background-removeRow-hover text-4xl w-full h-full"
              :tabindex="isModalOpen ? -1 : 0 || isSettingsModalOpen ? -1 : 0"
              :title="`Remove row number ${rowIndex + 1}`"
              @click.stop="removeRow(rowIndex, scheduleId, config)"
            >
              &#10005;
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <CellInformationModal
      v-model="isModalOpen"
      :schedule-id="scheduleId"
      :config="config"
      :row="modalRow"
      :column="modalColumn"
      :cell="rows[modalRow]?.[modalColumn]"
      :initial-cell-name="cellName"
      :course="coursesList.get(`${modalRow}-${modalColumn}`)"
      @save-cell-content="updateCellContent"
      @delete-cell-content="deleteCellContent"
      @delete-cell="deleteCell"
      @open-settings="openSettings"
    />
    <SettingsModal
      v-model="isSettingsModalOpen"
      :schedule-id="scheduleId"
      :config="config"
      :initial-settings="{
        id: `${uuidv4()}`,
        color: selectedColor,
        alignment: cellAlignment,
        wrapText: wrapText,
        fontSize: fontSize,
        fontColor: fontColor,
      }"
      :initial-cell-name="cellName"
      @save="saveSettings"
      @goback="closeSettingsModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid'
import CellInformationModal from './modal/CellInformationModal.vue'
import SettingsModal from './modal/SettingsModal.vue'
import {
  rows,
  isModalOpen,
  isSettingsModalOpen,
  modalColumn,
  modalRow,
  cellName,
  selectedColor,
  cellAlignment,
  createCourses,
  wrapText,
  fontSize,
  fontColor,
  filteredRows,
  cellAlignments,
  addColumn,
  addRow,
  addCell,
  openSettings,
  closeSettingsModal,
  saveSettings,
  removeRow,
  removeColumn,
  openModal,
  createRows,
  deleteCell,
  deleteCellContent,
  updateCellContent,
  coursesList,
} from '~/scripts/cellOperations'
import type { Course } from '~/scripts/backend/types/Course'

const props = defineProps<{
  modelValue: boolean
  scheduleId: string
  initialColumn: number
  initialRow: number
  courses: Course[]
}>()
const config = useRuntimeConfig()

const loading = ref(true)

onMounted(() => {
  createRows(props.initialRow, props.initialColumn)
  createCourses(props.courses)
  loading.value = false
})
</script>
