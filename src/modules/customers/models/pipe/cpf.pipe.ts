import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CPF } from 'src/shared/domain/cpf.vo';

@Injectable()
export class CpfPipe implements PipeTransform {
  transform(value: string): string {
    try {
      return new CPF(value).toString();
    } catch {
      throw new BadRequestException('CPF invalid');
    }
  }
}
