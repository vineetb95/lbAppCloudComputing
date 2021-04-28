import {Entity, hasMany, model, property} from '@loopback/repository';
import {Transaction} from './transaction.model';

@model({settings: {strict: false}})
export class MultiTransactionStatus extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  root_id?: number;

  @property({
    type: 'number',
    required: true,
  })
  remaining_amount: number;

  @hasMany(() => Transaction, {keyTo: 'root_id'})
  transactions: Transaction[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<MultiTransactionStatus>) {
    super(data);
  }
}

export interface MultiTransactionStatusRelations {
  // describe navigational properties here
}

export type MultiTransactionStatusWithRelations = MultiTransactionStatus & MultiTransactionStatusRelations;
