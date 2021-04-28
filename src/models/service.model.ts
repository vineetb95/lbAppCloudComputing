import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Service extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  service_id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  person_id: number;

  person_name?: string;

  constructor(data?: Partial<Service>) {
    super(data);
  }
}

export interface ServiceRelations {
  // describe navigational properties here
}

export type ServiceWithRelations = Service & ServiceRelations;
