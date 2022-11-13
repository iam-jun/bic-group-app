import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import DeletedItem from '../DeletedItem';
import SeriesContent from '../SeriesContent';
import SeriesHeader from '../SeriesHeader';

type SeriesItemProps = {
    data: any;
}

const SeriesItem: FC<SeriesItemProps> = ({ data: series }) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  const { deleted = false } = series || {};

  if (deleted) {
    return <DeletedItem />;
  }

  return (
    <View style={styles.container}>
      <SeriesHeader
        series={series}
        disabled={false}
      />
      <SeriesContent series={series} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      ...elevations.e2,
    },
  });
};

export default SeriesItem;
