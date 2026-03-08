import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // Crear Tarea
  async create(taskData: Partial<Task>): Promise<Task> {
    const newTask = this.tasksRepository.create(taskData);
    return await this.tasksRepository.save(newTask);
  }

  // Obtener todas las tareas con filtro opcional por estado
  async findAll(status?: TaskStatus): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task');
    if (status) {
      query.where('task.status = :status', { status });
    }
    return await query.getMany();
  }

  // Editar Tarea
  async update(id: number, updateData: Partial<Task>): Promise<Task> {
    const task = await this.tasksRepository.preload({
      id: id,
      ...updateData,
    });
    if (!task) throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    return await this.tasksRepository.save(task);
  }

  // Eliminar Tarea
  async remove(id: number): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
  }
}
