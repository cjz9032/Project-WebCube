// https://github.com/amwmedia/plop

module.exports = function (plop) {

  const addEntryActions = [{
    type: 'add',
    path: '../src/entries/{{entryName}}/index.js',
    templateFile: '../templates/src/entries/index.js',
  }, {
    type: 'add',
    path: '../src/entries/{{entryName}}/routes/index.jsx',
    templateFile: '../templates/src/entries/routes/index.jsx',
  }, {
    type: 'add',
    path: '../src/entries/{{entryName}}/reducers/index.js',
    templateFile: '../templates/src/entries/reducers/index.js',
  }, {
    type: 'add',
    path: '../src/entries/{{entryName}}/actions/index.js',
    templateFile: '../templates/src/entries/actions/index.js',
  }, {
    type: 'add',
    path: '../src/entries/{{entryName}}/containers/App.jsx',
    templateFile: '../templates/src/entries/containers/App.jsx',
  }, {
    type: 'add',
    path: '../src/entries/{{entryName}}/containers/App.scss',
    templateFile: '../templates/src/entries/containers/App.scss',
  }, {
    type: 'add',
    path: '../src/entries/{{entryName}}/containers/Home.jsx',
    templateFile: '../templates/src/entries/containers/Home.jsx',
  }, {
    type: 'add',
    path: '../src/entries/{{entryName}}/containers/Home.scss',
    templateFile: '../templates/src/entries/containers/Home.scss',
  }, {
    type: 'add',
    path: '../src/entries/{{entryName}}/styles/_variables.scss',
    templateFile: '../templates/src/entries/styles/_variables.scss',
  }, {
    type: 'add',
    path: '../staticweb/{{entryName}}/index.html',
    templateFile: '../templates/staticweb/index.html',
  }, {
    type: 'add',
    path: '../staticweb/{{entryName}}/deploy.js',
    templateFile: '../templates/staticweb/deploy.js',
  }, {
    type: 'add',
    path: '../staticweb/{{entryName}}/deploy.scss',
    templateFile: '../templates/staticweb/deploy.scss',
  }, {
    type: 'add',
    path: '../test/functionals/{{entryName}}/index.spec.js',
    templateFile: '../templates/test/functionals/spec.js',
  }];

  plop.setGenerator('entry', {
    description: 'Add a new entry point',
    prompts: [{
      type: 'input',
      name: 'entryName',
      message: 'What is the name of new entry point? (hyphen-separated lowercase, i.e. "about-page")',
      validate,
    }],
    actions: addEntryActions.concat([{
      type: 'modify',
      path: 'webpack.default.config.babel.js',
      pattern: /^(\s*)(\/\* DO NOT MODIFY THIS! NEW ENTRY WILL BE AUTOMATICALLY APPENDED TO HERE \*\/)/m,
      template: '$1\'{{entryName}}\': [\'./staticweb/{{entryName}}/deploy.js\'],\n$1$2',
    }]),
  });

  plop.setGenerator('demo', {
    description: 'Add a new entry point for demo (run `npm run new initDemo` first)',
    prompts: [{
      type: 'input',
      name: 'entryName',
      message: 'What is the name of new entry point? (hyphen-separated lowercase, begin with "demo-", i.e. "demo-app")',
      validate(value) {
        const res = validate(value);
        if (res !== true) {
          return res;
        }
        if (/^demo\-/.test(value)) {
          return true;
        }
        return 'Wrong, a demo entry\'s name must begin with "demo-", i.e. "demo-app"';
      },
    }],
    actions: addEntryActions.concat([{
      type: 'modify',
      path: 'webpack.demo.config.babel.js',
      pattern: /^(\s*)(\/\* DO NOT MODIFY THIS! NEW DEMO WILL BE AUTOMATICALLY APPENDED TO HERE \*\/)/m,
      template: '$1\'{{entryName}}\': defaultCode.concat([\'./staticweb/{{entryName}}/deploy.js\']),\n$1$2',
    }]),
  });

  plop.setGenerator('initDemo', {
    description: 'Initialize config files for demo entries',
    actions: [{
      type: 'add',
      path: 'webpack.demo.config.babel.js',
      templateFile: '../templates/configs/webpack.demo.config.babel.js',
    }],
  });

};

function validate(value) {
  if (/^[a-z][a-z0-9\-]+$/.test(value)) {
    return true;
  }
  return 'wrong format';
}