import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import HeaderPinContentItem from '../HeaderPinContentItem';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import spacing, { borderRadius } from '~/theme/spacing';
import { IPost } from '~/interfaces/IPost';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';

const WidthDevice = Dimensions.get('window').width;
const MaxWidthItem = WidthDevice * 0.8;

interface PinArticleViewProps {
    data: IPost;
}

const PinArticleView: React.FC<PinArticleViewProps> = ({
  data,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const { rootNavigation } = useRootNavigation();

  const { title, summary } = data;

  const goToDetail = () => {
    rootNavigation.navigate(articleStack.articleDetail, { articleId: data?.id });
  };

  const renderContent = () => (
    <View style={styles.content}>
      <Text.SubtitleM color={colors.neutral60} numberOfLines={2}>
        { title }
      </Text.SubtitleM>
      <ViewSpacing height={spacing.margin.small} />
      <View style={styles.boxSummary}>
        <Text.ParagraphM color={colors.neutral60} numberOfLines={5}>
          { summary }
        </Text.ParagraphM>
      </View>
    </View>
  );

  return (
    <Button
      style={styles.container}
      onPress={goToDetail}
    >
      <HeaderPinContentItem data={data} />
      {renderContent()}
    </Button>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderRadius: borderRadius.large,
      borderColor: colors.purple5,
      width: MaxWidthItem,
    },
    content: {
      flex: 1,
      backgroundColor: colors.purple2,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
    boxSummary: {
      flex: 1,
    },
  });
};

export default PinArticleView;
