import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Task])], // Esto habilita el Repositorio de Task
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule { }