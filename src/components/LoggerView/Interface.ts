export enum LogType {
    API = 'API',
    LOG = 'LOG',
    ZUSTAND = 'ZUSTAND'
}
export interface ILogger {
  type?: LogType,
  data?: any,
  createdAt: string,
}
