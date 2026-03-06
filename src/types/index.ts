export type RunStatus = 'QUEUED' | 'RUNNING' | 'PASS' | 'FAIL' | 'ERROR'
export type ActionType = 'click' | 'type' | 'scroll' | 'pressKey' | 'navigate' | 'wait' | 'done'

export interface BoundingBox {
  x: number
  y: number
  w: number
  h: number
  label: string
  color: 'green' | 'red' | 'yellow' | 'blue'
}

export interface StepRecord {
  step: number
  action: ActionType
  target: string
  value?: string
  reasoning: string
  narration: string
  success: boolean
  annotation?: BoundingBox
  durationMs: number
  timestamp: string
}
