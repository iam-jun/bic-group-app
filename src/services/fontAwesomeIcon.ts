import {library} from '@fortawesome/fontawesome-svg-core';
import {faGear as farGear} from '@fortawesome/pro-regular-svg-icons/faGear';
import {faGear as fasGear} from '@fortawesome/pro-solid-svg-icons/faGear';
import {faHeart as farHeart} from '@fortawesome/pro-regular-svg-icons/faHeart';
import {faHeart as fasHeart} from '@fortawesome/pro-solid-svg-icons/faHeart';
import {faUserGroup as farUserGroup} from '@fortawesome/pro-regular-svg-icons/faUserGroup';
import {faUserGroup as fasUserGroup} from '@fortawesome/pro-solid-svg-icons/faUserGroup';

export const initFontAwesomeIcon = () => {
  library.add(fasGear, farGear, fasHeart, farHeart, farUserGroup, fasUserGroup);
};

export const fontAwesomeIcons = {
  Gear: 'fa-regular fa-gear',
  GearSolid: 'fa-solid fa-gear',
  Heart: 'fa-regular fa-heart',
  HeartSolid: 'fa-solid fa-heart',
  UserGroup: 'fa-regular fa-user-group',
  UserGroupSolid: 'fa-solid fa-user-group',
};

/**
 * We add single icon from package to reduce bundle size
 * 1. Find icon on https://fontawesome.com/search?s=regular%2Csolid
 * 2. Import from lib:
 *   - with regular icon: '@fortawesome/pro-regular-svg-icons/NEW_ICON_NAME'
 *   - with solid icon: '@fortawesome/pro-solid-svg-icons/NEW_ICON_NAME'
 * 3. Add to library in `initFontAwesomeIcon`
 * 4. Add to `fontAwesomeIcons`
 *   - key: with regular icon, just use name, with solid icon, add `Solid` after name
 *   - value: copy class || react icon as value
 */
