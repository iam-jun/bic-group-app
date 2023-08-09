import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import CirclePercentage from '~/baseComponents/CirclePercentage';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useScoreboardStore from '../../store';

const Summary: React.FC = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const { participants } = useScoreboardStore((state) => state.summaryDetail);
  const { total, pass, fail } = participants || {};
  const percentPass = Math.round((pass || 0) / (total || 0) * 100); 
  const percentFail = Math.round((fail || 0) / (total || 0) * 100);

  const renderInnerCircle = () => (
    <View style={styles.innerView}>
      <Text.BodyXS useI18n color={colors.neutral40}>
        quiz:text_total
      </Text.BodyXS>
      <Text.H4 color={colors.neutral40}>
        { total }
      </Text.H4>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CirclePercentage
          percent={percentPass || 0}
          ringBgColor={colors.purple5}
          ringColor={colors.purple50}
          bgRingWidth={11}
          progressRingWidth={11}
          radius={50}
          renderCustomComponent={renderInnerCircle}
        />
        <View style={styles.detailView}>
          <View style={[styles.rowDetail, styles.headDetail]}>
            <Text.BodyXS useI18n color={colors.neutral40} style={styles.width40}>
              quiz:text_status
            </Text.BodyXS>
            <Text.BodyXS useI18n color={colors.neutral40} style={styles.width40}>
              quiz:text_value
            </Text.BodyXS>
            <Text.BodyXS useI18n color={colors.neutral40} style={styles.width20}>
              %
            </Text.BodyXS>
          </View>
          <ViewSpacing height={spacing.margin.small} />
          <View style={styles.rowDetail}>
            <View style={[styles.row, styles.width40]}>
              <View style={[styles.circle, styles.pass]}/>
              <Text.BodyXS useI18n color={colors.neutral40}>
                quiz:text_passed
              </Text.BodyXS>
            </View>
            <Text.BodyXS color={colors.neutral40} style={styles.width40}>
              { pass }
            </Text.BodyXS>
            <Text.BodyXS color={colors.neutral40} style={styles.width20}>
              { percentPass }%
            </Text.BodyXS>
          </View>
          <ViewSpacing height={spacing.margin.small} />
          <View style={styles.rowDetail}>
            <View style={[styles.row, styles.width40]}>
              <View style={[styles.circle, styles.fail]}/>
              <Text.BodyXS useI18n color={colors.neutral40}>
                quiz:text_failed
              </Text.BodyXS>
            </View>
            <Text.BodyXS color={colors.neutral40} style={styles.width40}>
              { fail }
            </Text.BodyXS>
            <Text.BodyXS color={colors.neutral40} style={styles.width20}>
              { percentFail }%
            </Text.BodyXS>
          </View>
        </View>
      </View>
      <View style={styles.headerList}>
        <Text.BodyXS useI18n color={colors.neutral40} style={styles.widthName}>
          quiz:text_name
        </Text.BodyXS>
        <Text.BodyXS useI18n color={colors.neutral40} style={styles.widthPercentage}>
          quiz:text_percentage
        </Text.BodyXS>
        <Text.BodyXS useI18n color={colors.neutral40} style={styles.widthStatus}>
          quiz:text_status
        </Text.BodyXS>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {},
    content: {
      flexDirection: 'row',
      paddingHorizontal: 26,
      paddingTop: 28,
      paddingBottom: 34,
    },
    innerView: {
      alignItems: 'center',
    },
    detailView: {
      flex: 1,
      paddingLeft: spacing.padding.extraLarge,
      paddingVertical: spacing.padding.small,
    },
    rowDetail: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headDetail: {
      borderBottomWidth: 1,
      borderBottomColor: colors.gray5,
      paddingBottom: spacing.padding.small
    },
    circle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: spacing.margin.tiny,
    },
    width40: {
      width: '40%',
    },
    width20: {
      width: '20%',
    },
    pass: {
      backgroundColor: colors.purple50,
    },
    fail: {
      backgroundColor: colors.purple5,
    },
    headerList: {
      backgroundColor: colors.gray1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.tiny,
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
}

export default Summary;
