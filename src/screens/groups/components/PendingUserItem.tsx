import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Avatar from '~/baseComponents/Avatar';
import Icon from '~/baseComponents/Icon';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import { IconType } from '~/resources/icons';

import { formatFullTime } from '~/beinComponents/TimeView/helper';
import { AppContext } from '~/contexts/AppContext';
import { IJoiningMember } from '~/interfaces/IGroup';
import { useBaseHook } from '~/hooks';
import Divider from '~/beinComponents/Divider';
import spacing from '~/theme/spacing';

interface PendingUserItemProps {
  requestItem: IJoiningMember;
  onPressApprove: () => void;
  onPressDecline: () => void;
}

const PendingUserItem = ({
  requestItem,
  onPressApprove,
  onPressDecline,
}: PendingUserItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const { language } = useContext(AppContext);

  const { user, updatedAt, isCanceled } = requestItem || {};
  const {
    avatar, fullname, email, countryCode, phone, latestWork, city,
  } = user || {};

  const renderItem = ({
    icon,
    title,
    TitleComponent,
  }: {
    icon: IconType;
    title?: string | null;
    TitleComponent?: React.ReactNode;
  }) => (
    (!!title || !!TitleComponent) && (
      <View style={styles.itemComponent}>
        <Icon icon={icon} tintColor={theme.colors.purple50} size={24} />
        <Text.BodyM style={styles.text}>{title}</Text.BodyM>
        {TitleComponent}
      </View>
    )
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Medium source={avatar} isRounded />

        <View style={styles.textHeader}>
          <Text.ButtonM>{fullname}</Text.ButtonM>
          <Text.BodyM color={theme.colors.gray50}>
            {`${t('groups:text_requested_at')} ${formatFullTime(
              updatedAt,
              language,
            )}`}
          </Text.BodyM>

          <Divider style={{ marginVertical: 8 }} />

          {renderItem({
            icon: 'iconSuitcase',
            title:
              latestWork
              && `${latestWork?.titlePosition} ${t('common:text_at')} ${
                latestWork?.company
              }`,
          })}
          {renderItem({
            icon: 'LocationDot',
            title: city,
          })}
          {renderItem({ icon: 'Envelope', title: email })}
          {renderItem({
            icon: 'Phone',
            title:
              countryCode && phone ? `(+${countryCode}) ${phone}` : undefined,
          })}
        </View>
      </View>

      {isCanceled ? (
        <View style={styles.hintMessage}>
          <Icon style={{ marginRight: 4 }} icon="CircleInfo" size={18} />
          <Text.BodyS useI18n>groups:text_request_been_canceled</Text.BodyS>
        </View>
      ) : (
        <View style={styles.buttons}>
          <Button.Secondary
            testID="pending_user_item.btn_decline"
            style={styles.buttonDecline}
            color={theme.colors.gray10}
            textColor={theme.colors.neutral80}
            onPress={onPressDecline}
            useI18n
          >
            common:btn_decline
          </Button.Secondary>
          <Button.Secondary
            highEmphasis
            testID="pending_user_item.btn_approve"
            style={styles.buttonApprove}
            color={theme.colors.purple50}
            onPress={onPressApprove}
            useI18n
          >
            common:btn_approve
          </Button.Secondary>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.margin.tiny,
  },
  header: {
    flexDirection: 'row',
  },
  textHeader: {
    marginLeft: spacing.margin.base,
    justifyContent: 'center',
    flex: 1,
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
  hintMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.margin.tiny,
  },
});

export default PendingUserItem;
