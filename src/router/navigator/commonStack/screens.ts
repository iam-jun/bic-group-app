import Maintenance from '~/screens/Maintenance';
import NotFound from '~/screens/NotFound';
import UnsupportFeature from '~/screens/UnsupportFeature';

/**
 * common screens include all screens can use in both main stack, auth stack or others
 * such as screen not found
 */

const commonScreens = {
  'not-found': NotFound,
  'unsupport-feature': UnsupportFeature,
  maintenance: Maintenance,
};

export default commonScreens;
