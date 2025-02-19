import type { Course } from '../backend/types/Course'
import { cellAlignments, coursesList, rows } from './state'

export function createCourses(courses: Course[]) {
  for (const course of courses) {
    const row = course.row
    const column = course.column
    coursesList.set(`${row}-${column}`, course)
    const cell = rows[row][column]
    if (cell === '1') rows[row][column] = course.title
    if (course.settings) cellAlignments.set(`${row}-${column}`, course.settings)
  }
}
