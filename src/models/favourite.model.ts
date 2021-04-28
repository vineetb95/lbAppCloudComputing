import {Entity, model, property} from '@loopback/repository';

@model()
export class Favourite extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
  })
  person_id?: number;

  constructor(data?: Partial<Favourite>) {
    super(data);
  }
}

export interface FavouriteRelations {
  // describe navigational properties here
}

export type FavouriteWithRelations = Favourite & FavouriteRelations;
