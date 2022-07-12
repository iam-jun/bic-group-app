import {library} from '@fortawesome/fontawesome-svg-core';
import {faGear} from '@fortawesome/pro-regular-svg-icons/faGear';
import {faGear as faGearSolid} from '@fortawesome/pro-solid-svg-icons/faGear';
import {faHeart} from '@fortawesome/pro-regular-svg-icons/faHeart';
import {faHeart as faHeartSolid} from '@fortawesome/pro-solid-svg-icons/faHeart';
import {faUserGroup} from '@fortawesome/pro-regular-svg-icons/faUserGroup';
import {faUserGroup as faUserGroupSolid} from '@fortawesome/pro-solid-svg-icons/faUserGroup';
import {faCheck} from '@fortawesome/pro-regular-svg-icons/faCheck';
import {faCheck as faCheckSolid} from '@fortawesome/pro-solid-svg-icons/faCheck';
import {faObjectExclude} from '@fortawesome/pro-regular-svg-icons/faObjectExclude';
import {faLayerGroup} from '@fortawesome/pro-regular-svg-icons/faLayerGroup';
import {faCopy} from '@fortawesome/pro-regular-svg-icons/faCopy';
import {faCircleUser} from '@fortawesome/pro-regular-svg-icons/faCircleUser';
import {faCamera} from '@fortawesome/pro-regular-svg-icons/faCamera';
import {faLock} from '@fortawesome/pro-regular-svg-icons/faLock';
import {faGlobe} from '@fortawesome/pro-regular-svg-icons/faGlobe';
import {faCalendar} from '@fortawesome/pro-regular-svg-icons/faCalendar';
import {faUserXmark} from '@fortawesome/pro-regular-svg-icons/faUserXmark';
import {faSquareUser} from '@fortawesome/pro-regular-svg-icons/faSquareUser';
import {faUserCheck} from '@fortawesome/pro-regular-svg-icons/faUserCheck';
import {faTextSize} from '@fortawesome/pro-regular-svg-icons/faTextSize';
import {faSlidersUp} from '@fortawesome/pro-regular-svg-icons/faSlidersUp';

export const initFontAwesomeIcon = () => {
  library.add(
    faGear,
    faGearSolid,
    faHeart,
    faHeartSolid,
    faUserGroup,
    faUserGroupSolid,
    faCheck,
    faCheckSolid,
    faObjectExclude,
    faLayerGroup,
    faCopy,
    faCircleUser,
    faCamera,
    faLock,
    faGlobe,
    faCalendar,
    faUserXmark,
    faSquareUser,
    faUserCheck,
    faTextSize,
    faSlidersUp,
  );
};

export const fontAwesomeIcons = {
  Gear: 'fa-regular fa-gear',
  GearSolid: 'fa-solid fa-gear',
  Heart: 'fa-regular fa-heart',
  HeartSolid: 'fa-solid fa-heart',
  UserGroup: 'fa-regular fa-user-group',
  UserGroupSolid: 'fa-solid fa-user-group',
  Check: 'fa-regular fa-check',
  CheckSolid: 'fa-solid fa-check',
  ObjectExclude: 'fa-regular fa-object-exclude',
  LayerGroup: 'fa-regular fa-layer-group',
  EyeSlash: 'fa-regular fa-eye-slash',
  Copy: 'fa-regular fa-copy',
  CircleUser: 'fa-regular fa-circle-user',
  Camera: 'fa-regular fa-camera',
  Lock: 'fa-regular fa-lock',
  Globe: 'fa-regular fa-globe',
  Calendar: 'fa-regular fa-calendar',
  UserXmark: 'fa-regular fa-user-xmark',
  SquareUser: 'fa-regular fa-square-user',
  UserCheck: 'fa-regular fa-user-check',
  TextSize: 'fa-regular fa-text-size',
  SlidersUp: 'fa-regular fa-sliders-up',
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
