import { Dimensions } from 'react-native';
import { spacing } from '~/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const VIEW_CONTAINER_WIDTH = SCREEN_WIDTH - spacing.padding.large * 2;

export const calculateMaxWidthOfTag = (numberOfTags: number) => {
  if (numberOfTags === 1 || numberOfTags === 2) {
    return VIEW_CONTAINER_WIDTH;
  }
  if (numberOfTags === 3 || numberOfTags === 4) {
    return VIEW_CONTAINER_WIDTH / 2;
  }
  return VIEW_CONTAINER_WIDTH / 3;
};
