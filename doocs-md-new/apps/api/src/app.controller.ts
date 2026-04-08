import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { formatUserName } from '@doocs/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const user = { id: '1', name: 'API User', email: 'api@doocs.com' };
    return this.appService.getHello() + ' - ' + formatUserName(user);
  }
}
