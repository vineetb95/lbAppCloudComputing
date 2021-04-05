import {Entity, model, property} from '@loopback/repository';

@model()
export class Transaction extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  transaction_id?: number;

  @property({
    type: 'date',
    required: true,
  })
  date_time: string;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
    required: true,
  })
  root_id: number;

  @property({
    type: 'number',
    required: true,
  })
  person_id: number;

  @property({
    type: 'number',
    required: true,
  })
  item_id: number;

  @property({
    type: 'number',
    required: true,
  })
  service_id: number;


  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
