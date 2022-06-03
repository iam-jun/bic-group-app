import React, {useRef, useState} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import {useTheme} from 'react-native-paper';
import Filter from '~/beinComponents/Filter';
import {ITheme} from '~/theme/interfaces';
import NotificationList from './NotificationList';

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    filterStyle: {
      paddingVertical: spacing.padding.small,
      borderBottomWidth: 0,
    },
  });
};

export interface Props {
  onPressItemOption: (item: any) => void;
  onItemPress: (item: any) => void;
  data?: any[];
  onChangeTab: (index: number) => void;
}

const ScrollableTabBar = ({
  onItemPress,
  data,
  onPressItemOption,
  onChangeTab,
}: Props) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const scrollViewRef = useRef<any>();
  const filterRef = useRef<any>();
  const tabDimensions: any = {};

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const _onChangeTab = (i: number) => {
    setSelectedIndex(i);
    onChangeTab(i);
    // if (tabDimensions && tabDimensions[i.toString()] && filterRef.current) {
    //   const {width, x} = tabDimensions[i.toString()];
    //   filterRef.current?.scrollTo?.({
    //     x: x - (screenWidth - width) / 2,
    //     y: 0,
    //     animated: true,
    //   });
    // }
    if (!!scrollViewRef.current) {
      scrollViewRef.current?.scrollToIndex?.({index: i || 0});
    }
  };

  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Filter
        ref={filterRef}
        testID={'notification.filter'}
        itemTestID={'notification.filter.item'}
        style={styles.filterStyle}
        data={data}
        selectedIndex={selectedIndex}
        onPress={(item: any, index: number) => {
          _onChangeTab(index);
        }}
        onLayout={(index: number, x: any, width: number) => {
          tabDimensions[index.toString()] = {x, width};
        }}
      />
      <Animated.FlatList
        ref={scrollViewRef}
        style={{flex: 1}}
        data={data}
        keyExtractor={item => item.type}
        horizontal
        bounces={false}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          {useNativeDriver: false},
        )}
        renderItem={({item}) => {
          return (
            <NotificationList
              onItemPress={onItemPress}
              type={item.type}
              onPressItemOption={onPressItemOption}
            />
          );
        }}
      />
    </View>
  );
};

export default ScrollableTabBar;
