import i18next from 'i18next';
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Avatar from '~/beinComponents/Avatar';
import BottomSheet from '~/beinComponents/BottomSheet';
import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import Icon from '~/beinComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import {ViewSpacing} from '~/components';
import {chatPermissions, roomTypes} from '~/constants/chat';
import useChat from '~/hooks/chat';
import {useRootNavigation} from '~/hooks/navigation';
import {IObject} from '~/interfaces/common';
import {IconType} from '~/resources/icons';
import images from '~/resources/images';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import menuActions from '~/screens/Menu/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {getAvatar} from '../helper';
import actions from '../redux/actions';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import CollapsibleText from '~/beinComponents/Text/CollapsibleText';
import mainStack from '~/router/navigator/MainStack/stack';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

const Conversation = (): React.ReactElement => {
  const dispatch = useDispatch();
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {colors, spacing} = theme;
  const {conversation} = useChat();
  const {rootNavigation} = useRootNavigation();
  const isDirect = conversation.type === roomTypes.DIRECT;
  const baseSheetRef: any = useRef();
  const [_avatar, setAvatar] = useState<string | string[] | undefined>(
    conversation.avatar,
  );
  const permissions = conversation.permissions || {};

  useEffect(() => {
    dispatch(actions.getConversationDetail(conversation._id));
    dispatch(actions.clearSelectedUsers());
  }, []);

  const goGroupMembers = () => {
    rootNavigation.navigate(chatStack.chatGroupMembers);
  };

  const goAddMembers = () => {
    dispatch(actions.clearSelectedUsers());
    rootNavigation.navigate(chatStack.addMembers);
  };

  const goProfile = () => {
    if (conversation.type === roomTypes.DIRECT) {
      dispatch(
        menuActions.selectedProfile({
          id: conversation.directUser.beinUserId,
          isPublic: true,
        }),
      );
      rootNavigation.navigate(mainStack.userProfile);
    } else if (conversation.type === roomTypes.GROUP) {
      rootNavigation.navigate('groups', {
        screen: groupStack.groupDetail,
        params: {
          groupId: conversation.beinGroupId,
        },
      });
    }
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

  const onItemPress = (type: string) => {
    switch (type) {
      case 'members':
        goGroupMembers();
        break;
      case 'editName':
        showChangeNameModal();
        break;
      default:
        baseSheetRef.current?.close();
        dispatch(modalActions.showAlertNewFeature());
    }
  };

  const onLoadAvatarError = () => {
    if (conversation.type === roomTypes.DIRECT) {
      setAvatar(images.img_user_avatar_default);
    } else if (conversation.usernames) {
      const avatarGroup = conversation.usernames.map((username: string) =>
        getAvatar(username),
      );
      setAvatar(avatarGroup);
    } else setAvatar(images.img_group_avatar_default);
  };

  const renderAvatar = () => {
    return (
      <Avatar.Group
        variant="ultraLarge"
        source={_avatar}
        onError={onLoadAvatarError}
      />
    );
  };

  const renderHeader = () => {
    return (
      <TouchableOpacity onPress={goProfile}>
        <View style={styles.header}>
          {renderAvatar()}
          <Text.H5 style={styles.name} numberOfLines={2}>
            {conversation.name}
            {conversation.type !== roomTypes.QUICK && (
              <Text>
                <Icon
                  iconStyle={styles.iconTitleRight}
                  size={12}
                  icon="RightArrow"
                />
              </Text>
            )}
          </Text.H5>
        </View>
      </TouchableOpacity>
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

  // TODO: Fix marginRight, they are pushed to the left, when there is no button invite
  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <Button.Icon
        icon="search"
        style={styles.marginRight}
        tintColor={colors.primary7}
        label={i18next.t('common:text_search')}
      />
      {permissions[chatPermissions.CAN_PIN_MESSAGE] && (
        <Button.Icon
          icon="iconPinGroup"
          style={styles.marginRight}
          tintColor={colors.primary7}
          label={i18next.t('chat:label_pin_chat')}
        />
      )}
      {permissions[chatPermissions.CAN_MUTE] && (
        <Button.Icon
          icon="bell"
          style={styles.marginRight}
          tintColor={colors.primary7}
          label={i18next.t('chat:label_mute')}
        />
      )}
      {!isDirect && permissions[chatPermissions.CAN_INVITE] && (
        <Button.Icon
          icon="addUser"
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
        <PrimaryItem
          style={styles.actionItem}
          title={label}
          leftIcon={icon}
          leftIconProps={{icon, size: 20, style: styles.actionItemIcon}}
          RightComponent={RightComponent}
        />
      </TouchableOpacity>
    );
  };

  const renderActions = () => (
    <View style={styles.bottomMenu}>
      <Text style={styles.bottomMenuTitle}>
        {i18next.t('chat:title_more_actions')}
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
          'iconPinGroup',
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

  const onPressMenu =
    conversation.type === roomTypes.DIRECT
      ? undefined
      : (e: any) => {
          baseSheetRef.current?.open(e?.pageX, e?.pageY);
        };

  return (
    <ScrollView style={styles.root}>
      <ScreenWrapper
        style={styles.wrapper}
        testID="ConversationDetailScreen"
        isFullView>
        <Header onPressMenu={onPressMenu} />
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
      </ScreenWrapper>
    </ScrollView>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    root: {
      backgroundColor: colors.background,
    },
    wrapper: {},
    container: {
      backgroundColor: colors.bgSecondary,
    },
    top: {
      padding: spacing.padding.large,
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
    bottomMenu: {
      marginTop: spacing.margin.small,
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.background,
    },
    bottomMenuTitle: {
      marginBottom: spacing.margin.tiny,
    },
    actionItem: {
      paddingHorizontal: 0,
      height: 44,
    },
    actionItemIcon: {
      marginRight: spacing.margin.large,
    },
    bottomSheet: {
      paddingHorizontal: spacing.padding.big,
      paddingTop: spacing.padding.tiny,
    },
    marginBottom: {
      marginBottom: spacing.margin.large,
    },
    marginStart: {
      marginStart: spacing.margin.large,
    },
    marginRight: {
      marginRight: spacing.margin.big,
    },
  });
};

export default Conversation;
