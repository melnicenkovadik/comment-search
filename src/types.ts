export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ApiError {
  type: ErrorType
  message: string
}

export interface Comment {
  id: number
  name: string
  email: string
  body: string
}

export interface Suggestion {
  text: string
  fullComment: string
}
