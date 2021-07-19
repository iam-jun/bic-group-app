import {withNavigation} from '~/router/helper';
import {
  rootNavigationRef,
  centerNavigationRef,
  leftNavigationRef,
  rightNavigationRef,
} from '../router/navigator/refs';

export const useNavigation = () => {
  return {
    rootNavigation: withNavigation(rootNavigationRef),
    navigation: withNavigation(centerNavigationRef),
    leftNavigation: withNavigation(leftNavigationRef),
    rightNavigation: withNavigation(rightNavigationRef),
  };
};
