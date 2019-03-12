const { Plugin } = require('powercord/entities');

module.exports = class Mock extends Plugin {
  pluginDidLoad () {
    powercord
      .pluginManager
      .get('pc-commands')
      .register(
        'mock',
        'Mock a user...',
        '{c} [ text to mock ]',
        (args) => ({
          send: true,
          result: args.join(' ').split('').map((c, i) => i % 2 ? c.toUpperCase() : c).join('')
        })
      );
  }

  pluginWillUnload () {
    powercord
      .pluginManager
      .get('pc-commands')
      .unregister('mock');
  }
};
