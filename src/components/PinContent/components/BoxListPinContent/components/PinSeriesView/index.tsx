import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useRoute, useTheme } from '@react-navigation/native';
import { useRootNavigation } from '~/hooks/navigation';
import { Button } from '~/baseComponents';
import HeaderPinContentItem from '../HeaderPinContentItem';
import spacing, { borderRadius } from '~/theme/spacing';
import seriesStack from '~/router/navigator/MainStack/stacks/series/stack';
import { IPost } from '~/interfaces/IPost';
import Image from '~/beinComponents/Image';
import Text from '~/baseComponents/Text';
import { formatDate } from '~/utils/formatter';
import { useBaseHook } from '~/hooks';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import Draggable from '~/screens/PinContent/Reordered/components/Draggable';

const IMG_SIZE = 80;
interface PinSeriesViewProps {
  data: IPost;
  isAdmin: boolean;
  id: string;
  isActiveAnimation?: boolean;
}

const PinSeriesView: React.FC<PinSeriesViewProps> = ({
  data,
  isAdmin,
  id,
  isActiveAnimation,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors, elevations } = theme;
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const { coverMedia, updatedAt, title } = data || {};

  const { name } = useRoute();
  const isReorderScreen = name === homeStack.reorderedPinContent;

  const goToDetail = () => {
    rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: data?.id });
  };

  const renderContent = () => (
    <View style={styles.content}>
      <Image resizeMode="cover" source={coverMedia?.url} style={styles.img} />
      <View style={styles.mask} />
      <View style={styles.boxTitle}>
        <Text.SubtitleM numberOfLines={2} color={colors.neutral60}>
          { title }
        </Text.SubtitleM>
        <Text.BodyS color={colors.neutral40} numberOfLines={1}>
          {`${t('common:last_updated')}: `}
          <Text.BodySMedium>{formatDate(updatedAt, 'DD/MM/YYYY')}</Text.BodySMedium>
        </Text.BodyS>
      </View>
    </View>
  );

  return (
    <Button
      style={[styles.container, isActiveAnimation && elevations.e2]}
      onPress={goToDetail}
      disabled={isReorderScreen}
    >
      <HeaderPinContentItem data={data} isAdmin={isAdmin} id={id} />
      {renderContent()}
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
      borderColor: colors.purple5,
      flex: 1,
    },
    content: {
      flexDirection: 'row',
    },
    img: {
      width: IMG_SIZE,
      height: IMG_SIZE,
    },
    mask: {
      opacity: 0.45,
      backgroundColor: colors.black,
      ...StyleSheet.absoluteFillObject,
    },
    boxTitle: {
      flex: 1,
      padding: spacing.padding.small,
      backgroundColor: colors.purple2,
      justifyContent: 'space-between',
    },
  });
};

export default PinSeriesView;
