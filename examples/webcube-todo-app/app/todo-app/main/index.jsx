import React, { Component } from 'react';
import localforage from 'localforage';
import withPersist from 'redux-cube-with-persist';
import { createApp } from 'redux-cube';

import { reducer as todoReducer } from './ducks/todo';
import Main from './containers/Main';

@createApp(
  withPersist({
    reducers: {
      todo: todoReducer,
    },
    persistStorage: localforage,
    persistKey: 'todoAppRoot',
    devToolsOptions: { name: 'TodoApp' },
    preloadedState: typeof window !== 'undefined' && window._preloadTodoData,
    enableDynamicConfig: true,
  }),
)
class TodoApp extends Component {
  render() {
    return <Main {...this.props} />;
  }
}

export const App = TodoApp;
