import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchService } from './elasticsearch.service';

@Module({
  imports: [ConfigModule],
  providers: [ElasticsearchService],
})
export class ElasticsearchModule {}
