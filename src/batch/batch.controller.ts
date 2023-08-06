import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AdminAccessGuard,
  BatchAccessGuard,
  CommonAccessGuard,
} from '../auth/guard';
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
  getBatch(@SerializeUser() batch: BatchDto): BatchEntity {
    return new BatchEntity(batch);
  }

  @UseGuards(CommonAccessGuard)
  @Get(':id')
  getBatchById(@Param('id') batchId: string): Promise<BatchEntity> {
    return this.batchService.getBatchById(batchId);
  }
}
