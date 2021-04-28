import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  MultiTransactionStatus,
  Transaction,
} from '../models';
import {MultiTransactionStatusRepository} from '../repositories';

export class MultiTransactionStatusTransactionController {
  constructor(
    @repository(MultiTransactionStatusRepository) protected multiTransactionStatusRepository: MultiTransactionStatusRepository,
  ) { }

  @get('/multi-transaction-statuses/{id}/transactions', {
    responses: {
      '200': {
        description: 'Array of MultiTransactionStatus has many Transaction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Transaction)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Transaction>,
  ): Promise<Transaction[]> {
    return this.multiTransactionStatusRepository.transactions(id).find(filter);
  }

  @post('/multi-transaction-statuses/{id}/transactions', {
    responses: {
      '200': {
        description: 'MultiTransactionStatus model instance',
        content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof MultiTransactionStatus.prototype.root_id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            title: 'NewTransactionInMultiTransactionStatus',
            exclude: ['transaction_id'],
            optional: ['root_id']
          }),
        },
      },
    }) transaction: Omit<Transaction, 'transaction_id'>,
  ): Promise<Transaction> {
    return this.multiTransactionStatusRepository.transactions(id).create(transaction);
  }

  @patch('/multi-transaction-statuses/{id}/transactions', {
    responses: {
      '200': {
        description: 'MultiTransactionStatus.Transaction PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {partial: true}),
        },
      },
    })
    transaction: Partial<Transaction>,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.multiTransactionStatusRepository.transactions(id).patch(transaction, where);
  }

  @del('/multi-transaction-statuses/{id}/transactions', {
    responses: {
      '200': {
        description: 'MultiTransactionStatus.Transaction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.multiTransactionStatusRepository.transactions(id).delete(where);
  }
}
