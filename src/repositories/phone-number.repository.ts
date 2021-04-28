import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {PhoneNumber, PhoneNumberRelations} from '../models';

export class PhoneNumberRepository extends DefaultCrudRepository<
  PhoneNumber,
  typeof PhoneNumber.prototype.id,
  PhoneNumberRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(PhoneNumber, dataSource);
  }
}
