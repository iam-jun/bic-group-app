import {withNavigation} from '~/router/helper';
import {
  leftNavigationRef,
  rightNavigationRef,
  rootNavigationRef,
} from '~/router/navigator/refs';

export const useRootNavigation = () => {
  const rootNavigation = withNavigation(rootNavigationRef);
  const leftNavigation = withNavigation(leftNavigationRef);
  const rightNavigation = withNavigation(rightNavigationRef);

  return {
    rootNavigation,
    leftNavigation,
    rightNavigation,
  };
};
