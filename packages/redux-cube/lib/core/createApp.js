import React, { PureComponent } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Provider } from 'react-redux';

import { getDisplayName } from '../utils';
import appState from './appState';

/**
 * @param {object} config see appState's param
 * @returns {function}
 */
export default function createApp(config) {
  const { enableDynamicConfig = false } = config;
  const { create: createAppStateWithConfig } = !enableDynamicConfig
    ? appState(config)
    : {};
  // autogenerated
  const {
    // withRouter
    _enableRouter = false,
    _routerHistory,
    _Router,
    _ConnectedRouter: ConnectedRouter,
    // withRouter3
    _enableRouter3 = false,
    _syncRouterHistoryWithStore,
    // withPersist
    _enablePersist = false,
    _PersistGate: PersistGate,
    // withImmutable
  } = config;
  return SubAppComponent => {
    class WithAppState extends PureComponent {
      // https://redux.js.org/docs/recipes/IsolatingSubapps.html
      // https://gist.github.com/gaearon/eeee2f619620ab7b55673a4ee2bf8400
      constructor(props) {
        super(props);
        let createAppState = createAppStateWithConfig;
        if (!createAppState) {
          const { appConfig = {} } = props;
          const dynamicConfig = Object.assign({}, config, appConfig);
          ({ create: createAppState } = appState(dynamicConfig));
        }
        const { store, persistor } = createAppState();
        Object.assign(this, {
          store,
          persistor,
        });
      }

      render() {
        const { store, persistor } = this;
        const { ...passThroughProps } = this.props;
        const withProps = React.createElement(SubAppComponent, {
          ...(_enableRouter
            ? {
                Router: _Router,
              }
            : {}),
          // https://github.com/reactjs/react-router-redux#history--synchistorywithstorehistory-store-options
          ...(_enableRouter3
            ? {
                routerHistoryWithStore: _syncRouterHistoryWithStore(
                  _routerHistory,
                  store,
                ),
              }
            : {}),
          ...passThroughProps,
        });
        const withStore = React.createElement(
          // https://redux.js.org/docs/basics/UsageWithReact.html#passing-the-store
          Provider,
          { store },
          // https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux#usage
          _enableRouter
            ? React.createElement(
                ConnectedRouter,
                {
                  history: _routerHistory,
                },
                withProps,
              )
            : withProps,
        );
        if (_enablePersist) {
          // https://github.com/rt2zz/redux-persist#usage
          return React.createElement(PersistGate, { persistor }, withStore);
        } else {
          return withStore;
        }
      }
    }
    hoistNonReactStatic(WithAppState, SubAppComponent);
    WithAppState.displayName = `WithAppState(${getDisplayName(
      SubAppComponent,
    )})`;
    return WithAppState;
  };
}
