import { Injectable } from '@nestjs/common';
import { fork, ChildProcess } from 'child_process';
import { ProcessInfo } from './interfaces/processInfo';
import { SuccessOrErrorResponse } from './types/responseTypes';

@Injectable()
export class ProcessService {
  private processes: ProcessInfo<ChildProcess>[] = [];

  create() {
    const currentTime = new Date();
    const child = fork('src/process/logger.js');
    const pid = child.pid;

    this.processes.push({
      pid,
      createdTime: currentTime,
      process: child,
      logs: [],
    });

    const index = this.findProcessIndexById(pid);
    child.on('message', (data: { message: string }) => {
      if (index !== -1) {
        console.log(`pid : ${pid}  ${data.message}`);
        this.processes[index]?.logs.push(data.message);
      }
    });

    return { pid, createdTime: currentTime };
  }

  findAll() {
    const processes = this.processes.map(
      (process: ProcessInfo<ChildProcess>) => {
        return { pid: process.pid, createdTime: process.createdTime };
      },
    );
    return processes;
  }

  findOne(id: number): SuccessOrErrorResponse {
    const singleProcess = this.processes.find((process) => process.pid === id);
    console.log(singleProcess);
    if (!singleProcess) {
      return {
        success: false,
        message: `Process with ID ${id} has not been found`,
      };
    }
    return { success: true, data: singleProcess.logs };
  }

  remove(id: number): SuccessOrErrorResponse {
    const processIndex = this.findProcessIndexById(id);

    if (processIndex === -1) {
      return { success: false, message: `Process with ID ${id} not found` };
    }

    const childProcess = this.processes[processIndex].process;
    childProcess.kill();
    this.processes.splice(processIndex, 1);

    return {
      success: true,
      message: `Process with ID ${id} has been successfully deleted`,
    };
  }

  private findProcessIndexById(id: number): number {
    return this.processes.findIndex(
      (process: ProcessInfo<ChildProcess>) => process.pid === id,
    );
  }
}
