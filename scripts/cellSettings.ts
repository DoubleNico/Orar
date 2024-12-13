export interface CellSettings {
  id: string
  color: string
  alignment: 'left' | 'center' | 'right'
  wrapText:
    | 'normal'
    | 'pre'
    | 'nowrap'
    | 'pre-wrap'
    | 'pre-line'
    | 'break-spaces'
  fontSize: number
  fontColor: string
}
