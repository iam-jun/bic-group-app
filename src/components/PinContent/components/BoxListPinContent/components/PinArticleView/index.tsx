import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useRoute, useTheme } from '@react-navigation/native';
import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import HeaderPinContentItem from '../HeaderPinContentItem';
import FooterPinContentItem from '../FooterPinContentItem';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import spacing, { borderRadius } from '~/theme/spacing';
import { IPost } from '~/interfaces/IPost';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import Draggable from '~/screens/PinContent/Reordered/components/Draggable';

interface PinArticleViewProps {
  data: IPost;
  isAdmin: boolean;
  id: string;
  isActiveAnimation?: boolean;
}

const PinArticleView: React.FC<PinArticleViewProps> = ({
  data,
  isAdmin,
  id,
  isActiveAnimation,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors, elevations } = theme;
  const { rootNavigation } = useRootNavigation();

  const { name } = useRoute();
  const isReorderScreen = name === homeStack.reorderedPinContent;

  const {
    title, summary, reactionsCount, commentsCount, setting,
  } = data || {};
  const { canComment, canReact } = setting || {};

  const goToDetail = () => {
    rootNavigation.navigate(articleStack.articleContentDetail, { articleId: data?.id });
  };

  const renderContent = () => (
    <View style={styles.content}>
      <Text.SubtitleM color={colors.neutral60} numberOfLines={2}>
        { title }
      </Text.SubtitleM>
      <ViewSpacing height={spacing.margin.small} />
      <View style={styles.boxSummary}>
        <Text.ParagraphM color={colors.neutral60} numberOfLines={4}>
          { summary }
        </Text.ParagraphM>
      </View>
    </View>
  );

  const renderFooter = () => (
    <FooterPinContentItem
      reactionsCount={reactionsCount}
      commentsCount={commentsCount}
      canComment={canComment}
      canReact={canReact}
    />
  );

  return (
    <Button
      style={[styles.container, isActiveAnimation && elevations.e2]}
      onPress={goToDetail}
      disabled={isReorderScreen}
    >
      <HeaderPinContentItem data={data} isAdmin={isAdmin} id={id} />
      {renderContent()}
      {renderFooter()}
      {isReorderScreen && <Draggable />}
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
      borderColor: colors.purple50,
      flex: 1,
    },
    content: {
      flex: 1,
      backgroundColor: colors.purple2,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
      marginBottom: spacing.margin.small,
    },
    boxSummary: {
      flex: 1,
    },
  });
};

export default PinArticleView;
