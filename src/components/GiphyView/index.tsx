import React, { FC, useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { MasonryFlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/baseComponents';
import Image from '~/beinComponents/Image';
import { IGiphy } from '~/interfaces/IGiphy';
import useGiphyStore, { IGiphyState } from '~/store/giphy';
import { borderRadius, margin, padding } from '~/theme/spacing';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

export interface GiphyViewProps {
    searchQuery?: string;

    onSelected: (item: IGiphy) => void;
}

const GiphyView: FC<GiphyViewProps> = ({
  searchQuery,
  onSelected,
}) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const {
    data, loading, searchResults, actions,
  }: IGiphyState = useGiphyStore();

  useEffect(() => {
    actions.getTrending();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      actions.getSearch(searchQuery);
    } else actions.clearSearch();
  }, [searchQuery]);

  const onEndReached = () => {
    actions.getSearch(searchQuery);
  };

  const renderItem = ({ item }: {item: IGiphy}) => {
    const ratio = Number(item.width) / Number(item.height);

    return (
      <Button onPress={() => onSelected?.(item)}>
        <Image
          style={[styles.image, { aspectRatio: ratio }]}
          source={{ uri: item.url }}
        />
      </Button>
    );
  };

  const giphyData = searchQuery ? searchResults : data;
  const showLoading = loading && giphyData.length === 0;

  return (
    <View style={styles.container}>
      {showLoading && <LoadingIndicator />}
      <MasonryFlashList
        data={giphyData}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item): string => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
      />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingLeft: padding.tiny,
    },
    image: {
      flex: 1,
      backgroundColor: colors.neutral5,
      marginBottom: margin.tiny,
      borderRadius: borderRadius.small,
    },
  });
};
export default GiphyView;
