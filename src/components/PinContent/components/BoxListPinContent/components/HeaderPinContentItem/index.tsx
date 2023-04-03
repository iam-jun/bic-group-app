import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import TimeView from '~/beinComponents/TimeView';
import { IPost } from '~/interfaces/IPost';
import { Avatar } from '~/baseComponents';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';

interface HeaderPinContentItemProps {
    data: IPost;
    isAdmin?: boolean;
}

const HeaderPinContentItem: React.FC<HeaderPinContentItemProps> = ({
  data,
//   isAdmin,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const { createdAt, actor } = data || {};
  const { avatar, fullname } = actor || {};

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar.Small isRounded source={avatar} />
        <View style={styles.boxName}>
          <ViewSpacing height={spacing.margin.xTiny} />
          <Text.SubtitleM color={colors.neutral60}>
            { fullname }
          </Text.SubtitleM>
          <ViewSpacing height={spacing.margin.xSmall} />
          <TimeView
            time={createdAt}
            textProps={{ color: colors.neutral40, variant: 'bodyXS' }}
          />
          <ViewSpacing height={spacing.margin.xTiny} />
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.padding.large,
    paddingTop: spacing.padding.large,
    marginBottom: spacing.margin.small,
  },
  row: {
    flexDirection: 'row',
  },
  boxName: {
    marginLeft: spacing.margin.small,
  },
});

export default HeaderPinContentItem;
