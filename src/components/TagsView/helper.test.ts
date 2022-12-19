import { Dimensions } from 'react-native';
import { spacing } from '~/theme';
import { calculateMaxWidthOfTag } from './helper';

describe('TagsView helper', () => {
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const VIEW_CONTAINER_WIDTH = SCREEN_WIDTH - spacing.padding.large * 2;

  it('should view container width is full', () => {
    const numberOfTags = 1;
    const fn = calculateMaxWidthOfTag(numberOfTags);
    expect(fn).toEqual(VIEW_CONTAINER_WIDTH);
  });

  it('should view container width divide by 2', () => {
    const numberOfTags = 3;
    const fn = calculateMaxWidthOfTag(numberOfTags);
    expect(fn).toEqual(VIEW_CONTAINER_WIDTH / 2);
  });

  it('should view container width divide by 3', () => {
    const numberOfTags = 5;
    const fn = calculateMaxWidthOfTag(numberOfTags);
    expect(fn).toEqual(VIEW_CONTAINER_WIDTH / 3);
  });
});
