import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody,
  response
} from '@loopback/rest';
import {Transaction} from '../models';
import {ItemRepository, MultiTransactionStatusRepository, PersonRepository, ServiceRepository, TransactionRepository} from '../repositories';

export class TransactionController {
  constructor(
    @repository(MultiTransactionStatusRepository)
    public multiTransactionStatusRepository: MultiTransactionStatusRepository,
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
    @repository(PersonRepository)
    public personRepository: PersonRepository,
    @repository(ItemRepository)
    public itemRepository: ItemRepository,
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
  ) { }

  @post('/transactions')
  @response(200, {
    description: 'Transaction model instance',
    content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            title: 'NewTransaction',

          }),
        },
      },
    })
    transaction: Transaction,
  ): Promise<Transaction> {
    return this.transactionRepository.create(transaction);
  }

  @get('/transactions/count')
  @response(200, {
    description: 'Transaction model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Transaction) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.transactionRepository.count(where);
  }

  @get('/transactions')
  @response(200, {
    description: 'Array of Transaction model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Transaction, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Transaction) filter?: Filter<Transaction>,
  ): Promise<Transaction[]> {
    let transactions = await this.multiTransactionStatusRepository.find();
    let finalTransactions: Transaction[] = [];
    for (let i = 0; i < transactions.length; i++) {
      console.log(filter);
      const sampleTrans = await this.multiTransactionStatusRepository.transactions(transactions[i].root_id).find(filter);
      console.log(sampleTrans);
      if (sampleTrans.length == 0)
        continue;

      let trans = sampleTrans[0];
      console.log(trans);
      const {name: person_name} = await this.personRepository.findById(trans.person_id);
      trans.person_name = person_name;
      if (trans.item_id) {
        const {name: item_name} = await this.itemRepository.findById(trans.item_id);
        trans.item_name = item_name;
      }
      if (trans.service_id) {
        const {name: service_name} = await this.serviceRepository.findById(trans.service_id);
        trans.service_name = service_name;
      }
      let amount: number = 0;
      for (let i = 0; i < sampleTrans.length; i++) {
        amount += sampleTrans[i].amount;
      }
      trans.amount = amount;
      trans.status = transactions[i].remaining_amount == 0 ? "Completed" : "Incomplete";
      finalTransactions.push(trans);
    }
    return finalTransactions;
  }

  @patch('/transactions')
  @response(200, {
    description: 'Transaction PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {partial: true}),
        },
      },
    })
    transaction: Transaction,
    @param.where(Transaction) where?: Where<Transaction>,
  ): Promise<Count> {
    return this.transactionRepository.updateAll(transaction, where);
  }

  @get('/transactions/{id}')
  @response(200, {
    description: 'Transaction model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Transaction, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Transaction, {exclude: 'where'}) filter?: FilterExcludingWhere<Transaction>
  ): Promise<Transaction> {
    return this.transactionRepository.findById(id, filter);
  }

  @patch('/transactions/{id}')
  @response(204, {
    description: 'Transaction PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {partial: true}),
        },
      },
    })
    transaction: Transaction,
  ): Promise<void> {
    await this.transactionRepository.updateById(id, transaction);
  }

  @put('/transactions/{id}')
  @response(204, {
    description: 'Transaction PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() transaction: Transaction,
  ): Promise<void> {
    await this.transactionRepository.replaceById(id, transaction);
  }

  @del('/transactions/{id}')
  @response(204, {
    description: 'Transaction DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.transactionRepository.deleteById(id);
  }
}
