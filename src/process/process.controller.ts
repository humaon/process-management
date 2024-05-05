import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ProcessService } from './process.service';
import {
  ProcessResponse,
  GetSingleProcessResponse,
} from './types/responseTypes';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post()
  create(): ProcessResponse {
    return this.processService.create();
  }

  @Get()
  findAll(): ProcessResponse[] {
    return this.processService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): GetSingleProcessResponse {
    const result = this.processService.findOne(+id);
    if (!result.success) {
      throw new NotFoundException(result.message);
    }
    return { logs: result.data };
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    const result = this.processService.remove(+id);
    if (!result.success) {
      throw new NotFoundException(result.message);
    }
    return { message: result.message };
  }
}
