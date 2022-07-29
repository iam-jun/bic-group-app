/**
 * @param md - const MarkdownIt
 * @param name - use for define rule & style with syntax `regex_${name}`
 * @param regex - regular expressions for detect content
 * @param startChar - the first match character, e.g: @
 */
const regexPlugin = (
  md, name, regex, startChar,
) => {
  function parse(
    state, silent,
  ) {
    const start = state.pos;

    if (state.src[start] !== startChar) {
      return false;
    }
    if (silent) {
      return false;
    }

    const content = state.src.slice(
      start, state.src.length,
    );
    const match = regex.exec(content);
    if (match) {
      // move cursor
      state.pos += match[0].length;

      const token = state.push(
        `regex_${name}`, '', 0,
      );
      token.meta = { match };

      return true;
    }
    return false;
  }

  md.inline.ruler.after(
    'emphasis', `regex_${name}`, parse,
  );
};

export default regexPlugin;
