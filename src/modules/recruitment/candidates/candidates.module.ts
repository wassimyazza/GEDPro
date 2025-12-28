import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormsModule } from '../../recruitment/forms/forms.module';
import { NotificationsModule } from '../../notification/notifications/notifications.module';
import { RolesGuard } from '../../../shared/common/guards/roles.guard';
import { Candidate } from './candidate.entity';
import { CandidateStatusHistory } from './candidate-status-history.entity';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { PublicCandidatesController } from './public-candidates.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Candidate, CandidateStatusHistory]),
    FormsModule,
    NotificationsModule,
  ],
  controllers: [PublicCandidatesController, CandidatesController],
  providers: [CandidatesService, RolesGuard],
  exports: [CandidatesService],
})
export class CandidatesModule {}
