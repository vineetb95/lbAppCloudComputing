import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Favourite, FavouriteRelations} from '../models';

export class FavouriteRepository extends DefaultCrudRepository<
  Favourite,
  typeof Favourite.prototype.id,
  FavouriteRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Favourite, dataSource);
  }
}
