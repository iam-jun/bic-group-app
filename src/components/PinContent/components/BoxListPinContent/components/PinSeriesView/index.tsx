import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
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

const WidthDevice = Dimensions.get('window').width;
const MaxWidthItem = WidthDevice * 0.8;
const IMG_SIZE = 80;

interface PinSeriesViewProps {
  data: IPost;
  isAdmin: boolean;
  id: string;
}

const PinSeriesView: React.FC<PinSeriesViewProps> = ({
  data,
  isAdmin,
  id,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

  const { coverMedia, updatedAt, title } = data || {};

  const goToDetail = () => {
    rootNavigation.navigate(seriesStack.seriesDetail, { seriesId: data?.id });
  };

  const renderContent = () => (
    <View style={styles.content}>
      <Image resizeMode="cover" source={coverMedia?.url} style={styles.img} />
      <View style={styles.boxTitle}>
        <Text.SubtitleM numberOfLines={2} color={colors.neutral60}>
          { title }
        </Text.SubtitleM>
        <Text.BodyS color={colors.neutral40}>
          {`${t('common:last_updated')}: `}
          <Text.BodySMedium>{formatDate(updatedAt, 'DD/MM/YYYY')}</Text.BodySMedium>
        </Text.BodyS>
      </View>
    </View>
  );

  return (
    <Button
      style={styles.container}
      onPress={goToDetail}
    >
      <HeaderPinContentItem data={data} isAdmin={isAdmin} id={id} />
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
      flexDirection: 'row',
    },
    img: {
      width: IMG_SIZE,
      height: IMG_SIZE,
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
