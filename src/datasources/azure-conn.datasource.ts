import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'azureConn',
  connector: 'mssql',
  // url: 'mssql://godOfThunder:thorOdinson@12@transactionsdb.database.windows.net/main',
  host: 'transactionsdb.database.windows.net',
  port: 1433,
  user: 'godOfThunder',
  password: 'thorOdinson@12',
  database: 'main',
  encrypt: true,
  options: {
    encrypt: true,
  }
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AzureConnDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'azureConn';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.azureConn', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
