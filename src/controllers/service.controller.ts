import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody,
  response
} from '@loopback/rest';
import {Service} from '../models';
import {PersonRepository, ServiceRepository} from '../repositories';

export class ServiceController {
  constructor(
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
    @repository(PersonRepository)
    public personRepository: PersonRepository,
  ) { }

  @post('/services')
  @response(200, {
    description: 'Service model instance',
    content: {'application/json': {schema: getModelSchemaRef(Service)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Service, {
            title: 'NewService',

          }),
        },
      },
    })
    service: Service,
  ): Promise<Service> {
    return this.serviceRepository.create(service);
  }

  @get('/services/count')
  @response(200, {
    description: 'Service model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Service) where?: Where<Service>,
  ): Promise<Count> {
    return this.serviceRepository.count(where);
  }

  @get('/services')
  async find(
    @param.filter(Service) filter?: Filter<Service>,
  ): Promise<Service[]> {
    let services = await this.serviceRepository.find(filter);
    for (let i = 0; i < services.length; i++) {
      let {name} = await this.personRepository.findById(services[i].person_id);
      services[i].person_name = name;
    }
    return services;
  }

  @patch('/services')
  @response(200, {
    description: 'Service PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Service, {partial: true}),
        },
      },
    })
    service: Service,
    @param.where(Service) where?: Where<Service>,
  ): Promise<Count> {
    return this.serviceRepository.updateAll(service, where);
  }

  @get('/services/{id}')
  @response(200, {
    description: 'Service model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Service, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Service, {exclude: 'where'}) filter?: FilterExcludingWhere<Service>
  ): Promise<Service> {
    return this.serviceRepository.findById(id, filter);
  }

  @patch('/services/{id}')
  @response(204, {
    description: 'Service PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Service, {partial: true}),
        },
      },
    })
    service: Service,
  ): Promise<void> {
    await this.serviceRepository.updateById(id, service);
  }

  @put('/services/{id}')
  @response(204, {
    description: 'Service PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() service: Service,
  ): Promise<void> {
    await this.serviceRepository.replaceById(id, service);
  }

  @del('/services/{id}')
  @response(204, {
    description: 'Service DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.serviceRepository.deleteById(id);
  }
}
