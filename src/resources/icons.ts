import reactionIcons from '~/resources/reactions';

// Below are the completely new icons, added on 08/01/2021
import iconAddSquareDone from '../../assets/icons/icon_add_square_done.svg';
import iconAddGif from '../../assets/icons/icon_add_gif.svg';
import iconCheckbox from '../../assets/icons/icon_checkbox.svg';
import iconTabHome from '../../assets/icons/icon_home.svg';
import iconTabHomeBein from '../../assets/icons/icon_home_bein.svg';
import iconLanguageEn from '../../assets/icons/icon_language_en.svg';
import iconLanguageVi from '../../assets/icons/icon_language_vi.svg';
import iconTabMenu from '../../assets/icons/icon_menu.svg';
import iconTabMenuBein from '../../assets/icons/icon_menu_bein.svg';
import iconMenuDraft from '../../assets/icons/icon_menu_draft.svg';
import iconMenuFeedback from '../../assets/icons/icon_menu_feedback.svg';
import iconMenuHelp from '../../assets/icons/icon_menu_help.svg';
import iconMenuInfo from '../../assets/icons/icon_menu_info.svg';
import iconMenuLogout from '../../assets/icons/icon_menu_logout.svg';
import iconMenuMenu from '../../assets/icons/icon_menu_menu.svg';
import iconSendComment from '../../assets/icons/icon_send_comment.svg';
import iconCheckboxRestricted from '../../assets/icons/icon_checkbox_retricted.svg';

import iconMenuSetting from '../../assets/icons/icon_menu_setting.svg';
import iconTabNotification from '../../assets/icons/icon_notification.svg';
import iconTabNotificationBein from '../../assets/icons/icon_notification_bein.svg';
import iconSearch from '../../assets/icons/icon_search.svg';
import iconShieldStar from '../../assets/icons/icon_shield_star.svg';
import iconStar from '../../assets/icons/icon_star_alt.svg';
import iconFlagVn from '../../assets/icons/icon_flag_vn.svg';
import iconFlagSg from '../../assets/icons/icon_flag_sg.svg';
import iconFlagUs from '../../assets/icons/icon_flag_us.svg';
import addUsers from '../../assets/icons/add_users.svg';
import iconMapPin from '../../assets/icons/ic_map_pin.svg';
import iconChat from '../../assets/icons/icon_chat.svg';
import iconPermissionGuide1Android from '../../assets/icons/icon_permission_guide_1_android.svg';
import iconPermissionGuide2Android from '../../assets/icons/icon_permission_guide_2_android.svg';
import iconPermissionGuide3Android from '../../assets/icons/icon_permission_guide_3_android.svg';
import iconPermissionGuide4Android from '../../assets/icons/icon_permission_guide_4_android.svg';
import iconPermissionGuide1Ios from '../../assets/icons/icon_permission_guide_1_ios.svg';
import iconPermissionGuide2Ios from '../../assets/icons/icon_permission_guide_2_ios.svg';
import iconPermissionGuide3Ios from '../../assets/icons/icon_permission_guide_3_ios.svg';
import iconPermissionGuide4Ios from '../../assets/icons/icon_permission_guide_4_ios.svg';
import iconCannotComment from '../../assets/icons/icon_cannot_comment.svg';
import iconTabCommunities from '../../assets/icons/icon_communities.svg';
import iconTabCommunitiesBein from '../../assets/icons/icon_communities_bein.svg';
import iconLock from '../../assets/icons/icon_lock.svg';
import iconPlayGif from '../../assets/icons/ic_play_gif.svg';
import iconBeinChat from '../../assets/icons/icon_bein_chat.svg';
import fileIcons from './fileIcons';
import { fontAwesomeIcons } from '~/services/fontAwesomeIcon';

const icons = {
  ...fileIcons,
  ...reactionIcons,
  iconBeinChat,
  iconTabHome,
  iconTabHomeBein,
  iconTabNotification,
  iconTabNotificationBein,
  iconTabMenu,
  iconSearch,
  iconSendComment,
  iconLanguageEn,
  iconLanguageVi,
  iconCheckbox,
  iconCheckboxUnselected: require('../../assets/icons/icon_checkbox_unselected.png'),
  iconCheckboxSelected: require('../../assets/icons/icon_checkbox_selected.png'),
  iconCheckboxInherited: require('../../assets/icons/icon_checkbox_inherited.png'),
  iconCheckboxRestricted,
  iconAddSquareDone,
  iconAddGif,
  iconShieldStar,
  iconMenuDraft,
  iconMenuSetting,
  iconMenuHelp,
  iconMenuMenu,
  iconMenuInfo,
  iconMenuFeedback,
  iconMenuLogout,
  iconTabMenuBein,
  iconFlagVn,
  iconFlagSg,
  iconFlagUs,
  addUsers,
  iconMapPin,
  iconChat,
  iconPermissionGuide1Android,
  iconPermissionGuide2Android,
  iconPermissionGuide3Android,
  iconPermissionGuide4Android,
  iconPermissionGuide1Ios,
  iconPermissionGuide2Ios,
  iconPermissionGuide3Ios,
  iconPermissionGuide4Ios,
  iconCannotComment,
  iconTabCommunities,
  iconTabCommunitiesBein,
  iconLock,
  iconPlayGif,
  iconStar,
  iconReact: fontAwesomeIcons.FaceSmile,
  iconSave: fontAwesomeIcons.FloppyDisk,
  iconSend: fontAwesomeIcons.PaperPlaneTop,
  iconSuitcase: fontAwesomeIcons.Suitcase,
  download: fontAwesomeIcons.CloudArrowDown,
  iconBack: fontAwesomeIcons.AngleLeftSolid,
  iconEye: fontAwesomeIcons.Eye,
  iconEyeOff: fontAwesomeIcons.EyeSlash,
  iconClose: fontAwesomeIcons.XmarkLarge,
  iconCloseSmall: fontAwesomeIcons.Xmark,
  iconOptions: fontAwesomeIcons.Ellipsis,
  iconSettings: fontAwesomeIcons.Ellipsis,
  edit: fontAwesomeIcons.PenToSquare,
  menu: fontAwesomeIcons.Ellipsis,
  search: fontAwesomeIcons.MagnifyingGlass,

  // PRIVACY
  iconPublic: fontAwesomeIcons.Globe,
  iconOpen: fontAwesomeIcons.Eye,
  iconSecret: fontAwesomeIcons.ShieldHalved,
  iconPrivate: fontAwesomeIcons.LockKeyhole,

  // ^ ADD RENAMED ICON HERE
  // IF YOU WANT TO RENAME ICON, ADD TO fontAwesomeIcons FIRST
  ...fontAwesomeIcons,
  // FOR AWESOME ICONS NOT ADD YET, PLEASE ADD IN FILE `fontAwesomeIcon.ts`, READ NOTE CAREFULLY
};

export default icons;
export type IconType = keyof typeof icons;
