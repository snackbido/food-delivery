import { Module } from '@nestjs/common';
import { AppController } from '@review/app.controller';
import { AppService } from '@review/app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigModule } from '@review/shared/db/database.module';
import { ReviewRepository } from '@review/repository/review.repository';
import { AiService } from './shared/AI/ai.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    DatabaseConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, ReviewRepository, AiService],
})
export class AppModule {}
