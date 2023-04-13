import { pinnableAudiencesResponse } from '~/test/mock_data/pinContent';
import { PinAudiences } from './index';
import { isChangedPinAudiences, getGroupIdsBySelectedOrUnselected } from './helper';

describe('usePinContentStore helper', () => {
  describe('isChangedPinAudiences function', () => {
    it('given current pinAudiences & prevAudiences should return false if not changed', () => {
      const pinAudiences = pinnableAudiencesResponse.data.groups.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.id]: {
            group: cur,
            error: '',
          },
        }),
      {} as PinAudiences,
      );

      const isChanged = isChangedPinAudiences(pinAudiences, pinnableAudiencesResponse.data.groups);

      expect(isChanged).toBeFalsy();
    });

    it('given current pinAudiences & prevAudiences should return true if has changed', () => {
      const pinAudiences = pinnableAudiencesResponse.data.groups.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.id]: {
            group: { ...cur },
            error: '',
          },
        }),
      {} as PinAudiences,
      );
      pinAudiences[pinnableAudiencesResponse.data.groups[0].id].group.isPinned = true;

      const isChanged = isChangedPinAudiences(pinAudiences, pinnableAudiencesResponse.data.groups);

      expect(isChanged).toBeTruthy();
    });
  });

  describe('getGroupIdsBySelectedOrUnselected function', () => {
    it('given current pinAudiences & isSelected = true should return the list of groupIds that is selected', () => {
      const pinAudiences = pinnableAudiencesResponse.data.groups.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.id]: {
            group: { ...cur },
            error: '',
          },
        }),
      {} as PinAudiences,
      );
      pinAudiences[pinnableAudiencesResponse.data.groups[0].id].group.isPinned = true;
      pinAudiences[pinnableAudiencesResponse.data.groups[1].id].group.isPinned = true;

      const lstSelectedGroupIds = getGroupIdsBySelectedOrUnselected(pinAudiences, true);

      expect(lstSelectedGroupIds.length).toBe(2);
    });

    it('given current pinAudiences & isSelected = false should return the list of groupIds that is not selected', () => {
      const pinAudiences = pinnableAudiencesResponse.data.groups.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.id]: {
            group: { ...cur },
            error: '',
          },
        }),
      {} as PinAudiences,
      );

      const lstSelectedGroupIds = getGroupIdsBySelectedOrUnselected(pinAudiences, false);

      expect(lstSelectedGroupIds.length).toBe(3);
    });
  });
});
