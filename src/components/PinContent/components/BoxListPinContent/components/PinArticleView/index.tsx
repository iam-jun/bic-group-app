import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import HeaderPinContentItem from '../HeaderPinContentItem';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { borderRadius } from '~/theme/spacing';
import { IPost } from '~/interfaces/IPost';

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
  const { rootNavigation } = useRootNavigation();

  const goToDetail = () => {
    rootNavigation.navigate(articleStack.articleDetail, { articleId: data?.id });
  };

  const renderContent = () => {
    // do somethings
  };

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
  });
};

export default PinArticleView;
