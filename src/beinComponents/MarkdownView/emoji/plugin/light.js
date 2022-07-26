const emojies_defs = require('./lib/data/light.json');
const emojies_shortcuts = require('./lib/data/shortcuts');
const bare_emoji_plugin = require('./bare');

module.exports = function emoji_plugin(md, options) {
  const defaults = {
    defs: emojies_defs,
    shortcuts: emojies_shortcuts,
    enabled: [],
  };

  const opts = md.utils.assign({}, defaults, options || {});

  bare_emoji_plugin(md, opts);
};
