import { IAudienceGroup } from '~/interfaces/IPost';
import { PinAudiences } from '.';

export const isChangedPinAudiences = (pinAudiences: PinAudiences, prevAudiences: IAudienceGroup[]) => {
  const isChanged = Object.keys(pinAudiences).some((key) => {
    const currentPinStateGroup = pinAudiences[key].group;
    const prevPinStateGroup = prevAudiences.find((group) => group.id === currentPinStateGroup.id);

    return !!currentPinStateGroup.isPinned !== !!prevPinStateGroup.isPinned;
  });
  return isChanged;
};

export const getGroupIdsBySelectedOrUnselected = (pinAudiences: PinAudiences, isSelected: boolean) => {
  const lstGroupIdsSelected = Object.entries(pinAudiences)
    .filter(([_, audience]) => (isSelected ? audience.group.isPinned : !audience.group.isPinned))
    .map(([_, audience]) => audience.group.id);
  return lstGroupIdsSelected;
};
