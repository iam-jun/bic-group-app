import reactionIcons from '~/resources/reactions';
import iconDot from '../../assets/icons/ic_dot.svg';

// Below are the completely new icons, added on 08/01/2021
import iconAddPost from '../../assets/icons/icon_add_post.svg';
import iconAddSquareDone from '../../assets/icons/icon_add_square_done.svg';
import iconAddSquareGroupFilled from '../../assets/icons/icon_add_square_gr_filled.svg';
import iconAddSquareGroup from '../../assets/icons/icon_add_square_group.svg';
import iconAddGif from '../../assets/icons/icon_add_gif.svg';
import iconArrowDown from '../../assets/icons/icon_arrow_down.svg';
import iconCheckbox from '../../assets/icons/icon_checkbox.svg';
import iconCopy from '../../assets/icons/icon_copy.svg';
import iconEyeSeen from '../../assets/icons/icon_eye.svg';
import iconTabGroups from '../../assets/icons/icon_groups.svg';
import iconTabGroupsBein from '../../assets/icons/icon_groups_bein.svg';
import iconTabHome from '../../assets/icons/icon_home.svg';
import iconTabHomeBein from '../../assets/icons/icon_home_bein.svg';
import iconLanguageEn from '../../assets/icons/icon_language_en.svg';
import iconLanguageVi from '../../assets/icons/icon_language_vi.svg';
import iconTabMenu from '../../assets/icons/icon_menu.svg';
import iconTabMenuBein from '../../assets/icons/icon_menu_bein.svg';
import iconMenuBitConvert from '../../assets/icons/icon_menu_bit_convert.svg';
import iconMenuBookmark from '../../assets/icons/icon_menu_bookmark.svg';
import iconMenuBookmarkRed from '../../assets/icons/icon_menu_bookmark_red.svg';
import iconMenuDraft from '../../assets/icons/icon_menu_draft.svg';
import iconMenuBuyCrypto from '../../assets/icons/icon_menu_buy_crypto.svg';
import iconMenuFeedback from '../../assets/icons/icon_menu_feedback.svg';
import iconMenuHelp from '../../assets/icons/icon_menu_help.svg';
import iconMenuInfo from '../../assets/icons/icon_menu_info.svg';
import iconMenuLogout from '../../assets/icons/icon_menu_logout.svg';
import iconMenuMenu from '../../assets/icons/icon_menu_menu.svg';
import iconMenuMonitor from '../../assets/icons/icon_menu_monitor.svg';
import iconSendComment from '../../assets/icons/icon_send_comment.svg';
// @ts-ignore
import iconCheckboxSelected from '../../assets/icons/icon_checkbox_selected.png';
// @ts-ignore
import iconCheckboxInherited from '../../assets/icons/icon_checkbox_inherited.png';
// @ts-ignore
import iconCheckboxUnselected from '../../assets/icons/icon_checkbox_unselected.png';
import iconCheckboxRestricted from '../../assets/icons/icon_checkbox_retricted.svg';

import iconMenuMoon from '../../assets/icons/icon_menu_moon.svg';
import iconMenuSetting from '../../assets/icons/icon_menu_setting.svg';
import iconMenuSwitch from '../../assets/icons/icon_menu_switch.svg';
import iconMenuWallet from '../../assets/icons/icon_menu_wallet.svg';
import iconTabNotification from '../../assets/icons/icon_notification.svg';
import iconTabNotificationBein from '../../assets/icons/icon_notification_bein.svg';
import iconPin from '../../assets/icons/icon_pin_outline.svg';
import iconPinGroup from '../../assets/icons/icon_pin_group.svg';
import iconPlay from '../../assets/icons/icon_play.svg';
import iconReact from '../../assets/icons/icon_react.svg';
import iconReply from '../../assets/icons/icon_reply.svg';
import iconReplyGrey from '../../assets/icons/icon_reply_grey.svg';
import iconReport from '../../assets/icons/icon_report.svg';
import iconRightArrow from '../../assets/icons/icon_right_arrow.svg';
import iconSearch from '../../assets/icons/icon_search.svg';
import iconShieldStar from '../../assets/icons/icon_shield_star.svg';
import iconSmileSolid from '../../assets/icons/icon_smile_solid.svg';
import iconStar from '../../assets/icons/icon_star_alt.svg';
import iconSticker from '../../assets/icons/icon_sticker.svg';
import iconFlagVn from '../../assets/icons/icon_flag_vn.svg';
import iconFlagSg from '../../assets/icons/icon_flag_sg.svg';
import iconFlagUs from '../../assets/icons/icon_flag_us.svg';
import addUsers from '../../assets/icons/add_users.svg';
import iconMapPin from '../../assets/icons/ic_map_pin.svg';
import iconChat from '../../assets/icons/icon_chat.svg';
import iconCheckCircle from '../../assets/icons/icon_check_circle.svg';
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
import iconSecret from '../../assets/icons/icon_secret_group.svg';
import iconPlayGif from '../../assets/icons/ic_play_gif.svg';
import fileIcons from './fileIcons';
import iconBeinChat from '../../assets/icons/icon_bein_chat.svg';

