import {Entity, hasMany, model, property} from '@loopback/repository';
import {PhoneNumber} from './phone-number.model';

@model({settings: {strict: false}})
export class Person extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  person_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'date',
    required: true,
  })
  date_created: string;

  @property({
    type: 'string',
    required: true,
  })
  email_id: string;

  @property({
    type: 'number',
    required: true,
  })
  balance: number;

  @hasMany(() => PhoneNumber, {keyTo: 'person_id'})
  phoneNumbers?: PhoneNumber[];

  phone_numbers?: number[];

  constructor(data?: Partial<Person>) {
    super(data);
  }
}

export interface PersonRelations {
  // describe navigational properties here
}

export type PersonWithRelations = Person & PersonRelations;
