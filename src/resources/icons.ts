import iconSearch from '../../assets/icons/icon_search.svg';
import iconBack from '../../assets/icons/icon_back.svg';
import iconReactionAngry from '../../assets/icons/icon_reaction_angry.svg';
import iconReactionDislike from '../../assets/icons/icon_reaction_dislike.svg';
import iconReactionHaha from '../../assets/icons/icon_reaction_haha.svg';
import iconReactionLike from '../../assets/icons/icon_reaction_like.svg';
import iconReactionLove from '../../assets/icons/icon_reaction_love.svg';
import iconReactionSad from '../../assets/icons/icon_reaction_sad.svg';
import iconReactionShocked from '../../assets/icons/icon_reaction_shocked.svg';
import iconReactionSmile from '../../assets/icons/icon_reaction_smile.svg';
import iconEyeSeen from '../../assets/icons/icon_eye.svg';
import iconReact from '../../assets/icons/icon_react.svg';
import iconDot from '../../assets/icons/ic_dot.svg';
import iconSticker from '../../assets/icons/icon_sticker.svg';
import iconSmileSolid from '../../assets/icons/icon_smile_solid.svg';
import iconSend from '../../assets/icons/icon_send.svg';
import iconReply from '../../assets/icons/icon_reply.svg';
import iconCopy from '../../assets/icons/icon_copy.svg';
import iconReport from '../../assets/icons/icon_report.svg';
import iconArrowDown from '../../assets/icons/icon_arrow_down.svg';
import iconLanguageEn from '../../assets/icons/icon_language_en.svg';
import iconLanguageVi from '../../assets/icons/icon_language_vi.svg';
import iconCheckbox from '../../assets/icons/icon_checkbox.svg';
import iconTabHome from '../../assets/icons/icon_home.svg';
import iconTabHomeBein from '../../assets/icons/icon_home_bein.svg';
import iconTabGroups from '../../assets/icons/icon_groups.svg';
import iconTabGroupsBein from '../../assets/icons/icon_groups_bein.svg';
import iconTabChat from '../../assets/icons/icon_chat.svg';
import iconTabChatBein from '../../assets/icons/icon_chat_bein.svg';
import iconTabNotification from '../../assets/icons/icon_notification.svg';
import iconTabNotificationBein from '../../assets/icons/icon_notification_bein.svg';
import iconTabMenu from '../../assets/icons/icon_menu.svg';
import iconTabMenuBein from '../../assets/icons/icon_menu_bein.svg';
import iconCreateChat from '../../assets/icons/icon_create_chat.svg';

// Below are the completely new icons, added on 08/01/2021
import iconAddPost from '../../assets/icons/icon_add_post.svg';
import iconArrowSwapHorizontal from '../../assets/icons/icon_arrow_swap_horizontal.svg';
import iconBill from '../../assets/icons/icon_bill.svg';
import iconBitcoinConvert from '../../assets/icons/icon_bitcoin_convert.svg';
import iconBookmark from '../../assets/icons/icon_bookmark.svg';
import iconBuyCrypto from '../../assets/icons/icon_buy_crypto.svg';
import iconAddSquareDone from '../../assets/icons/icon_add_square_done.svg';
import iconAddSquareGroup from '../../assets/icons/icon_add_square_group.svg';
import iconAddSquareGroupFilled from '../../assets/icons/icon_add_square_gr_filled.svg';
import iconFeedback from '../../assets/icons/icon_feedback.svg';
import iconLogout from '../../assets/icons/icon_logout.svg';
import iconMessageQuestion from '../../assets/icons/icon_message_question.svg';
import iconMonitor from '../../assets/icons/icon_monitor.svg';
import iconMoon from '../../assets/icons/icon_moon.svg';
import iconSetting from '../../assets/icons/icon_setting.svg';
import iconShieldStar from '../../assets/icons/icon_shield_star.svg';
import iconWallet from '../../assets/icons/icon_wallet.svg';

