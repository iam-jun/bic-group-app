import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import spacing, { borderRadius } from '~/theme/spacing';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useBaseHook } from '~/hooks';
import { formatDate } from '~/utils/formatData';

type TitleSectionProps = {
  title: string;
  time: string;
  numberOfArticles: number;
  img: string;
};

type ThumbnailProps = {
  numberOfArticles: number;
  img: string;
};

type TitleProps = {
  title: string;
  time: string;
};

const Thumbnail: FC<ThumbnailProps> = ({ numberOfArticles, img }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  return (
    <View>
      <Image resizeMode="cover" source={img} style={styles.img} />
      <View style={[styles.mask, styles.centerView]}>
        <Text.H1 style={styles.textThumbnail} color={colors.white}>
          {numberOfArticles}
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
  const styles = createStyle(theme);

  return (
    <View style={styles.titleContainer}>
      <Text.H4 numberOfLines={2}>{title}</Text.H4>
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
  numberOfArticles,
  img,
}) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <Thumbnail numberOfArticles={numberOfArticles} img={img} />
      <Title title={title} time={time} />
    </View>
  );
};

const IMG_SIZE = 80;

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.purple2,
      borderRadius: borderRadius.large,
    },
    img: {
      borderRadius: borderRadius.large,
      height: IMG_SIZE,
      width: IMG_SIZE,
    },
    mask: {
      borderRadius: borderRadius.large,
      opacity: 0.65,
      backgroundColor: colors.black,
      ...StyleSheet.absoluteFillObject,
    },
    centerView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleContainer: {
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
