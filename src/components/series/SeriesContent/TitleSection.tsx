import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import spacing, { borderRadius } from '~/theme/spacing';
import Image from '~/components/Image';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useBaseHook } from '~/hooks';
import { formatDate } from '~/utils/formatter';
import { getTextHighlight } from '~/components/articles/ArticleText/helper';

type TitleSectionProps = {
  title: string;
  time: string;
  numberOfItems: number;
  img: string;
};

type ThumbnailProps = {
  numberOfItems: number;
  img: string;
};

type TitleProps = {
  title: string;
  time: string;
};

const Thumbnail: FC<ThumbnailProps> = ({ numberOfItems, img }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  return (
    <View>
      <Image resizeMode="cover" source={img} style={styles.img} />
      <View style={styles.mask} />
      <View style={styles.centerView}>
        <Text.H1 style={styles.textThumbnail} color={colors.white}>
          {numberOfItems}
        </Text.H1>
        <Text.H1 style={styles.textThumbnail} color={colors.white} useI18n>
          common:articles
        </Text.H1>
      </View>
    </View>
  );
};

const Title: FC<TitleProps> = ({ title, time }) => {
  const { t } = useBaseHook();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const lstText = getTextHighlight(title);

  return (
    <View style={styles.titleContainer}>
      <Text.H4 numberOfLines={2}>
        {lstText.map((item) => (
          <Text.H4
            key={`${item.id}`}
            style={{ backgroundColor: item.isHighlight && colors.highlight }}
          >
            {item.text}
          </Text.H4>
        ))}
      </Text.H4>
      <ViewSpacing height={spacing.margin.small} />
      <Text.BodyS>
        {`${t('common:last_updated')}: `}
        <Text.BodySMedium>{formatDate(time, 'DD/MM/YYYY')}</Text.BodySMedium>
      </Text.BodyS>
    </View>
  );
};

const TitleSection: FC<TitleSectionProps> = ({
  title,
  time,
  numberOfItems,
  img,
}) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Thumbnail numberOfItems={numberOfItems} img={img} />
      <Title title={title} time={time} />
    </View>
  );
};

export const THUMBNAIL_SERIES_SIZE = 90;

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.purple2,
      borderRadius: borderRadius.large,
      height: THUMBNAIL_SERIES_SIZE,
    },
    img: {
      borderRadius: borderRadius.large,
      height: THUMBNAIL_SERIES_SIZE,
      width: THUMBNAIL_SERIES_SIZE,
    },
    mask: {
      borderRadius: borderRadius.large,
      opacity: 0.45,
      backgroundColor: colors.black,
      ...StyleSheet.absoluteFillObject,
    },
    centerView: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleContainer: {
      flex: 1,
      marginHorizontal: spacing.margin.small,
      marginVertical: spacing.margin.small,
      justifyContent: 'space-between',
    },
    textThumbnail: {
      fontSize: 18,
    },
  });
};

export default TitleSection;