const icons = {
  iconTabHome,
  iconTabHomeBein,
  iconTabGroups,
  iconTabGroupsBein,
  iconTabChat,
  iconTabChatBein,
  iconTabNotification,
  iconTabNotificationBein,
  iconTabMenu,
  iconTabMenuBein,
  iconAdd: {
    type: 'MaterialIcons',
    name: 'add',
  },
  // iconMenu: {
  //   type: 'MaterialIcons',
  //   name: 'menu',
  // },
  iconSearch,
  iconBack,
  iconEye: {
    type: 'MaterialCommunityIcons',
    name: 'eye-outline',
  },
  iconEyeOff: {
    type: 'MaterialCommunityIcons',
    name: 'eye-off-outline',
  },
  iconClose: {
    type: 'MaterialCommunityIcons',
    name: 'close',
  },
  iconRemove: {
    type: 'MaterialCommunityIcons',
    name: 'close-box',
  },
  iconOptions: {
    type: 'MaterialCommunityIcons',
    name: 'dots-horizontal',
  },
  iconLike: {
    type: 'AntDesign',
    name: 'like1',
  },
  iconLikeOutline: {
    type: 'AntDesign',
    name: 'like2',
  },
  iconVerifiedUser: {
    type: 'MaterialIcons',
    name: 'verified-user',
  },
  iconShare: {
    type: 'SimpleLineIcons',
    name: 'share-alt',
  },
  iconComment: {
    type: 'MaterialCommunityIcons',
    name: 'comment-outline',
  },
  iconDiamond: {
    type: 'MaterialCommunityIcons',
    name: 'diamond-stone',
  },
  // iconNotification: {
  //   type: 'MaterialCommunityIcons',
  //   name: 'bell-outline',
  // },
  iconNotificationOff: {
    type: 'MaterialCommunityIcons',
    name: 'bell-off-outline',
  },
  iconSearchMT: {
    type: 'MaterialCommunityIcons',
    name: 'magnify',
  },
  // iconChat: {
  //   type: 'MaterialCommunityIcons',
  //   name: 'chat-outline',
  // },
  iconPin: {
    type: 'MaterialCommunityIcons',
    name: 'pin',
  },
  iconPinOutline: {
    type: 'MaterialCommunityIcons',
    name: 'pin-outline',
  },
  iconImageMultiple: {
    type: 'MaterialCommunityIcons',
    name: 'image-multiple',
  },
  iconAttachment: {
    type: 'Entypo',
    name: 'attachment',
  },
  iconSendOutline: {
    type: 'MaterialCommunityIcons',
    name: 'send-outline',
  },
  iconReactionAngry,
  iconReactionDislike,
  iconReactionHaha,
  iconReactionLike,
  iconReactionLove,
  iconReactionSad,
  iconReactionShocked,
  iconReactionSmile,
  iconArrowDown,
  iconReply,
  iconCopy,
  iconReport,
  iconUserCircle: {
    type: 'FontAwesome',
    name: 'user-circle-o',
  },
  iconCamera: {
    type: 'MaterialCommunityIcons',
    name: 'camera',
  },
  iconCameraOutline: {
    type: 'SimpleLineIcons',
    name: 'camera',
  },
  iconEmoji: {
    type: 'SimpleLineIcons',
    name: 'emotsmile',
  },
  iconSettings: {
    type: 'MaterialIcons',
    name: 'settings',
  },
  iconEdit: {
    type: 'Feather',
    name: 'edit',
  },
  iconDelete: {
    type: 'AntDesign',
    name: 'delete',
  },
  iconLanguage: {
    type: 'MaterialIcons',
    name: 'language',
  },
  iconTheme: {
    type: 'MaterialCommunityIcons',
    name: 'theme-light-dark',
  },
  iconUserGroup: {
    type: 'MaterialIcons',
    name: 'group',
  },
  iconArrowRight: {
    type: 'Ionicons',
    name: 'chevron-forward-outline',
  },
  iconPublic: {
    type: 'AntDesign',
    name: 'earth',
  },
  iconPrivate: {
    type: 'Ionicons',
    name: 'lock-closed-outline',
  },
  iconEyeSeen,
  iconReact,
  iconDot,
  iconSticker,
  iconSmileSolid,
  iconSend,
  iconLanguageEn,
  iconLanguageVi,
  iconCheckbox,
  iconCreateChat,
  iconAddPost,
  iconArrowSwapHorizontal,
  iconBill,
  iconBitcoinConvert,
  iconBookmark,
  iconBuyCrypto,
  iconAddSquareGroupFilled,
  iconAddSquareGroup,
  iconFeedback,
  iconLogout,
  iconMessageQuestion,
  iconMonitor,
  iconMoon,
  iconSetting,
  iconShieldStar,
  iconWallet,
  iconAddSquareDone,
};

export default icons;
export type IconType = keyof typeof icons;
