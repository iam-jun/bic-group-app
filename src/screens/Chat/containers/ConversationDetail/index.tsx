import {RouteProp, useRoute} from '@react-navigation/core';
import i18next from 'i18next';
import React, {useEffect, useRef, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Avatar from '~/beinComponents/Avatar';
import BottomSheet from '~/beinComponents/BottomSheet';
import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import Icon from '~/beinComponents/Icon';
import Image from '~/beinComponents/Image';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import {ViewSpacing} from '~/components';
import {chatPermissions, roomTypes} from '~/constants/chat';
import useAuth from '~/hooks/auth';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IGroup} from '~/interfaces/IGroup';
import {RootStackParamList} from '~/interfaces/IRouter';
import {IconType} from '~/resources/icons';
import images from '~/resources/images';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import * as modalActions from '~/store/modal/actions';
import {scaleCoverHeight} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {titleCase} from '~/utils/common';
import actions from '../../redux/actions';

const _ConversationDetail = (): React.ReactElement => {
  const dispatch = useDispatch();
  const route = useRoute<RouteProp<RootStackParamList, 'ConversationDetail'>>();

  const [coverHeight, setCoverHeight] = useState<number>(210);
  const theme = useTheme() as ITheme;
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme, coverHeight, insets);
  const {colors, spacing} = theme;

  const {conversation} = useChat();
  const {_id, disableNotifications} = conversation;

  const {rootNavigation} = useRootNavigation();
  const isDirect = conversation.type === roomTypes.DIRECT;
  const baseSheetRef: any = useRef();
  const permissions = conversation.permissions || {};
  const {user} = useAuth();

  useEffect(() => {
    if (route?.params?.roomId)
      dispatch(actions.getConversationDetail(route?.params?.roomId));
    dispatch(actions.clearSelectedUsers());
  }, [route?.params?.roomId]);

  const onPressBack = () => {
    if (rootNavigation.canGoBack) rootNavigation.goBack();
    else
      rootNavigation.replace(chatStack.conversation, {
        roomId: route?.params?.roomId,
      });
  };

  const goGroupMembers = () => {
    rootNavigation.navigate(chatStack.chatGroupMembers, {
      roomId: conversation._id,
    });
  };

  const goAddMembers = () => {
    dispatch(actions.clearSelectedUsers());
    rootNavigation.navigate(chatStack.addMembers, {roomId: conversation._id});
  };

  const saveChatName = (text: string) => {
    dispatch(modalActions.hideAlert());
    dispatch(actions.updateConversationName(text));
  };

  const showChangeNameModal = () => {
    baseSheetRef.current?.close();
    dispatch(
      modalActions.showAlert({
        title: i18next.t('chat:detail_menu:edit_name'),
        input: true,
        inputProps: {
          value: conversation.name,
          clearText: true,
        },
        cancelBtn: true,
        confirmLabel: i18next.t('common:text_save'),
        onConfirm: saveChatName,
      }),
    );
  };

  const goToEditConversationDescription = () => {
    rootNavigation.navigate(chatStack.editChatDescription, {
      roomId: conversation._id,
    });
  };

  const onPressLeave = () => {
    baseSheetRef.current?.close();
    alertLeaveChat();
  };

  const alertLeaveChat = () => {
    const alertPayload = {
      iconName: 'SignOutAlt',
      title: i18next.t('chat:modal_confirm_leave_chat:title'),
      content: i18next.t('chat:modal_confirm_leave_chat:description'),
      ContentComponent: Text.BodyS,
      cancelBtn: true,
      cancelBtnProps: {
        textColor: theme.colors.primary7,
      },
      onConfirm: () => doLeaveChat(),
      confirmLabel: i18next.t('chat:modal_confirm_leave_chat:button_leave'),
      ConfirmBtnComponent: Button.Danger,
    };

    if (conversation.type !== roomTypes.GROUP) {
      dispatch(modalActions.showAlert(alertPayload));
      return;
    }

    // Handling leaving other inner groups
    groupsDataHelper
      .getUserInnerGroups(conversation.beinGroupId, user.username)
      .then(res => {
        const innerGroups = res.data.inner_groups.map(
          (group: IGroup) => group.name,
        );
        if (innerGroups.length > 0) {
          alertPayload.content =
            alertPayload.content +
            ` ${i18next.t('chat:modal_confirm_leave_chat:leave_inner_groups')}`;

          const groupsLeaveToString = innerGroups.join(', ');
          alertPayload.content = alertPayload.content.replace(
            '{0}',
            groupsLeaveToString,
          );
        }

        dispatch(modalActions.showAlert(alertPayload));
      })
      .catch(err => {
        console.log('[ERROR] error while fetching user inner groups', err);
        dispatch(
          modalActions.showHideToastMessage({
            content: 'error:http:unknown',
            props: {textProps: {useI18n: true}, type: 'error'},
          }),
        );
      });
  };

  const doLeaveChat = () => {
    if (conversation.type !== roomTypes.GROUP) {
      dispatch(actions.leaveChat(conversation?._id, roomTypes.QUICK));
    } else {
      dispatch(actions.leaveChat(conversation?.beinGroupId, roomTypes.GROUP));
    }
  };

  const onItemPress = (type: string) => {
    switch (type) {
      case 'members':
        goGroupMembers();
        break;
      case 'editName':
        showChangeNameModal();
        break;
      case 'editDescription':
        baseSheetRef.current?.close();
        goToEditConversationDescription();
        break;
      case 'leavesGroup':
        onPressLeave();
        break;
      default:
        baseSheetRef.current?.close();
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  const renderAvatar = () => {
    return (
      <Avatar.LargeAlt
        source={conversation?.avatar}
        placeholderSource={
          conversation?.type === roomTypes.DIRECT
            ? images.img_user_avatar_default
            : images.img_group_avatar_default
        }
      />
    );
  };

  const renderHeader = () => {
    return (
      <View>
        {renderCover()}
        {renderOptionMenu()}
        {renderGroupInfoHeader()}
      </View>
    );
  };

  const renderMembers = () => {
    if (isDirect) return;
    const label = `${i18next.t('chat:title_members')} (${
      conversation?.usersCount
    })`;
    return renderActionItem('members', 'users', label);
  };

  const renderDescription = () => {
    return (
      <View style={styles.description}>
        <Divider />
        <ViewSpacing height={spacing.margin.large} />
        <Text.H6>{i18next.t('common:text_description')}</Text.H6>
        <ViewSpacing height={spacing.margin.base} />
        {conversation.description ? (
          <CollapsibleText content={conversation.description} />
        ) : (
          <Text.BodyS useI18n color={colors.textSecondary}>
            chat:label_no_description
          </Text.BodyS>
        )}
      </View>
    );
  };

  const onPressMute = () => {
    if (disableNotifications)
      dispatch(actions.turnOnConversationNotifications({roomId: _id}));
    else dispatch(actions.turnOffConversationNotifications({roomId: _id}));
  };

  const renderButtonMute = () => {
    if (disableNotifications)
      return (
        <Button.Icon
          icon="BellSlash"
          style={styles.menuOption}
          iconWrapperStyle={styles.buttonMuteEnable}
          tintColor={colors.primary7}
          label={i18next.t('chat:label_unmute')}
          onPress={onPressMute}
        />
      );

    return (
      <Button.Icon
        icon="Bell"
        style={styles.menuOption}
        tintColor={colors.primary7}
        label={i18next.t('chat:label_mute')}
        onPress={onPressMute}
      />
    );
  };

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <Button.Icon
        icon="search"
        style={styles.menuOption}
        tintColor={colors.primary7}
        label={i18next.t('common:text_search')}
      />
      {permissions[chatPermissions.CAN_PIN_MESSAGE] && (
        <Button.Icon
          icon="iconPin"
          style={styles.menuOption}
          tintColor={colors.primary7}
          label={i18next.t('chat:label_pin_chat')}
        />
      )}
      {permissions[chatPermissions.CAN_MUTE] && renderButtonMute()}
      {!isDirect && permissions[chatPermissions.CAN_MANAGE_MEMBER] && (
        <Button.Icon
          icon="addUser"
          style={styles.menuOption}
          tintColor={colors.primary7}
          label={i18next.t('chat:label_invite')}
          onPress={goAddMembers}
        />
      )}
    </View>
  );

  const renderActionItem = (
    type: string,
    icon: IconType,
    label: string,
    hideRightArrow = false,
  ) => {
    const RightComponent = hideRightArrow ? undefined : (
      <Icon icon="AngleRight" size={24} />
    );

    return (
      <TouchableOpacity onPress={() => onItemPress(type)}>
        <MenuItem
          style={styles.actionItem}
          title={label}
          icon={icon}
          // leftIconProps={{icon, size: 20, style: styles.actionItemIcon}}
          RightComponent={RightComponent}
        />
      </TouchableOpacity>
    );
  };

  const renderActions = () => (
    <View style={styles.bottomMenu}>
      <Text style={styles.bottomMenuTitle}>
        {i18next.t('chat:title_files_images_links')}
      </Text>
      {renderActionItem(
        'files',
        'attachment',
        i18next.t('chat:label_attachments'),
      )}
      {renderActionItem('gallery', 'images', i18next.t('chat:label_gallery'))}
      {isDirect &&
        renderActionItem(
          'users',
          'users',
          `${i18next.t('chat:label_create_group_chat_with')} ${
            conversation.name
          }`,
        )}
    </View>
  );

  const renderPrivacy = () => {
    return (
      <View style={styles.bottomMenu}>
        <Text style={styles.bottomMenuTitle}>
          {i18next.t('chat:title_privacy')}
        </Text>

        {isDirect ? (
          renderActionItem(
            'block',
            'ChatBlock',
            `${i18next.t('chat:text_block')} ${conversation.name}`,
          )
        ) : (
          <>
            {renderActionItem(
              'feedback',
              'Feedback',
              i18next.t('chat:text_feedback'),
            )}
            {permissions[chatPermissions.CAN_LEAVE] &&
              renderActionItem(
                'leavesGroup',
                'leavesGroup',
                i18next.t('chat:label_leaves_group'),
              )}
          </>
        )}
      </View>
    );
  };

  const renderAdminTool = () => {
    if (isDirect) return null;
    return (
      <View style={styles.bottomMenu}>
        <Text style={styles.bottomMenuTitle}>
          {i18next.t('chat:title_admin_tool')}
        </Text>
        {renderActionItem(
          'pinGroup',
          'iconPin',
          i18next.t('chat:label_pin_messages'),
        )}
        {renderActionItem(
          'chatPermission',
          'ChatPermission',
          i18next.t('chat:label_permission_management'),
        )}
      </View>
    );
  };

  const renderBottomSheet = () => {
    return (
      <BottomSheet
        modalizeRef={baseSheetRef}
        ContentComponent={
          <View style={styles.bottomSheet}>
            {renderActionItem(
              'changeAvatar',
              'ImageV',
              i18next.t('chat:detail_menu:change_avatar'),
              true,
            )}
            {renderActionItem(
              'editDescription',
              'EditAlt',
              i18next.t('chat:detail_menu:edit_description'),
              true,
            )}
            {renderActionItem(
              'editName',
              'TextFields',
              i18next.t('chat:detail_menu:edit_name'),
              true,
            )}
          </View>
        }
      />
    );
  };

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };

  const getDefaultCoverImage = (type: keyof typeof roomTypes) => {
    if (type === roomTypes.GROUP) {
      return images.img_chat_group_cover_default;
    } else if (type === roomTypes.QUICK) {
      return images.img_quick_chat_cover_default;
    } else {
      return images.img_direct_chat_cover_default;
    }
  };

  const renderCover = () => {
    return (
      <View onLayout={onCoverLayout}>
        <Image
          style={styles.cover}
          source={conversation?.background_img_url}
          placeholderSource={getDefaultCoverImage(conversation?.type)}
        />
      </View>
    );
  };

  const renderOptionMenu = () => {
    return (
      <LinearGradient
        colors={['rgba(41, 39, 42, 0.4219)', 'rgba(255, 255, 255, 0.1)']}
        style={styles.groupOptionMenu}>
        <Icon
          icon="iconBack"
          onPress={onPressBack}
          size={28}
          tintColor={colors.background}
        />
        {conversation.type === roomTypes.QUICK && (
          <Icon
            icon="iconSettings"
            size={28}
            tintColor={colors.background}
            onPress={onPressMenu}
          />
        )}
      </LinearGradient>
    );
  };

  const renderGroupIcon = () => {
    return (
      conversation?.type === roomTypes.GROUP && (
        <Button.Secondary leftIcon={'UsersAlt'} useI18n>
          common:text_group
        </Button.Secondary>
      )
    );
  };

  const renderGroupInfoHeader = () => {
    return (
      <LinearGradient
        colors={['rgba(41, 39, 42, 0)', 'rgba(41, 39, 42, 1)']}
        style={styles.groupHeader}>
        {renderAvatar()}
        <View style={styles.groupTitle}>
          <Text.H5 numberOfLines={2} color={colors.background}>
            {conversation?.name}
          </Text.H5>

          {conversation?.type === roomTypes.GROUP && (
            <View style={styles.groupInfo}>
              <Icon
                style={styles.iconSmall}
                icon={'iconPrivate'}
                size={16}
                tintColor={colors.background}
              />
              <Text.BodySM color={colors.background} useI18n>
                {titleCase(conversation?.privacy)}
              </Text.BodySM>
              <Text.BodySM color={colors.background}>{`  ⬩  `}</Text.BodySM>
              <Icon
                style={styles.iconSmall}
                icon={'UsersAlt'}
                size={17}
                tintColor={colors.background}
              />
              <Text.BodySM color={colors.background}>
                {conversation?.usersCount}
              </Text.BodySM>
            </View>
          )}
        </View>
        {renderGroupIcon()}
      </LinearGradient>
    );
  };

  const onPressMenu = (e: any) => {
    baseSheetRef.current?.open(e?.pageX, e?.pageY);
  };

  return (
    <ScreenWrapper
      style={styles.wrapper}
      testID="ConversationDetailScreen"
      isFullView>
      <ScrollView style={styles.root}>
        <View style={styles.container}>
          <View style={styles.top}>
            {renderHeader()}
            {renderMenu()}
            {renderDescription()}
            {renderMembers()}
          </View>
          {renderAdminTool()}
          {renderActions()}
          {renderPrivacy()}
        </View>
        {renderBottomSheet()}
        {/* Add for better scrolling experience */}
        <View style={{height: 24}} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const createStyles = (
  theme: ITheme,
  coverHeight: number,
  insets: EdgeInsets,
) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    root: {
      backgroundColor: colors.background,
    },
    wrapper: {},
    container: {
      backgroundColor: colors.bgSecondary,
      paddingTop: insets.top,
    },
    top: {
      backgroundColor: colors.background,
    },
    header: {
      alignItems: 'center',
      paddingVertical: spacing.padding.base,
    },
    name: {
      textAlign: 'center',
      alignItems: 'center',
      marginTop: spacing.margin.large,
    },
    iconTitleRight: {
      marginTop: spacing.margin.small,
      marginStart: spacing.margin.large,
    },
    description: {
      paddingVertical: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
    members: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing?.padding.base,
    },
    menuContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.padding.large,
    },
    menuOption: {
      marginHorizontal: spacing.margin.large,
    },
    bottomMenu: {
      marginTop: spacing.margin.small,
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.small,
      backgroundColor: colors.background,
    },
    bottomMenuTitle: {
      marginBottom: spacing.margin.tiny,
      marginLeft: spacing.margin.large,
    },
    actionItem: {
      paddingHorizontal: spacing.padding.large,
      height: 44,
    },
    bottomSheet: {
      paddingHorizontal: spacing.padding.big,
      paddingTop: spacing.padding.tiny,
    },
    buttonMuteEnable: {
      backgroundColor: colors.primary3,
    },
    cover: {
      width: '100%',
      height: coverHeight,
    },
    groupInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      ...Platform.select({
        web: {
          marginTop: spacing.margin.small,
        },
      }),
    },
    iconSmall: {
      marginRight: spacing.margin.tiny,
      height: 16,
    },
    groupHeader: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 3,
      bottom: 0,
      width: '100%',
      padding: spacing.padding.base,
    },
    groupTitle: {
      marginLeft: spacing.margin.small,
      flex: 1,
    },
    groupOptionMenu: {
      position: 'absolute',
      flexDirection: 'row',
      zIndex: 3,
      top: 0,
      width: '100%',
      padding: spacing.padding.base,
      justifyContent: 'space-between',
    },
  });
};

const ConversationDetail = React.memo(_ConversationDetail);
ConversationDetail.whyDidYouRender = true;
export default ConversationDetail;
