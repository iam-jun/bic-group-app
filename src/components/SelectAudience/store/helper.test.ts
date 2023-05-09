import { isEqual } from 'lodash';
import { getAudienceIdsFromSelecting } from './helper';

describe('SelectAudience component - helper function', () => {
  describe('getAudienceIdsFromSelecting', () => {
    it('given selected groups should return object contains groupId array', () => {
      const selectedData = {
        groups: {
          123: {

          },
          456: {

          },
        },
      };
      const obj = getAudienceIdsFromSelecting(selectedData);
      const expectedObj = {
        groupIds: ['123', '456'],
        userIds: [],
      };
      expect(isEqual(obj, expectedObj)).toBeTruthy();
    });
  });
});
