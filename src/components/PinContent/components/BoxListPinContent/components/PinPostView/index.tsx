import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useRoute, useTheme } from '@react-navigation/native';
import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import HeaderPinContentItem from '../HeaderPinContentItem';
import FooterPinContentItem from '../FooterPinContentItem';
import { borderRadius } from '~/theme/spacing';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { IPost } from '~/interfaces/IPost';
import PinPostBody from './PinPostBody';
import Draggable from '~/screens/PinContent/Reordered/components/Draggable';

interface PinPostViewProps {
  data: IPost;
  isAdmin: boolean;
  id: string;
  isActiveAnimation?: boolean;
}

const PinPostView: React.FC<PinPostViewProps> = ({
  data,
  isAdmin,
  id,
  isActiveAnimation,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { elevations } = theme;
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const { name } = useRoute();
  const isReorderScreen = name === homeStack.reorderedPinContent;

  const { setting, reactionsCount, commentsCount } = data || {};
  const { canComment, canReact } = setting || {};

  const goToDetail = () => {
    rootNavigation.navigate(homeStack.postDetail, { post_id: data?.id });
  };

  const renderContent = () => (
    <View style={styles.content}>
      <PinPostBody data={data} />
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
      overflow: 'hidden',
    },
  });
};

export default PinPostView;
