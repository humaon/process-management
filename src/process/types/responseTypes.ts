export type ProcessResponse = {
  pid: number;
  createdTime: Date;
};

export type GetSingleProcessResponse = {
  logs: string[];
};
export type SuccessOrErrorResponse = {
  success: boolean;
} & ({ data: string[]; message?: never } | { message: string; data?: never });
