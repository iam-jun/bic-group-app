import { getLanguages } from './helper';
import useUserProfileStore, { IUserProfileState } from './store';
import { responseGetLanguages } from './store/__mocks__/data';

describe('UserProfile helper', () => {
  it('getLanguages: validate valued array', () => {
    useUserProfileStore.setState((state: IUserProfileState) => {
      state.languages = responseGetLanguages.data;
      return state;
    });
    const result = getLanguages(['en', 'vi']);
    expect(result).toEqual('English, Tiếng Việt');
  });
});
