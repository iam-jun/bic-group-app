import reactionIcons from '~/resources/reactions';

// Below are the completely new icons, added on 08/01/2021
import iconAddSquareDone from '../../assets/icons/icon_add_square_done.svg';
import iconAddGif from '../../assets/icons/icon_add_gif.svg';
import iconCheckbox from '../../assets/icons/icon_checkbox.svg';
import iconLanguageEn from '../../assets/icons/icon_language_en.svg';
import iconLanguageVi from '../../assets/icons/icon_language_vi.svg';
import iconTabMenuBein from '../../assets/icons/icon_menu_bein.svg';
import iconMenuDraft from '../../assets/icons/icon_menu_draft.svg';
import iconMenuFeedback from '../../assets/icons/icon_menu_feedback.svg';
import iconMenuHelp from '../../assets/icons/icon_menu_help.svg';
import iconMenuInfo from '../../assets/icons/icon_menu_info.svg';
import iconMenuLogout from '../../assets/icons/icon_menu_logout.svg';
import iconMenuMenu from '../../assets/icons/icon_menu_menu.svg';
import iconCheckboxRestricted from '../../assets/icons/icon_checkbox_retricted.svg';

import iconMenuSetting from '../../assets/icons/icon_menu_setting.svg';
import iconSearch from '../../assets/icons/icon_search.svg';
import iconShieldStar from '../../assets/icons/icon_shield_star.svg';
import iconStar from '../../assets/icons/icon_star_alt.svg';
import iconFlagVn from '../../assets/icons/icon_flag_vn.svg';
import iconFlagSg from '../../assets/icons/icon_flag_sg.svg';
import iconFlagUs from '../../assets/icons/icon_flag_us.svg';
import addUsers from '../../assets/icons/add_users.svg';
import searchUsers from '../../assets/icons/search_users.svg';
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
import iconTabCommunitiesBein from '../../assets/icons/icon_communities_bein.svg';
import iconLock from '../../assets/icons/icon_lock.svg';
import iconPlayGif from '../../assets/icons/ic_play_gif.svg';
import iconBeinChat from '../../assets/icons/icon_bein_chat.svg';
import fileIcons from './fileIcons';
import { fontAwesomeIcons } from '~/services/fontAwesomeIcon';
import iconUpdateNewVersion from '../../assets/icons/icon_update_new_version.svg';

const icons = {
  ...fileIcons,
  ...reactionIcons,
  iconUpdateNewVersion,
  iconBeinChat,
  iconSearch,
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
  searchUsers,
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
  iconTabCommunitiesBein,
  iconLock,
  iconPlayGif,
  iconStar,
  iconReact: fontAwesomeIcons.FaceSmile,
  iconSave: fontAwesomeIcons.FloppyDisk,
  iconSend: fontAwesomeIcons.PaperPlaneTop,
  iconSuitcase: fontAwesomeIcons.Suitcase,
  download: fontAwesomeIcons.CloudArrowDown,
  iconBack: fontAwesomeIcons.AngleLeft,
  iconEye: fontAwesomeIcons.Eye,
  iconEyeOff: fontAwesomeIcons.EyeSlash,
  iconClose: fontAwesomeIcons.XmarkLarge,
  iconCloseSmall: fontAwesomeIcons.Xmark,
  iconOptions: fontAwesomeIcons.Ellipsis,
  iconSettings: fontAwesomeIcons.Ellipsis,
  edit: fontAwesomeIcons.PenToSquare,
  menu: fontAwesomeIcons.Ellipsis,
  search: fontAwesomeIcons.MagnifyingGlass,
  iconCheckCircle: fontAwesomeIcons.CircleCheck,
  iconExpand: fontAwesomeIcons.UpRightAndDownLeftFromCenter,
  iconCircleExclamation: fontAwesomeIcons.CircleExclamation,
  iconFlagSolid: fontAwesomeIcons.FlagSolid,

  // PRIVACY
  iconOpen: fontAwesomeIcons.GlobeSolid,
  iconClosed: fontAwesomeIcons.EyeSolid,
  iconSecret: fontAwesomeIcons.ShieldHalvedSolid,
  iconPrivate: fontAwesomeIcons.LockKeyholeSolid,

  // MAIN TAB
  iconTabHome: fontAwesomeIcons.House,
  iconTabCommunities: fontAwesomeIcons.PeopleGroup,
  iconTabArticle: fontAwesomeIcons.Ballot,
  iconTabWallet: fontAwesomeIcons.Wallet,
  iconTabNotification: fontAwesomeIcons.Bell,
  iconTabMenu: fontAwesomeIcons.Bars,
  iconTabHomeActive: fontAwesomeIcons.HouseSolid,
  iconTabCommunitiesActive: fontAwesomeIcons.PeopleGroupSolid,
  iconTabArticleActive: fontAwesomeIcons.BallotSolid,
  iconTabWalletActive: fontAwesomeIcons.WalletSolid,
  iconTabNotificationActive: fontAwesomeIcons.BellSolid,
  iconTabMenuActive: fontAwesomeIcons.BarsSolid,

  // EMOJI CATEGORIES
  iconCatEmoticon: fontAwesomeIcons.FaceSmile,
  iconCatRecent: fontAwesomeIcons.Clock,
  iconCatPeople: fontAwesomeIcons.User,
  iconCatAnimal: fontAwesomeIcons.PawSimple,
  iconCatFood: fontAwesomeIcons.BurgerSoda,
  iconCatTravel: fontAwesomeIcons.Plane,
  iconCatActivity: fontAwesomeIcons.Basketball,
  iconCatObject: fontAwesomeIcons.Lightbulb,
  iconCatSymbol: fontAwesomeIcons.Symbols,
  iconCatFlag: fontAwesomeIcons.Flag,
  iconCatCustom: fontAwesomeIcons.Gear,

  // ^ ADD RENAMED ICON HERE
  // IF YOU WANT TO RENAME ICON, ADD TO fontAwesomeIcons FIRST
  ...fontAwesomeIcons,
  // FOR AWESOME ICONS NOT ADD YET, PLEASE ADD IN FILE `fontAwesomeIcon.ts`, READ NOTE CAREFULLY
};

export default icons;
export type IconType = keyof typeof icons;
