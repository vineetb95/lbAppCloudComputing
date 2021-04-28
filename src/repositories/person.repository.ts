import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Person, PersonRelations, PhoneNumber} from '../models';
import {PhoneNumberRepository} from './phone-number.repository';

export class PersonRepository extends DefaultCrudRepository<
  Person,
  typeof Person.prototype.person_id,
  PersonRelations
> {

  public readonly phoneNumbers: HasManyRepositoryFactory<PhoneNumber, typeof Person.prototype.person_id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('PhoneNumberRepository') protected phoneNumberRepositoryGetter: Getter<PhoneNumberRepository>,
  ) {
    super(Person, dataSource);
    this.phoneNumbers = this.createHasManyRepositoryFactoryFor('phoneNumbers', phoneNumberRepositoryGetter,);
    this.registerInclusionResolver('phoneNumbers', this.phoneNumbers.inclusionResolver);
  }
}
