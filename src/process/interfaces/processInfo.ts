export interface ProcessInfo<T> {
  pid: number;
  createdTime: Date;
  logs: string[];
  process: T;
}
