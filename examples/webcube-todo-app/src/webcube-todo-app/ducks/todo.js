import uuid from 'uuid/v4';
import update from 'immutability-helper';

import cube from '../cube';

function createItem({ content = '', isCompleted = false }) {
  return {
    id: uuid(),
    content,
    isCompleted,
  };
}

function findItem(items, id) {
  return items.findIndex(item => item.id === id);
}

cube.add({
  todo: {
    load: () =>
      import('../data/items.json').then(({ default: { items } }) => items),
  },
});

cube.handle(
  'todo',
  {
    todo: {
      loadFulfilled: (state, { payload }) =>
        update(state, {
          items: { $set: payload },
          isLoading: { $set: false },
        }),
      add: (state, { payload: content }) =>
        update(state, {
          items: { $unshift: [createItem({ content })] },
          input: { $set: '' },
        }),
      update: (state, { payload: { id, content } }) => {
        const pos = findItem(state.items, id);
        return update(state, {
          items: { [pos]: { content: { $set: content } } },
        });
      },
      delete: (state, { payload: { id } }) => {
        const pos = findItem(state.items, id);
        return update(state, {
          items: { $splice: [[pos, 1]] },
        });
      },
      toggle: (state, { payload: { id } }) => {
        const pos = findItem(state.items, id);
        return update(state, {
          items: { [pos]: { $toggle: ['isCompleted'] } },
        });
      },
      toggleAll: state => {
        const isCompleted = Boolean(
          state.items.find(item => !item.isCompleted),
        );
        return update(state, {
          items: {
            $apply: items =>
              items.map(item =>
                update(item, {
                  isCompleted: { $set: isCompleted },
                }),
              ),
          },
        });
      },
      clearCompleted: state =>
        update(state, {
          items: {
            $apply: items =>
              items.map(item =>
                update(item, {
                  isCompleted: { $set: false },
                }),
              ),
          },
        }),
    },
    changeInput: (state, { payload: content }) =>
      update(state, {
        input: { $set: content },
      }),
  },
  {
    items: [],
    input: '',
    isLoading: true,
  },
);
