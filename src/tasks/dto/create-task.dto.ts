import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus, {
    message: 'El estado debe ser uno de: pending, in_progress, completed',
  })
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority, {
    message: 'La prioridad debe ser una de: low, medium, high',
  })
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString(
    {},
    { message: 'La fecha límite debe tener un formato válido (YYYY-MM-DD)' },
  )
  @IsOptional()
  due_date?: Date;
}
