import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useRoute, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import TimeView from '~/beinComponents/TimeView';
import { IPost } from '~/interfaces/IPost';
import { Avatar } from '~/baseComponents';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import usePinContentItemMenu from './usePinContentItemMenu';
import Icon from '~/baseComponents/Icon';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import VerifiedView from '~/components/VerifiedView';

interface HeaderPinContentItemProps {
  data: IPost;
  isAdmin: boolean;
  id: string;
}

const HeaderPinContentItem: React.FC<HeaderPinContentItemProps> = ({
  data,
  isAdmin,
  id,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const { name } = useRoute();
  const isReorderScreen = name === homeStack.reorderedPinContent;

  const { createdAt, actor } = data || {};
  const { avatar, fullname, isVerified } = actor || {};

  const { showMenu } = usePinContentItemMenu(data?.id, id);

  return (
    <View style={styles.container} testID="header_pin_content_item">
      <View style={styles.row}>
        <Avatar.Small isRounded source={avatar} />
        <View style={styles.boxName}>
          <ViewSpacing height={spacing.margin.xTiny} />
          <View style={styles.fullNameContainer}>
            <Text.SubtitleM color={colors.neutral60} numberOfLines={1} style={styles.flex1}>
              {fullname}
            </Text.SubtitleM>
            <VerifiedView size={12} isVerified={isVerified} />
          </View>
          <ViewSpacing height={spacing.margin.xSmall} />
          <TimeView
            time={createdAt}
            textProps={{ color: colors.neutral40, variant: 'bodyXS' }}
          />
          <ViewSpacing height={spacing.margin.xTiny} />
        </View>
      </View>
      {isAdmin && !isReorderScreen && (
      <Icon
        testID="header_pin_content_item.menu_button"
        icon="Ellipsis"
        onPress={showMenu}
        size={18}
        tintColor={colors.neutral40}
        hitSlop={{
          top: 20,
          bottom: 20,
          left: 20,
          right: 20,
        }}
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: spacing.padding.large,
    paddingRight: spacing.padding.base,
    paddingTop: spacing.padding.large,
    marginBottom: spacing.margin.small,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  boxName: {
    flex: 1,
    marginLeft: spacing.margin.small,
  },
  btnUnpin: {
    padding: spacing.padding.tiny,
  },
  fullNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
});

export default HeaderPinContentItem;
