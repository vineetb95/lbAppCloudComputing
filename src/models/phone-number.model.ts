import {Entity, model, property} from '@loopback/repository';

@model()
export class PhoneNumber extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  phoneNumber: number;

  @property({
    type: 'number',
  })
  person_id?: number;

  constructor(data?: Partial<PhoneNumber>) {
    super(data);
  }
}

export interface PhoneNumberRelations {
  // describe navigational properties here
}

export type PhoneNumberWithRelations = PhoneNumber & PhoneNumberRelations;
