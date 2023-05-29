import React from 'react';
import {
  View, Dimensions, FlatList, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Avatar from '~/baseComponents/Avatar';
import Icon from '~/baseComponents/Icon';
import spacing, { borderRadius } from '~/theme/spacing';

const Grid = ({ data }: {data: any[]}) => {
  const deviceWidth = Dimensions.get('window').width;

  const itemWidth = 48; // Constant item width
  const numColumns = Math.floor((deviceWidth - 10 * 2) / (itemWidth + 6 * 2));
  const rowWidth = numColumns * (itemWidth + 6 * 2);
  const paddingLeft = (deviceWidth - (10 * 2) - rowWidth) / 2;

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  const isSelected = false;

  const renderGridItem = ({ item, index }: any) =>
    // Render each grid item here
    (
      <View
        key={index}
        style={{
          margin: 6,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? colors.purple50 : colors.neutral5,
          borderRadius: borderRadius.pill,
        }}
      >
        <Avatar.Medium
          isRounded
          source={{ uri: item?.iconUrl }}
        />
        {isSelected
          ? (
            <View style={styles.iconChose}>
              <Icon size={10} icon="Check" tintColor={colors.white} />
            </View>
          )
          : null}
      </View>
    );

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingBottom: 10,
    }}
    >

      <View style={{
        // paddingLeft,
      }}
      >
        <FlatList
          data={data}
          renderItem={renderGridItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
        />
      </View>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: spacing.padding.large,
    },
    iconChose: {
      backgroundColor: colors.purple50,
      borderRadius: borderRadius.pill,
      height: 20,
      width: 20,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      zIndex: 1,
      right: 0,
    },
  });
};

export default Grid;
