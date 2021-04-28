import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {MultiTransactionStatus, MultiTransactionStatusRelations, Transaction} from '../models';
import {TransactionRepository} from './transaction.repository';

export class MultiTransactionStatusRepository extends DefaultCrudRepository<
  MultiTransactionStatus,
  typeof MultiTransactionStatus.prototype.root_id,
  MultiTransactionStatusRelations
> {

  public readonly transactions: HasManyRepositoryFactory<Transaction, typeof MultiTransactionStatus.prototype.root_id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TransactionRepository') protected transactionRepositoryGetter: Getter<TransactionRepository>,
  ) {
    super(MultiTransactionStatus, dataSource);
    this.transactions = this.createHasManyRepositoryFactoryFor('transactions', transactionRepositoryGetter,);
    this.registerInclusionResolver('transactions', this.transactions.inclusionResolver);
  }
}
