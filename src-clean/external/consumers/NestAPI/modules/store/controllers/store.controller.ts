import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';
import { FakePaymentDataSource } from 'src-clean/external/dataSources/payment/fake/fakePaymentDataSource';
import { createPostgresGeneralDataSource } from 'src-clean/external/dataSources/general/postgres/createPostgresDataSource';
import { StoreCoreController } from 'src-clean/core/modules/store/controllers/store.controller';
import { CreateStoreInputDTO } from '../dtos/createStoreInput.dto';
import { UnexpectedError } from 'src-clean/common/exceptions/unexpectedError';
import { ApiKeyGuard } from '../../auth/guards/api-key.guard';

@Controller({
  path: 'store',
  version: '1',
})
export class StoreController {
  constructor() {}

  @UseGuards(ApiKeyGuard)
  @Post()
  async create(@Body() body: CreateStoreInputDTO): Promise<{ id: string }> {
    const dataSource = new DataSourceProxy(
      await createPostgresGeneralDataSource(),
      new FakePaymentDataSource(),
    );

    const { error: err, value: store } = await new StoreCoreController(
      dataSource,
    ).createStore({
      name: body.name,
      fantasyName: body.fantasyName,
      email: body.email,
      cnpj: body.cnpj,
      plainPassword: body.plainPassword,
      phone: body.phone,
    });

    if (err) {
      if (err.code === UnexpectedError.CODE) {
        throw new Error('Ops! Something went wrong');
      }

      throw new BadRequestException(err.message);
    }

    return { id: store.id };
  }
}
