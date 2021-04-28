import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Person,
  PhoneNumber,
} from '../models';
import {PersonRepository} from '../repositories';

export class PersonPhoneNumberController {
  constructor(
    @repository(PersonRepository) protected personRepository: PersonRepository,
  ) { }

  @get('/people/{id}/phone-numbers', {
    responses: {
      '200': {
        description: 'Array of Person has many PhoneNumber',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PhoneNumber)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<PhoneNumber>,
  ): Promise<PhoneNumber[]> {
    return this.personRepository.phoneNumbers(id).find(filter);
  }

  @post('/people/{id}/phone-numbers', {
    responses: {
      '200': {
        description: 'Person model instance',
        content: {'application/json': {schema: getModelSchemaRef(PhoneNumber)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Person.prototype.person_id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PhoneNumber, {
            title: 'NewPhoneNumberInPerson',
            exclude: ['id'],
            optional: ['person_id']
          }),
        },
      },
    }) phoneNumber: Omit<PhoneNumber, 'id'>,
  ): Promise<PhoneNumber> {
    return this.personRepository.phoneNumbers(id).create(phoneNumber);
  }

  @patch('/people/{id}/phone-numbers', {
    responses: {
      '200': {
        description: 'Person.PhoneNumber PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PhoneNumber, {partial: true}),
        },
      },
    })
    phoneNumber: Partial<PhoneNumber>,
    @param.query.object('where', getWhereSchemaFor(PhoneNumber)) where?: Where<PhoneNumber>,
  ): Promise<Count> {
    return this.personRepository.phoneNumbers(id).patch(phoneNumber, where);
  }

  @del('/people/{id}/phone-numbers', {
    responses: {
      '200': {
        description: 'Person.PhoneNumber DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(PhoneNumber)) where?: Where<PhoneNumber>,
  ): Promise<Count> {
    return this.personRepository.phoneNumbers(id).delete(where);
  }
}
