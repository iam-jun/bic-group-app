import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

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

const Conversation = (): React.ReactElement => {
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);
  const {colors} = theme;
  const {conversation} = useChat();
  const [descriptionShowAll, setDescriptionShowAll] = useState(false);
  const [shortDescription, setShortDescription] = useState('');

  useEffect(() => {
    if (conversation.description?.length > 100) {
      setShortDescription(`${conversation.description.substr(0, 100)}...`);
    }
  }, []);

  return (
    <ScreenWrapper testID="ConversationDetailScreen" isFullView>
      <Header title={i18next.t('chat:title_chat_detail')} />
      <View style={styles.container}>
        <View style={styles.top}>
          <Avatar.Large source={conversation.avatar} />
          <ViewSpacing width={spacing.margin.base} />
          <Text.H4 style={styles.name}>{conversation.name}</Text.H4>
        </View>
        <ViewSpacing height={spacing.margin.big} />
        {conversation.description && (
          <>
            <Text.H5>{i18next.t('common:text_description')}</Text.H5>
            <ViewSpacing height={spacing.margin.base} />
            <Text>
              <Text.BodyS>
                {descriptionShowAll
                  ? conversation.description
                  : shortDescription}
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
        )}
        <ViewSpacing height={spacing.margin.big} />
        <Icon
          icon="users"
          label={`${i18next.t('chat:title_members')} (${
            conversation?.usersCount
          })`}
        />
        <ViewSpacing height={spacing.margin.big} />
        <Divider />
        <ViewSpacing height={spacing.margin.base} />
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            <View style={styles.menuIcon}>
              <Icon size={16} tintColor={colors.primary7} icon="search" />
            </View>
            <ViewSpacing height={spacing.margin.small} />
            <Text>{i18next.t('common:text_search')}</Text>
          </View>
          <View style={styles.menu}>
            <View style={styles.menuIcon}>
              <Icon size={16} tintColor={colors.primary7} icon="addUser" />
            </View>
            <ViewSpacing height={spacing.margin.small} />
            <Text>{i18next.t('chat:label_invite')}</Text>
          </View>
          <View style={styles.menu}>
            <View style={styles.menuIcon}>
              <Icon size={16} tintColor={colors.primary7} icon="bell" />
            </View>
            <ViewSpacing height={spacing.margin.small} />
            <Text>{i18next.t('chat:label_notification')}</Text>
          </View>
          <View style={styles.menu}>
            <View style={styles.menuIcon}>
              <Icon size={16} tintColor={colors.primary7} icon="iconPinGroup" />
            </View>
            <ViewSpacing height={spacing.margin.small} />
            <Text>{i18next.t('chat:label_pin')}</Text>
          </View>
        </View>
        <ViewSpacing height={spacing.margin.big} />
        <Divider />
        <View style={styles.bottomMenu}>
          <Icon icon="attachment" label={i18next.t('chat:label_attachments')} />
          <ViewSpacing height={spacing.margin.big} />
          <Icon icon="images" label={i18next.t('chat:label_gallery')} />
          <ViewSpacing height={spacing.margin.big} />
          <Icon
            icon="leavesGroup"
            label={i18next.t('chat:label_leaves_group')}
          />
        </View>
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    name: {
      flexShrink: 1,
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
