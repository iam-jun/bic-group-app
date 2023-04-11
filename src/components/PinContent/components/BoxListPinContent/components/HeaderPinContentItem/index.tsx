import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import TimeView from '~/beinComponents/TimeView';
import SvgIcon from '~/baseComponents/Icon/SvgIcon';
import { IPost } from '~/interfaces/IPost';
import { Avatar, Button } from '~/baseComponents';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import UnPin from '../../../../../../../assets/icons/un_pin.svg';
import usePinContentItemMenu from './usePinContentItemMenu';

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

  const { createdAt, actor } = data || {};
  const { avatar, fullname } = actor || {};

  const { showMenu } = usePinContentItemMenu(data?.id, id);

  return (
    <View style={styles.container} testID="header_pin_content_item">
      <View style={styles.row}>
        <Avatar.Small isRounded source={avatar} />
        <View style={styles.boxName}>
          <ViewSpacing height={spacing.margin.xTiny} />
          <Text.SubtitleM color={colors.neutral60} numberOfLines={1}>
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
      {isAdmin && (
        <Button
          testID="header_pin_content_item.unpin_button"
          onPress={showMenu}
          style={styles.btnUnpin}
        >
          <SvgIcon
            source={UnPin}
            width={18}
            height={16}
          />
        </Button>
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
});

export default HeaderPinContentItem;
