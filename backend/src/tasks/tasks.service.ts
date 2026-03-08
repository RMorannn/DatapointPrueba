import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // Crear Tarea
  async create(taskData: Partial<Task>, userId: number): Promise<Task> {
    const newTask = this.tasksRepository.create({
      ...taskData,
      owner: { id: userId } as User,
    });
    return await this.tasksRepository.save(newTask);
  }

  // Obtener todas las tareas con filtro opcional por estado y usuario
  async findAll(status?: TaskStatus, userId?: number): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task');
    if (userId) {
      // TypeORM generalmente crea la columna con el nombre propiedad + Id
      query.andWhere('task.ownerId = :userId', { userId });
    }
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    return await query.getMany();
  }

  // Editar Tarea
  async update(
    id: number,
    updateData: Partial<Task>,
    userId: number,
  ): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, owner: { id: userId } },
    });
    if (!task)
      throw new NotFoundException(
        `Tarea con ID ${id} no encontrada o no tienes permisos`,
      );

    Object.assign(task, updateData);
    return await this.tasksRepository.save(task);
  }

  // Eliminar Tarea
  async remove(id: number, userId: number): Promise<void> {
    const result = await this.tasksRepository.delete({
      id,
      owner: { id: userId } as User,
    });
    if (result.affected === 0)
      throw new NotFoundException(
        `Tarea con ID ${id} no encontrada o no tienes permisos`,
      );
  }
}
