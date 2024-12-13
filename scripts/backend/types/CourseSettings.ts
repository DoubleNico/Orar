export interface CourseSettings {
  id: string
  color: string
  alignment: 'center' | 'left' | 'right'
  wrapText:
    | 'pre'
    | 'normal'
    | 'nowrap'
    | 'pre-wrap'
    | 'pre-line'
    | 'break-spaces'
  fontSize: number
  fontColor: string
}
