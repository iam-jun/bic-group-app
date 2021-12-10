import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import i18next from 'i18next';
import {useDispatch} from 'react-redux';

import Avatar from '~/beinComponents/Avatar';
import Icon from '~/beinComponents/Icon';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import {IconType} from '~/resources/icons';
import {ITheme} from '~/theme/interfaces';
import {formatFullTime} from '~/beinComponents/TimeView';
import {AppContext} from '~/contexts/AppContext';
import groupsActions from '~/screens/Groups/redux/actions';
import {useKeySelector} from '~/hooks/selector';
import {clearToastMessage} from '~/store/modal/actions';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

const PendingUserItem = ({requestId}: {requestId: number}) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {language} = useContext(AppContext);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const currentRequestMember = useKeySelector(
    `groups.pendingMemberRequests.items.${requestId}`,
  );

  const {
    user,
    group_id: groupId,
    created_at: createdAt,
  } = currentRequestMember || {};
  const {
    avatar,
    fullname: fullName,
    email,
    country_code: countryCode,
    phone,
    latest_work: latestWork,
  } = user;

  const navigateToGroupMembers = () => {
    dispatch(clearToastMessage());
    rootNavigation.navigate(groupStack.groupMembers, {groupId});
  };

  const onPressApprove = () => {
    dispatch(
      groupsActions.approveSingleMemberRequest({
        groupId,
        requestId,
        fullName,
        callback: navigateToGroupMembers,
      }),
    );
  };

  const onPressDecline = () => {
    dispatch(
      groupsActions.declineSingleMemberRequest({groupId, requestId, fullName}),
    );
  };

  const renderItem = ({
    icon,
    title,
    TitleComponent,
  }: {
    icon: IconType;
    title?: string;
    TitleComponent?: React.ReactNode;
  }) => {
    return (
      (!!title || !!TitleComponent) && (
        <View style={styles.itemComponent}>
          <Icon icon={icon} tintColor={theme.colors.primary5} size={24} />
          <Text.Body style={styles.text} useI18n>
            {title}
          </Text.Body>
          {TitleComponent}
        </View>
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Large source={avatar} />
        <View style={styles.textHeader}>
          <Text.ButtonBase>{fullName}</Text.ButtonBase>
          <Text.Body color={theme.colors.textSecondary}>
            {`${i18next.t('groups:text_requested_at')} ${formatFullTime(
              createdAt,
              language,
            )}`}
          </Text.Body>
        </View>
      </View>

      <View style={styles.aboutProfile}>
        {renderItem({
          icon: 'iconSuitcase',
          title:
            latestWork &&
            `${latestWork?.title_position} ${i18next.t('common:text_at')} ${
              latestWork?.company
            }`,
        })}
        {renderItem({icon: 'Envelope', title: email})}
        {renderItem({
          icon: 'Phone',
          title:
            countryCode && phone ? `(+${countryCode}) ${phone}` : undefined,
        })}
      </View>

      <View style={styles.buttons}>
        <Button.Secondary
          style={styles.buttonDecline}
          onPress={onPressDecline}
          useI18n>
          common:btn_decline
        </Button.Secondary>
        <Button.Secondary
          highEmphasis
          style={styles.buttonApprove}
          color={theme.colors.primary6}
          onPress={onPressApprove}
          useI18n>
          common:btn_approve
        </Button.Secondary>
      </View>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      marginVertical: spacing.margin.tiny,
    },
    header: {
      flexDirection: 'row',
    },
    textHeader: {
      marginLeft: spacing.margin.base,
      justifyContent: 'center',
    },
    itemComponent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.small,
      marginRight: spacing.margin.base,
    },
    text: {
      marginLeft: spacing.margin.large,
    },
    aboutProfile: {
      marginTop: spacing.margin.large,
    },
    buttons: {
      flexDirection: 'row',
      marginVertical: spacing.margin.small,
    },
    buttonDecline: {
      flex: 1,
      marginRight: spacing.margin.small,
    },
    buttonApprove: {
      flex: 1,
    },
  });
};

export default PendingUserItem;
