import {
  Count,
  CountSchema,

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
import {Favourite, Person} from '../models';
import {FavouriteRepository, PersonRepository} from '../repositories';

export class FavouriteController {
  constructor(
    @repository(FavouriteRepository)
    public favouriteRepository: FavouriteRepository,
    @repository(PersonRepository)
    public personRepository: PersonRepository,
  ) { }

  @post('/favourites')
  @response(200, {
    description: 'Favourite model instance',
    content: {'application/json': {schema: getModelSchemaRef(Favourite)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favourite, {
            title: 'NewFavourite',

          }),
        },
      },
    })
    favourite: Favourite,
  ): Promise<Favourite> {
    return this.favouriteRepository.create(favourite);
  }

  @get('/favourites/count')
  @response(200, {
    description: 'Favourite model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Favourite) where?: Where<Favourite>,
  ): Promise<Count> {
    return this.favouriteRepository.count(where);
  }

  @get('/favourites')
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
  async find(): Promise<Person[]> {
    const favourites = await this.favouriteRepository.find({});
    const persons: Person[] = [];
    for (let i = 0; i < favourites.length; i++) {
      let person = await this.personRepository.findById(favourites[i].person_id, {include: ['phoneNumbers']});
      persons.push(person);
    }
    return persons;
  }

  @patch('/favourites')
  @response(200, {
    description: 'Favourite PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favourite, {partial: true}),
        },
      },
    })
    favourite: Favourite,
    @param.where(Favourite) where?: Where<Favourite>,
  ): Promise<Count> {
    return this.favouriteRepository.updateAll(favourite, where);
  }

  @get('/favourites/{id}')
  @response(200, {
    description: 'Favourite model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Favourite, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Favourite, {exclude: 'where'}) filter?: FilterExcludingWhere<Favourite>
  ): Promise<Favourite> {
    return this.favouriteRepository.findById(id, filter);
  }

  @patch('/favourites/{id}')
  @response(204, {
    description: 'Favourite PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favourite, {partial: true}),
        },
      },
    })
    favourite: Favourite,
  ): Promise<void> {
    await this.favouriteRepository.updateById(id, favourite);
  }

  @put('/favourites/{id}')
  @response(204, {
    description: 'Favourite PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() favourite: Favourite,
  ): Promise<void> {
    await this.favouriteRepository.replaceById(id, favourite);
  }

  @del('/favourites/{person_id}')
  @response(204, {
    description: 'Favourite DELETE success',
  })
  async deleteById(@param.path.number('person_id') person_id: number): Promise<void> {
    let favs = await this.favouriteRepository.find({where: {person_id}});
    for (let i = 0; i < favs.length; i++) {
      await this.favouriteRepository.deleteById(favs[i].id);
    }
  }
}
