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
import {Person} from '../models';
import {PersonRepository} from '../repositories';

export class PersonController {
  constructor(
    @repository(PersonRepository)
    public personRepository: PersonRepository,
  ) { }

  @post('/person')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            title: 'NewPerson',
            type: 'object',
            properties: {
              person_id: {type: 'number'},
              name: {type: 'string'},
              date_created: {type: 'string', format: 'date-time'},
              email_id: {type: 'string'},
              balance: {type: 'number'},
              phone_numbers: {type: 'array', items: {type: "number"}},
            },
          },
        },
      },
    })
    person: Person
  ): Promise<void> {
    const phoneNumbers = person.phone_numbers!;
    delete person.phone_numbers;
    delete person.phoneNumbers;
    let p = await this.personRepository.create(person);
    let nums;
    if (phoneNumbers == undefined)
      return
    nums = phoneNumbers.length;
    for (let i = 0; i < nums; i++) {
      await this.personRepository.phoneNumbers(p.person_id).create({phoneNumber: phoneNumbers[i]});
    }
  }

  @get('/person/count')
  @response(200, {
    description: 'Person model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Person) where?: Where<Person>,
  ): Promise<Count> {
    return this.personRepository.count(where);
  }

  @get('/person')
  @response(200, {
    description: 'Array of Person model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Person, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Person) filter?: Filter<Person>,
  ): Promise<Person[]> {
    return this.personRepository.find(filter);
  }

  @patch('/person')
  @response(200, {
    description: 'Person PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Person, {partial: true}),
        },
      },
    })
    person: Person,
    @param.where(Person) where?: Where<Person>,
  ): Promise<Count> {
    return this.personRepository.updateAll(person, where);
  }

  @get('/person/{id}')
  @response(200, {
    description: 'Person model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Person, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Person, {exclude: 'where'}) filter?: FilterExcludingWhere<Person>
  ): Promise<Person> {
    console.log(filter);
    return this.personRepository.findById(id, filter);
  }

  @patch('/person/{id}')
  @response(204, {
    description: 'Person PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Person, {partial: true}),
        },
      },
    })
    person: Person,
  ): Promise<void> {
    await this.personRepository.updateById(id, person);
  }

  @put('/person/{id}')
  @response(204, {
    description: 'Person PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() person: Person,
  ): Promise<void> {
    await this.personRepository.replaceById(id, person);
  }

  @del('/person/{id}')
  @response(204, {
    description: 'Person DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.personRepository.deleteById(id);
  }
}
