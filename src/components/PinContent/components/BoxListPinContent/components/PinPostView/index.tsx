import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import HeaderPinContentItem from '../HeaderPinContentItem';
import spacing, { borderRadius } from '~/theme/spacing';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { IPost } from '~/interfaces/IPost';
import PinPostBody from './PinPostBody';

const WidthDevice = Dimensions.get('window').width;
const MaxWidthItem = WidthDevice * 0.8;

interface PinPostViewProps {
    data: IPost;
}

const PinPostView: React.FC<PinPostViewProps> = ({
  data,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const goToDetail = () => {
    rootNavigation.navigate(homeStack.postDetail, { post_id: data?.id });
  };

  const renderContent = () => (
    <View style={styles.content}>
      <PinPostBody data={data} />
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
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.large,
    },
  });
};

export default PinPostView;
