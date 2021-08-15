import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import useChat from '~/hooks/chat';
import {IObject} from '~/interfaces/common';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import i18next from 'i18next';
import Icon from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import Text from '~/beinComponents/Text';
import {ViewSpacing} from '~/components';
import Divider from '~/beinComponents/Divider';
import Button from '~/beinComponents/Button';
import {useRootNavigation} from '~/hooks/navigation';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import actions from '../redux/actions';
import images from '~/resources/images';
import {roomTypes} from '~/constants/chat';
import {ScrollView} from 'react-native';
import {IconType} from '~/resources/icons';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';

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

  useEffect(() => {
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
    rootNavigation.navigate('menus', {screen: menuStack.userProfile});
  };

  const renderAvatar = () => {
    if (isDirect) {
      return (
        <Avatar.UltraLarge
          source={conversation.avatar}
          placeholderSource={images.img_user_avatar_default}
        />
      );
    }
    return (
      <Avatar.Group
        variant="ultraLarge"
        source={conversation.avatar}
        placeholderSource={images.img_group_avatar_default}
      />
    );
  };

  const renderHeader = () => {
    return (
      <TouchableOpacity onPress={goProfile}>
        <View style={styles.header}>
          {renderAvatar()}
          <Text.H5 style={styles.name}>
            {conversation.name}
            <Icon
              iconStyle={styles.iconTitleRight}
              size={22}
              icon="AngleRight"
            />
          </Text.H5>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMembers = () =>
    !isDirect && (
      <View style={styles.members}>
        <Icon
          icon="users"
          label={`${i18next.t('chat:title_members')} (${
            conversation?.usersCount
          })`}
          onPress={goGroupMembers}
        />
        <Icon icon="AngleRight" />
      </View>
    );

  const renderDescription = () => {
    return (
      !!conversation.description && (
        <View style={styles.description}>
          <Divider />
          <ViewSpacing height={spacing.margin.large} />

          <Text.H5>{i18next.t('common:text_description')}</Text.H5>
          <ViewSpacing height={spacing.margin.base} />
          <Text>
            <Text.BodyS>
              {descriptionShowAll ? conversation.description : shortDescription}
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
        tintColor={colors.primary7}
        label={i18next.t('common:text_search')}
      />
      <Button.Icon
        icon="iconPinGroup"
        tintColor={colors.primary7}
        label={i18next.t('chat:label_pin_chat')}
      />
      <Button.Icon
        icon="bell"
        tintColor={colors.primary7}
        label={i18next.t('chat:label_mute')}
      />
      {!isDirect && (
        <Button.Icon
          icon="addUser"
          tintColor={colors.primary7}
          label={i18next.t('chat:label_invite')}
          onPress={goAddMembers}
        />
      )}
    </View>
  );

  const renderActionItem = (icon: IconType, label: string) => {
    return (
      <View style={styles.actionItem}>
        <Icon icon={icon} label={label} />
        <Icon icon="AngleRight" size={22} />
      </View>
    );
  };

  const renderActions = () => (
    <View style={styles.bottomMenu}>
      <Text>{i18next.t('chat:title_more_actions')}</Text>
      <ViewSpacing height={spacing.margin.large} />
      {renderActionItem('attachment', i18next.t('chat:label_attachments'))}
      <ViewSpacing height={spacing.margin.large} />
      {renderActionItem('images', i18next.t('chat:label_gallery'))}
      {isDirect && (
        <>
          <ViewSpacing height={spacing.margin.large} />
          {renderActionItem(
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
              'images',
              `${i18next.t('chat:text_block')} ${conversation.name}`,
            )}
          </>
        ) : (
          <>
            {renderActionItem('Feedback', i18next.t('chat:text_feedback'))}
            <ViewSpacing height={spacing.margin.large} />
            {renderActionItem(
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
          'iconPinGroup',
          i18next.t('chat:label_pin_messagess'),
        )}
        <ViewSpacing height={spacing.margin.large} />
        {renderActionItem(
          'ChatPermission',
          i18next.t('chat:label_permisstion_management'),
        )}
      </View>
    );
  };

  return (
    <ScrollView>
      <ScreenWrapper
        style={styles.wrapper}
        testID="ConversationDetailScreen"
        isFullView>
        <Header />
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
      </ScreenWrapper>
    </ScrollView>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
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
      marginTop: spacing.margin.large,
      textAlign: 'center',
    },
    iconTitleRight: {
      marginTop: spacing.margin.base,
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
      justifyContent: 'space-around',
      paddingVertical: spacing.padding.large,
    },
    menu: {
      alignItems: 'center',
    },
    menuIcon: {
      backgroundColor: colors.primary1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing?.borderRadius.small,
      marginLeft: spacing?.padding.small,
      width: 36,
      height: 36,
    },
    bottomMenu: {
      marginTop: spacing.margin.base,
      paddingVertical: spacing?.padding.base,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.background,
    },
    actionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
};

export default Conversation;
