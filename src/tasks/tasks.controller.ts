import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Request() req: { user: { userId: number; email: string } },
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return await this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  async findAll(
    @Request() req: { user: { userId: number } },
    @Query('status') status: TaskStatus,
    @Query('ownerId') ownerId?: number,
  ) {
    // Para rol de supervisor, permitiremos ownerId en el query.
    // Actualmente, un usuario normal solo ve sus propios tasks:
    const targetUserId = ownerId ? ownerId : req.user.userId;
    return await this.tasksService.findAll(status, targetUserId);
  }

  @Put(':id')
  async update(
    @Request() req: { user: { userId: number } },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.update(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  async remove(
    @Request() req: { user: { userId: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.tasksService.remove(id, req.user.userId);
  }
}
