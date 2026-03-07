import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    create(@Body() createTaskDto: Partial<Task>) {
        return this.tasksService.create(createTaskDto);
    }

    @Get()
    findAll(@Query('status') status: TaskStatus) {
        return this.tasksService.findAll(status);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: Partial<Task>) {
        return this.tasksService.update(id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.remove(id);
    }
}