import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminAccessGuard, BatchAccessGuard } from '../auth/guard';
import { BatchDto, CreateBatchDto } from './dto';
import { BatchService } from './batch.service';
import { SerializeUser } from '../auth/decorator';
import { BatchEntity } from './entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @UseGuards(AdminAccessGuard)
  @Post()
  createBatch(@Body() dto: CreateBatchDto) {
    return this.batchService.createBatch(dto);
  }

  @UseGuards(BatchAccessGuard)
  @Get()
  getAdmin(@SerializeUser() batch: BatchDto): BatchEntity {
    return new BatchEntity(batch);
  }
}
