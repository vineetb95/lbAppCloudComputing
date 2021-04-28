import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {MultiTransactionStatus} from '../models';
import {MultiTransactionStatusRepository} from '../repositories';

export class MultiStepTransactionController {
  constructor(
    @repository(MultiTransactionStatusRepository)
    public multiTransactionStatusRepository : MultiTransactionStatusRepository,
  ) {}

  @post('/multi-transaction-statuses')
  @response(200, {
    description: 'MultiTransactionStatus model instance',
    content: {'application/json': {schema: getModelSchemaRef(MultiTransactionStatus)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MultiTransactionStatus, {
            title: 'NewMultiTransactionStatus',
            
          }),
        },
      },
    })
    multiTransactionStatus: MultiTransactionStatus,
  ): Promise<MultiTransactionStatus> {
    return this.multiTransactionStatusRepository.create(multiTransactionStatus);
  }

  @get('/multi-transaction-statuses/count')
  @response(200, {
    description: 'MultiTransactionStatus model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MultiTransactionStatus) where?: Where<MultiTransactionStatus>,
  ): Promise<Count> {
    return this.multiTransactionStatusRepository.count(where);
  }

  @get('/multi-transaction-statuses')
  @response(200, {
    description: 'Array of MultiTransactionStatus model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MultiTransactionStatus, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MultiTransactionStatus) filter?: Filter<MultiTransactionStatus>,
  ): Promise<MultiTransactionStatus[]> {
    return this.multiTransactionStatusRepository.find(filter);
  }

  @patch('/multi-transaction-statuses')
  @response(200, {
    description: 'MultiTransactionStatus PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MultiTransactionStatus, {partial: true}),
        },
      },
    })
    multiTransactionStatus: MultiTransactionStatus,
    @param.where(MultiTransactionStatus) where?: Where<MultiTransactionStatus>,
  ): Promise<Count> {
    return this.multiTransactionStatusRepository.updateAll(multiTransactionStatus, where);
  }

  @get('/multi-transaction-statuses/{id}')
  @response(200, {
    description: 'MultiTransactionStatus model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MultiTransactionStatus, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MultiTransactionStatus, {exclude: 'where'}) filter?: FilterExcludingWhere<MultiTransactionStatus>
  ): Promise<MultiTransactionStatus> {
    return this.multiTransactionStatusRepository.findById(id, filter);
  }

  @patch('/multi-transaction-statuses/{id}')
  @response(204, {
    description: 'MultiTransactionStatus PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MultiTransactionStatus, {partial: true}),
        },
      },
    })
    multiTransactionStatus: MultiTransactionStatus,
  ): Promise<void> {
    await this.multiTransactionStatusRepository.updateById(id, multiTransactionStatus);
  }

  @put('/multi-transaction-statuses/{id}')
  @response(204, {
    description: 'MultiTransactionStatus PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() multiTransactionStatus: MultiTransactionStatus,
  ): Promise<void> {
    await this.multiTransactionStatusRepository.replaceById(id, multiTransactionStatus);
  }

  @del('/multi-transaction-statuses/{id}')
  @response(204, {
    description: 'MultiTransactionStatus DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.multiTransactionStatusRepository.deleteById(id);
  }
}