const icons = {
  iconBeinChat,
  iconTabHome,
  iconTabHomeBein,
  iconTabGroups,
  iconTabGroupsBein,
  iconTabNotification,
  iconTabNotificationBein,
  iconTabMenu,
  iconSearch,
  iconBack: 'AngleLeftB',
  iconNext: 'AngleRightB',
  iconEye: 'Eye',
  iconEyeOff: 'EyeSlash',
  iconClose: 'Multiply',
  iconCloseSmall: 'Times',
  iconOptions: 'EllipsisV',
  iconAddImage: 'ImagePlus',
  iconUploadImage: 'ImageUpload',
  iconArrowDown,
  iconReply,
  iconReplyGrey,
  iconCopy,
  iconReport,
  iconSettings: 'EllipsisH',
  iconLanguage: 'Language',
  iconTheme: 'Sun',
  iconPrivate: 'Lock',
  AngleRight: 'AngleRight',
  AngleRightB: 'AngleRightB',
  AngleDown: 'AngleDown',
  AngleUp: 'AngleUp',
  KeyboardShow: 'KeyboardShow',
  Backspace: 'Backspace',
  CornerDownRight: 'CornerDownRight',
  Trash: 'Trash',
  FileEditAlt: 'FileEditAlt',
  FileLockAlt: 'FileLockAlt',
  Edit: 'Edit',
  Redo: 'Redo',
  ImageV: 'ImageV',
  Paperclip: 'Paperclip',
  ImagePlus: 'ImagePlus',
  Sync: 'Sync',
  Link: 'Link',
  menu: 'EllipsisH',
  EllipsisV: 'EllipsisV',
  EllipsisH: 'EllipsisH',
  TachometerFastAlt: 'TachometerFastAlt',
  Bookmark: 'Bookmark',
  Copy: 'Copy',
  Bell: 'Bell',
  BellSlash: 'BellSlash',
  TrashAlt: 'TrashAlt',
  ShareAlt: 'ShareAlt',
  InfoCircle: 'InfoCircle',
  CalendarAlt: 'CalendarAlt',
  Clock: 'Clock',
  CommentAltDots: 'CommentAltDots',
  iconEyeSeen,
  iconReact,
  iconDot,
  iconSticker,
  iconSmileSolid,
  iconSend: 'Message',
  iconSendComment: iconSendComment,
  iconLanguageEn,
  iconLanguageVi,
  iconCheckbox,
  iconCheckboxUnselected,
  iconCheckboxSelected,
  iconCheckboxInherited,
  iconCheckboxRestricted,
  users: 'UsersAlt',
  search: 'Search',
  addUser: 'UserPlus',
  bell: 'Bell',
  iconPin,
  iconPinGroup,
  attachment: 'Paperclip',
  Image: 'Image',
  images: 'Images',
  leavesGroup: 'SignOutAlt',
  iconAddPost,
  iconAddSquareDone,
  iconAddSquareGroup,
  iconAddSquareGroupFilled,
  iconAddGif,
  iconShieldStar,
  iconMenuMoon,
  iconMenuBookmark,
  iconMenuBookmarkRed,
  iconMenuDraft,
  iconMenuMonitor,
  iconMenuSetting,
  iconMenuWallet,
  iconMenuBuyCrypto,
  iconMenuBitConvert,
  iconMenuHelp,
  iconMenuMenu,
  iconMenuInfo,
  iconMenuFeedback,
  iconMenuSwitch,
  iconMenuLogout,
  iconTabMenuBein,
  BriefcaseAlt: 'BriefcaseAlt',
  LocationPoint: 'LocationPoint',
  CommentsAlt: 'CommentsAlt',
  CommentSlash: 'CommentSlash',
  Phone: 'Phone',
  Envelope: 'Envelope',
  EnvelopeAlt: 'EnvelopeAlt',
  SlidersAlt: 'SlidersVAlt',
  EditAlt: 'EditAlt',
  TextFields: 'TextFields',
  UserSquare: 'UserSquare',
  UserTimes: 'UserTimes',
  Calender: 'Calender',
  Globe: 'Globe',
  Lock: 'Lock',
  UserExclamation: 'UserExclamation',
  Cog: 'Cog',
  At: 'At',
  Camera: 'Camera',
  ChatBubbleUser: 'ChatBubbleUser',
  UserCircle: 'UserCircle',
  FileCopyAlt: 'FileCopyAlt',
  WebGrid: 'WebGrid',
  EyeSlash: 'EyeSlash',
  Check: 'Check',
  UsersAlt: 'UsersAlt',
  Heart: 'Heart',
  ...reactionIcons,
  Feedback: 'Feedback',
  Save: 'Save',
  File: 'File',
  Video: 'Video',
  PlayVideo: iconPlay,
  Star: 'Star',
  iconStar: iconStar,
  RightArrow: iconRightArrow,
  CommentAltCheck: 'CommentAltCheck',
  iconUserPlus: 'UserPlus',
  RemoveUser: 'UserTimes',
  ArrowDown: 'ArrowDown',
  CreateThread: 'CommentAltPlus',
  Smile: 'Smile',
  ArrowRight: 'ArrowRight',
  ArrowLeft: 'ArrowLeft',
  Plus: 'Plus',
  iconFlagVn,
  iconFlagSg,
  iconFlagUs,
  iconSuitcase: 'Suitcase',
  FileExclamationAlt: 'FileExclamationAlt',
  ExclamationTriangle: 'ExclamationTriangle',
  FileTimesAlt: 'FileTimesAlt',
  WifiSlash: 'WifiSlash',
  SignOutAlt: 'SignOutAlt',
  Bug: 'Bug',
  Bars: 'Bars',
  Channel: 'Channel',
  addUsers,
  iconMapPin,
  iconChat,
  iconCheckCircle,
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
  Compass: 'Compass',
  Dashboard: 'Dashboard',
  iconLock,
  PlayCircle: 'PlayCircle',
  Sitemap: 'Sitemap',
  iconSecret,
  VolumeMute: 'VolumeMute',
  CheckCircle: 'CheckCircle',
  iconPlayGif,
  download: 'CloudDownload',
  ...fileIcons,
};

export default icons;
export type IconType = keyof typeof icons;
