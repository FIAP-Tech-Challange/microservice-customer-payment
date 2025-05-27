import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepositoryPort } from '../../ports/output/payment.repository';
import { PaymentModel } from '../../models/domain/payment.model';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from '../../models/entities/payment.entity';
import { Repository } from 'typeorm';
import { PaymentStatusEnum } from '../../models/enum/payment-status.enum';
import { PaymentMapper } from '../../models/mapper/payment.mapper';

@Injectable()
export class PaymentRepositoryAdapter implements PaymentRepositoryPort {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
  ) {}

  async savePayment(payment: PaymentModel): Promise<PaymentModel> {
    const paymentEntity = PaymentMapper.toEntity(payment);
    const result = await this.paymentRepository.save(paymentEntity);
    return PaymentMapper.toDomain(result);
  }

  async findById(id: string): Promise<PaymentModel> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException(`Payment id ${id} not found`);
    }

    return PaymentMapper.toDomain(payment);
  }

  async updateStatus(
    id: string,
    status: PaymentStatusEnum,
  ): Promise<PaymentModel | null> {
    const payment = await this.paymentRepository.findOne({ where: { id } });

    if (!payment) {
      return null;
    }
    payment.status = status;
    const paymentModel = await this.paymentRepository.save(payment);
    return PaymentMapper.toDomain(paymentModel);
  }
}
