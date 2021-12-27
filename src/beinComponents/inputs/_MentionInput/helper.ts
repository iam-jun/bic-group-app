import {
  AT_MENTION_REGEX,
  AT_MENTION_SEARCH_REGEX,
} from '~/constants/autocomplete';

export const getMatchTermForAtMention = (() => {
  let lastMatchTerm: string | null = null;
  let lastValue: string;
  let lastIsSearch: boolean;
  return (value: string, isSearch: boolean) => {
    if (value !== lastValue || isSearch !== lastIsSearch) {
      const regex = isSearch ? AT_MENTION_SEARCH_REGEX : AT_MENTION_REGEX;
      let term = value;
      if (term.startsWith('from: @') || term.startsWith('from:@')) {
        term = term.replace('@', '');
      }

      const match = term.match(regex);
      lastValue = value;
      lastIsSearch = isSearch;
      if (match) {
        lastMatchTerm = (isSearch ? match[1] : match[2]).toLowerCase();
      } else {
        lastMatchTerm = null;
      }
    }
    return lastMatchTerm;
  };
})();
