import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  // Aquí va la lógica de cron para suspender/reactivar usuarios y enviar notificaciones
}
