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

const Conversation = (): React.ReactElement => {
  const dispatch = useDispatch();
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {colors, spacing} = theme;
  const {conversation} = useChat();
  const [descriptionShowAll, setDescriptionShowAll] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const {rootNavigation} = useRootNavigation();
  const isDirect = conversation.type === roomTypes.DIRECT;
  const baseSheetRef: any = useRef();
  const [_avatar, setAvatar] = useState<string | string[] | undefined>(
    conversation.avatar,
  );
  const permissions = conversation.permissions || {};

  useEffect(() => {
    dispatch(actions.getChatPermissions());
    dispatch(actions.clearSelectedUsers());

    if (conversation.description?.length > 100) {
      setShortDescription(`${conversation.description.substr(0, 100)}...`);
    }
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
          id: conversation.directUser._id,
          isPublic: true,
        }),
      );
      rootNavigation.navigate(chatStack.userProfile);
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

  const onSettingPress = (type: string) => {
    switch (type) {
      case 'members':
        goGroupMembers();
        break;
      default:
        dispatch(
          modalActions.showAlert({
            title: 'Info',
            content:
              'Function has not been developed. Stay tuned for further releases 😀',
            onConfirm: () => dispatch(modalActions.hideAlert()),
            confirmLabel: 'Got it',
          }),
        );
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
            <Text>
              <Icon
                iconStyle={styles.iconTitleRight}
                size={12}
                icon="RightArrow"
              />
            </Text>
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
      !!conversation.description && (
        <View style={styles.description}>
          <Divider />
          <ViewSpacing height={spacing.margin.large} />

          <Text.H6>{i18next.t('common:text_description')}</Text.H6>
          <ViewSpacing height={spacing.margin.base} />
          <Text>
            <Text.BodyS>
              {!descriptionShowAll && !!shortDescription
                ? shortDescription
                : conversation.description}
            </Text.BodyS>
            {!!shortDescription && (
              <Text.ButtonSmall
                onPress={() => setDescriptionShowAll(!descriptionShowAll)}
                color={colors.textInfo}>
                {` ${
                  descriptionShowAll
                    ? i18next.t('common:text_show_less')
                    : i18next.t('common:text_read_more')
                }`}
              </Text.ButtonSmall>
            )}
          </Text>
        </View>
      )
    );
  };

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

  const renderActionItem = (type: string, icon: IconType, label: string) => {
    return (
      <TouchableOpacity onPress={() => onSettingPress(type)}>
        <PrimaryItem
          style={styles.actionItem}
          title={label}
          leftIcon={icon}
          leftIconProps={{icon, size: 20, style: styles.actionItemIcon}}
          RightComponent={<Icon icon="AngleRight" size={24} />}
        />
      </TouchableOpacity>
    );
  };

  const renderActions = () => (
    <View style={styles.bottomMenu}>
      <Text>{i18next.t('chat:title_more_actions')}</Text>
      <ViewSpacing height={spacing.margin.large} />
      {renderActionItem(
        'files',
        'attachment',
        i18next.t('chat:label_attachments'),
      )}
      <ViewSpacing height={spacing.margin.large} />
      {renderActionItem('gallery', 'images', i18next.t('chat:label_gallery'))}
      {isDirect && (
        <>
          <ViewSpacing height={spacing.margin.large} />
          {renderActionItem(
            'users',
            'users',
            `${i18next.t('chat:label_create_group_chat_with')} ${
              conversation.name
            }`,
          )}
        </>
      )}
    </View>
  );

  const renderPrivacy = () => {
    return (
      <View style={styles.bottomMenu}>
        <Text>{i18next.t('chat:title_privacy')}</Text>
        <ViewSpacing height={spacing.margin.large} />
        {isDirect ? (
          <>
            {renderActionItem(
              'block',
              'ChatBlock',
              `${i18next.t('chat:text_block')} ${conversation.name}`,
            )}
          </>
        ) : (
          <>
            {renderActionItem(
              'feedback',
              'Feedback',
              i18next.t('chat:text_feedback'),
            )}
            <ViewSpacing height={spacing.margin.large} />
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
        <Text>{i18next.t('chat:title_admin_tool')}</Text>
        <ViewSpacing height={spacing.margin.large} />
        {renderActionItem(
          'pinGroup',
          'iconPinGroup',
          i18next.t('chat:label_pin_messages'),
        )}
        <ViewSpacing height={spacing.margin.large} />
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
            <Icon
              style={styles.marginBottom}
              labelStyle={styles.marginStart}
              icon="ImageV"
              size={22}
              label={i18next.t('chat:detail_menu:change_avatar')}
            />
            <Icon
              style={styles.marginBottom}
              labelStyle={styles.marginStart}
              icon="EditAlt"
              size={22}
              label={i18next.t('chat:detail_menu:edit_description')}
            />
            <Icon
              style={styles.marginBottom}
              labelStyle={styles.marginStart}
              icon="TextFields"
              size={22}
              label={i18next.t('chat:detail_menu:edit_name')}
              onPress={showChangeNameModal}
            />
          </View>
        }
      />
    );
  };

  const onPressMenu =
    conversation.type === roomTypes.DIRECT
      ? undefined
      : () => baseSheetRef.current?.open();

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
      marginTop: spacing.margin.base,
      paddingVertical: spacing?.padding.base,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.background,
    },
    actionItem: {
      paddingHorizontal: 0,
      height: 40,
    },
    actionItemIcon: {
      marginRight: spacing.margin.large,
    },
    bottomSheet: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing?.padding.base,
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
