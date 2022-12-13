import React, { FC } from 'react';
import { NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { GiphyContent, GiphyGridView, GiphyMedia } from '@giphy/react-native-sdk';
import { IGiphy } from '~/interfaces/IGiphy';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';
import { margin } from '~/theme/spacing';

export interface GiphyViewProps {
    searchQuery?: string;

    onSelected: (item: IGiphy) => void;
}

const GiphyView: FC<GiphyViewProps> = ({
  searchQuery,
  onSelected,
}) => {
  const [loading, setLoading] = React.useState(true);

  const request = searchQuery
    ? GiphyContent.search({ searchQuery })
    : GiphyContent.trending({ mediaType: undefined });

  const onMediaSelect = (e: NativeSyntheticEvent<{
    media: GiphyMedia;
  }>) => {
    onSelected({
      id: e?.nativeEvent?.media?.id,
      url: e?.nativeEvent?.media?.url,
    });
  };

  // When content is updated, it means request has been done
  const onContentUpdate = () => {
    setLoading(false);
  };

  return (
    <View>
      {loading && <LoadingIndicator style={styles.loading} />}
      <GiphyGridView
        testID="sticker_view.grid_view"
        content={request}
        cellPadding={4}
        // Must render GiphyGridView to trigger onContentUpdate but make it invisible
        style={[styles.gridView, loading && { height: 0 }]}
        onContentUpdate={onContentUpdate}
        onMediaSelect={onMediaSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gridView: {
    height: '100%',
  },
  loading: {
    marginTop: margin.base,
  },
});
export default GiphyView;
