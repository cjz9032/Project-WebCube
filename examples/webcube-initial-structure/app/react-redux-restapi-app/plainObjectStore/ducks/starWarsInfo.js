import update from 'immutability-helper';
import gql from 'graphql-tag';

import hub from '../hub';
import { source } from '../apis';

export const starWarsSource = source(
  gql`
    query showCharacter($characterId: String!) {
      character(id: $characterId) {
        url
        name
        height
        starships {
          url
          name
          model
          films {
            url
            title
            director
            created
          }
        }
      }
    }

    query showShip($shipId: String!) {
      starship(id: $shipId) {
        url
        name
        model
      }
    }
  `,
  {
    stateName: 'source',
    namespace: 'STAR_WARS_SOURCE',
    idAttribute: 'url',
  },
);

export const { reducer, actions, types, typeDict } = hub
  .handle(
    {
      ...starWarsSource.reducerMap,
      character: {
        inputId: (state, { payload }) =>
          update(state, {
            characterId: { $set: payload },
          }),
        changeField: (state, { payload: { name, value } }) =>
          update(state, {
            source: {
              data: {
                character: {
                  $apply: ({ entities, result }) => ({
                    entities: update(entities, {
                      character: {
                        [result]: {
                          [name]: { $set: value },
                        },
                      },
                    }),
                    result,
                  }),
                },
              },
            },
          }),
      },
      starship: {
        inputId: (state, { payload }) =>
          update(state, {
            shipId: { $set: payload },
          }),
        changeField: (state, { payload: { name, value } }) =>
          update(state, {
            source: {
              data: {
                starship: {
                  $apply: ({ entities, result }) => ({
                    entities: update(entities, {
                      starship: {
                        [result]: {
                          [name]: { $set: value },
                        },
                      },
                    }),
                    result,
                  }),
                },
              },
            },
          }),
      },
    },
    {
      characterId: '',
      shipId: '',
      ...starWarsSource.initialState,
    },
  )
  .with(starWarsSource.actions);
