import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminAccessGuard } from '../auth/guard';
import { CreateBatchDto } from './dto';
import { BatchService } from './batch.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @UseGuards(AdminAccessGuard)
  @Post()
  createBatch(@Body() dto: CreateBatchDto) {
    return this.batchService.createBatch(dto);
  }
}
