import {
  repository
} from '@loopback/repository';
import {
  getModelSchemaRef, post,
  requestBody,
  response
} from '@loopback/rest';
import {Transaction} from '../models';
import {ItemRepository, MultiTransactionStatusRepository, PersonRepository, ServiceRepository, TransactionRepository} from '../repositories';

export class PurchaseController {
  constructor(
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
    @repository(MultiTransactionStatusRepository)
    public multiTransactionStatusRepository: MultiTransactionStatusRepository,
    @repository(ItemRepository)
    public itemRepository: ItemRepository,
    @repository(PersonRepository)
    public personRepository: PersonRepository,
  ) { }

  @post('/purchase_services')
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
  async purchase_services(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            title: 'request',
            type: 'object',
            properties: {
              person_id: {type: 'number'},
              payment: {type: 'number'},
              goods: {
                type: 'array',
                items: {
                  type: 'object', properties: {
                    id: {type: 'number'},
                    quantity: {type: 'number'}
                  }
                }
              },
            },
          },
        },
      },
    })
    request: {
      person_id: number,
      payment: number,
      goods: {id: number, quantity: number}[]
    }
    ,
  ): Promise<Transaction[]> {
    console.log(request);
    const transactions: Transaction[] = [];
    let total_remaining_amount = 0;
    let {payment: remaining_money, goods, person_id} = request;
    for (let i = 0; i < request.goods.length; i++) {
      let {id, quantity} = goods[i];
      const service = await this.serviceRepository.findById(id);
      let money_due = service.price * quantity;
      if (money_due <= remaining_money) {
        remaining_money -= money_due;
        money_due = 0;
      } else {
        money_due -= remaining_money;
        remaining_money = 0;
      }
      total_remaining_amount += money_due;
      const {root_id} = await this.multiTransactionStatusRepository.create({remaining_amount: money_due});
      const transaction = await this.multiTransactionStatusRepository.transactions(root_id).create({
        amount: (service.price * quantity - money_due),
        person_id,
        service_id: id,
        quantity,
        date_time: Date(),
      });
      transactions.push(transaction);
    }
    let p = await this.personRepository.findById(person_id)
    await this.personRepository.updateById(person_id, {balance: p.balance + total_remaining_amount});
    return (transactions);
  }

  @post('/purchase_items')
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
  async purchase_items(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            title: 'request',
            type: 'object',
            properties: {
              person_id: {type: 'number'},
              payment: {type: 'number'},
              goods: {
                type: 'array',
                items: {
                  type: 'object', properties: {
                    id: {type: 'number'},
                    quantity: {type: 'number'}
                  }
                }
              },
            },
          },
        },
      },
    })
    request: {
      person_id: number,
      payment: number,
      goods: {id: number, quantity: number}[]
    }
    ,
  ): Promise<Transaction[]> {
    console.log(request);
    const transactions: Transaction[] = [];
    let total_remaining_amount = 0;
    let {payment: remaining_money, goods, person_id} = request;
    for (let i = 0; i < request.goods.length; i++) {
      let {id, quantity} = goods[i];
      const item = await this.itemRepository.findById(id);
      if (quantity > item.stock)
        throw new Error("Item " + item.name + " out of stock!");
      let money_due = item.price * quantity;
      if (money_due <= remaining_money) {
        remaining_money -= money_due;
        money_due = 0;
      } else {
        money_due -= remaining_money;
        remaining_money = 0;
      }
      total_remaining_amount += money_due;
      const {root_id} = await this.multiTransactionStatusRepository.create({remaining_amount: money_due});
      const transaction = await this.multiTransactionStatusRepository.transactions(root_id).create({
        amount: (item.price * quantity - money_due),
        person_id,
        item_id: id,
        quantity,
        date_time: Date(),
      });
      transactions.push(transaction);
      await this.itemRepository.updateById(item.item_id, {stock: item.stock - quantity});
    }
    let p = await this.personRepository.findById(person_id);
    await this.personRepository.updateById(person_id, {balance: p.balance + total_remaining_amount});
    return (transactions);
  }

  @post('/pay_multistep')
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
  async pay_multistep(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            title: 'request',
            type: 'object',
            properties: {
              root_id: {type: 'number'},
              new_payment: {type: 'number'},
            },
          },
        },
      },
    })
    request: {
      root_id: number,
      new_payment: number,
    }
    ,
  ): Promise<Transaction[]> {
    const parentTransaction = await this.multiTransactionStatusRepository.findById(request.root_id);
    const prevTrans = await this.multiTransactionStatusRepository.transactions(request.root_id).find();
    let newTrans = prevTrans[0];
    let {person_id, balance} = await this.personRepository.findById(newTrans.person_id);
    newTrans.date_time = Date();
    newTrans.amount = request.new_payment;
    delete newTrans.transaction_id;
    newTrans = await this.multiTransactionStatusRepository.transactions(request.root_id).create(newTrans);
    await this.multiTransactionStatusRepository.updateById(request.root_id, {remaining_amount: (parentTransaction.remaining_amount - request.new_payment)});
    await this.personRepository.updateById(person_id, {balance: balance - request.new_payment});
    return [newTrans];
  }


}
