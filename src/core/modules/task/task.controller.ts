import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Put,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export default class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post(':teamId/:memberId/:projectId')
async create(
  @Body() taskDto: TaskDto,
  @Param('teamId', ParseIntPipe) teamId: number,
  @Param('memberId', ParseIntPipe) memberId: number,
  @Param('projectId', ParseIntPipe) projectId: number,
  @Body('forUser') forUser: string,
): Promise<{ message: string; data?: Task } | { message: string }> {
  try {
    const createdTask = await this.taskService.create(
      taskDto,
      teamId,
      memberId,
      projectId,
    );
    return { message: 'Task created successfully', data: createdTask };
  } catch (error) {
    if (error instanceof NotFoundException) {
      return { message: error.message };
    }
  }
}

  @Get()
  async findAll(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return await this.taskService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskDto: TaskDto,
  ) {
    try {
      const updatedTask = await this.taskService.update(id, taskDto);
      return { message: 'Task updated successfully', data: updatedTask };
    } catch (error) {
      return { message: 'Failed to update task', error: error.message };
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.taskService.delete(id);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      return { message: 'Failed to delete task', error: error.message };
    }
  }

  @Get('user/:userId')
  async getTasksByUserId(@Param('userId') userId: number): Promise<Task[]> {
    return this.taskService.getTasksByUserId(userId);
  }

  @Get('byMember/:memberId')
  async getTasksByMemberId(@Param('memberId', ParseIntPipe) memberId: number): Promise<{ message: string; data?: Task[] } | { message: string }> {
    try {
      const tasks = await this.taskService.getTasksByMemberId(memberId);
      return { message: 'Tasks retrieved successfully', data: tasks };
    } catch (error) {
      // Handle errors appropriately (e.g., return error message)
      return { message: 'Error retrieving tasks' };
    }
  }
  
  @Get('byUser/:forUser')
    async getTasksByForUser(@Param('forUser') forUser: string): Promise<Task[]> {
      const tasks = await this.taskService.getTasksByForUser(forUser);
      return tasks;
  
    }

}
