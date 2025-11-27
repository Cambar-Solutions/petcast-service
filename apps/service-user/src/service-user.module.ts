import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiceUserController } from './service-user.controller';
import { ServiceUserService } from './service-user.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [ServiceUserController],
  providers: [ServiceUserService],
})
export class ServiceUserModule {}
