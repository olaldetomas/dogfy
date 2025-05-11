import { LoggerService } from '@nestjs/common';

// This silent logger can be used by all tests to suppress Nest logs
export class SilentLogger implements LoggerService {
  log(): void {}
  error(): void {}
  warn(): void {}
  debug(): void {}
  verbose(): void {}
}
