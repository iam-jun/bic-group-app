import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { IReactionCounts } from '~/interfaces/IPost';
import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
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
    const labelReactionCount = numberOfReactions ? ` ${numberOfReactions}` : '';
    const numberOfComment = formatLargeNumber(commentsCount);
    const commentCountLabel = numberOfComment ? ` ${numberOfComment}` : '';

    const renderReactLabel = () => {
        if (!canReact) return null;

        return (
            <View style={styles.boxItem}>
                <Icon 
                    icon={'iconReact'}
                    size={18}
                    tintColor={colors.neutral40}
                />
                <Text.BodyMMedium color={colors.neutral60}>
                    { labelReactionCount }
                </Text.BodyMMedium>
            </View>
        );
    }

    const renderCommnentLabel = () => {
        if (!canComment) return null;

        return (
            <View style={styles.boxItem}>
                <Icon 
                    icon={'MessageDots'}
                    size={18}
                    tintColor={colors.neutral40}
                />
                <Text.BodyMMedium color={colors.neutral60}>
                    { commentCountLabel }
                </Text.BodyMMedium>
            </View>
        );
    }

    if (!canReact && !canComment) return null;

    return (
        <View style={styles.container} testID='footer_pin_content_item.view'>
            {renderReactLabel()}
            <ViewSpacing width={spacing.margin.large} />
            {renderCommnentLabel()}
        </View>
    );
};

const createStyles = (theme: ExtendedTheme) => {
    const { colors } = theme;

    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: colors.neutral5,
            // paddingVertical: spacing.padding.base,
            paddingHorizontal: spacing.padding.large,
            height: 46,
        },
        boxItem: {
            flexDirection: 'row',
            alignItems: 'center',
            // paddingVertical: spacing.padding.xTiny,
        },
    });
}

export default FooterPinContentItem;
