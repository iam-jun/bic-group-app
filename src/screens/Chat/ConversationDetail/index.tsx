import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import useChat from '~/hooks/chat';
import {IObject} from '~/interfaces/common';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import {spacing} from '~/theme';
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

const Conversation = (): React.ReactElement => {
  const dispatch = useDispatch();
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {colors} = theme;
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

  const renderMembers = () =>
    !isDirect && (
      <>
        <Icon
          icon="users"
          label={`${i18next.t('chat:title_members')} (${
            conversation?.usersCount
          })`}
          onPress={goGroupMembers}
        />
        <ViewSpacing height={spacing.margin.big} />
        <Divider />
      </>
    );

  const renderDescription = () => {
    conversation.description && (
      <>
        <Text.H5>{i18next.t('common:text_description')}</Text.H5>
        <ViewSpacing height={spacing.margin.base} />
        <Text>
          <Text.BodyS>
            {descriptionShowAll ? conversation.description : shortDescription}
          </Text.BodyS>
          {shortDescription && (
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
      </>
    );
  };

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <Button.Icon
        icon="search"
        tintColor={colors.primary7}
        label={i18next.t('common:text_search')}
      />
      {!isDirect && (
        <Button.Icon
          icon="addUser"
          tintColor={colors.primary7}
          label={i18next.t('chat:label_invite')}
          onPress={goAddMembers}
        />
      )}
      <Button.Icon
        icon="iconPinGroup"
        tintColor={colors.primary7}
        label={i18next.t('chat:label_pin')}
      />
      <Button.Icon
        icon="bell"
        tintColor={colors.primary7}
        label={i18next.t('chat:label_mute')}
      />
    </View>
  );

  const renderActions = () => (
    <View style={styles.bottomMenu}>
      <Icon icon="attachment" label={i18next.t('chat:label_attachments')} />
      <ViewSpacing height={spacing.margin.big} />
      <Icon icon="images" label={i18next.t('chat:label_gallery')} />
      <ViewSpacing height={spacing.margin.big} />
      {!isDirect && (
        <Icon icon="leavesGroup" label={i18next.t('chat:label_leaves_group')} />
      )}
      {isDirect && (
        <Icon
          icon="leavesGroup"
          label={`${i18next.t('chat:label_create_group_chat_with')} ${
            conversation.name
          }`}
        />
      )}
    </View>
  );

  return (
    <ScreenWrapper testID="ConversationDetailScreen" isFullView>
      <Header title={i18next.t('chat:title_chat_detail')} />
      <View style={styles.container}>
        <View style={styles.top}>
          {renderAvatar()}
          <Text.H4 style={styles.name}>{conversation.name}</Text.H4>
        </View>
        <ViewSpacing height={spacing.margin.big} />
        {renderDescription()}
        <ViewSpacing height={spacing.margin.big} />
        {renderMembers()}
        <ViewSpacing height={spacing.margin.base} />
        {renderMenu()}
        <ViewSpacing height={spacing.margin.big} />
        <Divider />
        {renderActions()}
      </View>
    </ScreenWrapper>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      padding: spacing.margin.base,
    },
    top: {
      alignItems: 'center',
    },
    name: {
      flexShrink: 1,
      marginTop: spacing.margin.base,
    },
    menuContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
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
      marginVertical: spacing.margin.big,
    },
  });
};

export default Conversation;
