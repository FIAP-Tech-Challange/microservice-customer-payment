import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CPF } from '../valueObjects/cpf.vo';

@Injectable()
export class CpfPipe implements PipeTransform {
  transform(value: string): string | undefined {
    try {
      const cpf = CPF.create(value);
      if (!cpf) {
        throw new BadRequestException('CPF invalid');
      }
      return cpf.value?.toString();
    } catch {
      throw new BadRequestException('CPF invalid');
    }
  }
}
