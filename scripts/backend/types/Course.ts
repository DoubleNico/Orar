import type { CourseSettings } from './CourseSettings'
import type { User } from './User'

export interface Course {
  id: string
  title: string
  row: number
  column: number
  creator: User
  settings: CourseSettings | null
  start: number
  end: number
  createdAt: number
}
