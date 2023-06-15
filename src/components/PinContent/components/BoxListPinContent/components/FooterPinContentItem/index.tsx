import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IReactionCounts } from '~/interfaces/IPost';
import Icon from '~/baseComponents/Icon';
import { IconType } from '~/resources/icons';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import { formatLargeNumber } from '~/utils/formatter';
import { getTotalReactions } from '~/helpers/post';

interface FooterPinContentItemProps {
    reactionsCount?: IReactionCounts;
    commentsCount?: number;
    canComment?: boolean;
    canReact?: boolean;
}

const FooterPinContentItem: React.FC<FooterPinContentItemProps> = ({
  reactionsCount,
  commentsCount,
  canComment,
  canReact,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const numberOfReactions = formatLargeNumber(getTotalReactions(reactionsCount, 'user'));
  const labelReactionCount = numberOfReactions ? `${numberOfReactions}` : '';
  const numberOfComment = formatLargeNumber(commentsCount);
  const commentCountLabel = numberOfComment ? `${numberOfComment}` : '';

  const renderItem = (
    icon: IconType,
    label: string,
    isMargin?: boolean,
    testID?: string,
  ) => (
    <View
      testID={testID}
      style={[styles.boxItem, isMargin && styles.marginRightLarge]}
    >
      <Icon
        icon={icon}
        size={18}
        tintColor={colors.neutral40}
      />
      <Text.BodyMMedium color={colors.neutral60} style={styles.labelItem}>
        { label }
      </Text.BodyMMedium>
    </View>
  );

  const renderReactItem = () => {
    if (!canReact) return null;

    return renderItem(
      'iconReact',
      labelReactionCount,
      true,
      'footer_pin_content_item.react',
    );
  };

  const renderCommnentItem = () => {
    if (!canComment) return null;

    return renderItem(
      'MessageDots',
      commentCountLabel,
      false,
      'footer_pin_content_item.comment',
    );
  };

  if (!canReact && !canComment) return null;

  return (
    <View style={styles.container} testID="footer_pin_content_item.view">
      {renderReactItem()}
      {renderCommnentItem()}
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      height: 46,
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.neutral5,
      paddingHorizontal: spacing.padding.large,
    },
    boxItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    labelItem: {
      marginLeft: spacing.margin.tiny,
    },
    marginRightLarge: {
      marginRight: spacing.margin.large,
    },
  });
};

export default FooterPinContentItem;
