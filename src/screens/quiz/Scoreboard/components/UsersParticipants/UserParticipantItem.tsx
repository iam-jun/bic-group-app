import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { IUserParticipant, ResultStatus } from '~/interfaces/IQuiz';
import { Avatar } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';

interface UserParticipantItemProps {
  data: IUserParticipant;
}

const UserParticipantItem: React.FC<UserParticipantItemProps> = ({ data }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const { actor, status, score } = data || {};
  const { avatar, fullname } = actor || {};
  const isPassed = status === ResultStatus.PASS;
  const stautsLabel = isPassed ? 'Pass' : 'Fail';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.userView, styles.widthName]}>
          <Avatar.Small isRounded source={avatar} />
          <ViewSpacing width={spacing.margin.tiny} />
          <Text.BodyXS color={colors.neutral40}>
            { fullname }
          </Text.BodyXS>
        </View>
        <Text.ParagraphS color={colors.neutral40} style={styles.widthPercentage}>
          { score }
          %
        </Text.ParagraphS>
        <View style={styles.widthStatus}>
          <View
            style={[
              styles.statusView,
              isPassed ? styles.pass : styles.fail,
            ]}
          >
            <Text.ButtonS
              color={isPassed ? colors.purple50 : colors.red40}
              style={styles.textStatus}
            >
              { stautsLabel }
            </Text.ButtonS>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
    },
    content: {
      paddingVertical: spacing.padding.small,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral5,
    },
    userView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusView: {
      paddingVertical: spacing.padding.xTiny,
      paddingHorizontal: spacing.padding.tiny,
      borderRadius: spacing.borderRadius.base,
      alignSelf: 'flex-start',
    },
    pass: {
      backgroundColor: colors.purple2,
    },
    fail: {
      backgroundColor: colors.red2,
    },
    textStatus: {
      fontSize: 11,
    },
    widthName: {
      width: '57%',
    },
    widthPercentage: {
      width: '28%',
    },
    widthStatus: {
      width: '15%',
    },
  });
};

export default UserParticipantItem;
