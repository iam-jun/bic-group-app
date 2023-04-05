import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Avatar from '~/baseComponents/Avatar';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import { IconType } from '~/resources/icons';

import { formatFullTime } from '~/beinComponents/TimeView/helper';
import { AppContext } from '~/contexts/AppContext';
import { IJoiningMember } from '~/interfaces/IGroup';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import { Button } from '~/baseComponents';
import { MembershipAnswer } from '~/interfaces/ICommunity';

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
  const { colors } = theme;
  const styles = createStyles(theme);
  const { t } = useBaseHook();
  const { language } = useContext(AppContext);

  const {
    user, updatedAt, noticeMessage, membershipAnswers = [],
  } = requestItem || {};
  const {
    avatar, fullname, latestWork, city,
  } = user || {};
  const { titlePosition, company } = latestWork || {};

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
        <Icon icon={icon} tintColor={colors.neutral20} size={18} />
        {!!title && <Text.BodyM color={colors.neutral40} style={styles.text}>{title}</Text.BodyM>}
        {TitleComponent}
      </View>
    )
  );

  const renderAnswers = () => {
    if (membershipAnswers.length > 0) {
      return membershipAnswers.map((item: MembershipAnswer, index: number) => {
        const { question, answer, isRequired } = item;
        return (
          <View
            key={`membership_answer_${question}_${index}`}
            style={styles.answerItemContainer}
          >
            <Text.BodyMMedium>
              {question}
              {!!isRequired
              && (
              <Text.BodyMMedium style={styles.questionRequired}>
                {' *'}
              </Text.BodyMMedium>
              )}
            </Text.BodyMMedium>
            {typeof answer === 'string'
              ? (
                <Text.BodyM>
                  {answer}
                </Text.BodyM>
              )
              : (
                <Text.BodyM useI18n style={styles.noAnswer}>
                  groups:text_no_answer
                </Text.BodyM>
              )}
          </View>
        );
      });
    }
    return null;
  };

  const renderFooter = () => {
    if (!noticeMessage) {
      return (
        <View style={styles.buttons}>
          <Button.Neutral
            testID="pending_user_item.btn_decline"
            type="ghost"
            size="medium"
            style={styles.buttonDecline}
            onPress={onPressDecline}
            useI18n
          >
            common:btn_decline
          </Button.Neutral>
          <Button.Primary
            testID="pending_user_item.btn_approve"
            type="ghost"
            size="medium"
            style={styles.buttonApprove}
            onPress={onPressApprove}
            useI18n
          >
            common:btn_approve
          </Button.Primary>
        </View>
      );
    }

    return (
      <View style={styles.hintMessage}>
        <Icon style={styles.marginRight} icon="CircleInfo" size={16} tintColor={colors.neutral20} />
        <Text.BodyS color={colors.neutral40}>{noticeMessage}</Text.BodyS>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Medium source={avatar} isRounded />

        <View style={styles.textHeader}>
          <Text.H5>{fullname}</Text.H5>
          <View style={{ marginVertical: 2 }} />
          <Text.BodyS color={colors.neutral40}>
            {`${t('groups:text_requested_at')} ${formatFullTime(
              updatedAt,
              language,
            )}`}
          </Text.BodyS>

          <View style={{ marginVertical: spacing.margin.xSmall }} />

          {renderItem({
            icon: 'Briefcase',
            TitleComponent: titlePosition && company && (
              <Text.BodyM
                color={colors.neutral40}
                style={styles.text}
              >
                {`${titlePosition} ${t('common:text_at')}`}
                <Text.BodyMMedium color={colors.neutral70}>{` ${company}`}</Text.BodyMMedium>
              </Text.BodyM>
            ),
          })}
          {renderItem({
            icon: 'LocationDot',
            title: city,
          })}
        </View>
      </View>
      {renderAnswers()}
      {renderFooter()}
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;

  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.white,
      ...elevations.e2,
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
      marginLeft: spacing.margin.base,
    },
    buttons: {
      flexDirection: 'row',
      marginTop: spacing.margin.small,
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
    marginRight: {
      marginRight: spacing.margin.tiny,
    },
    answerItemContainer: { marginTop: spacing.margin.small },
    questionRequired: { color: colors.red40 },
    noAnswer: { fontStyle: 'italic', color: colors.neutral20 },
  });
};

export default PendingUserItem;
