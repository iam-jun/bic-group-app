import {
  GiphyContent,
  GiphyGridView,
  GiphyMedia,
  GiphyMediaView,
} from '@giphy/react-native-sdk';
import React, {useState} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import SearchInput from '../inputs/SearchInput';

interface Props {
  height?: number;
}

export default function GiphyView({height}: Props) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [media, setMedia] = useState<GiphyMedia | null>(null);

  const request = searchQuery
    ? GiphyContent.search({searchQuery: searchQuery})
    : GiphyContent.trending({mediaType: undefined});

  return (
    <SafeAreaView>
      <SearchInput
        onChangeText={setSearchQuery}
        placeholder="Search..."
        value={searchQuery}
      />
      <GiphyGridView
        content={request}
        cellPadding={3}
        style={{height: '100%', marginTop: 16}}
        onMediaSelect={e => setMedia(e.nativeEvent.media)}
      />
      {media && (
        <ScrollView
          style={{
            aspectRatio: media.aspectRatio,
            maxHeight: 400,
            padding: 24,
            width: '100%',
          }}>
          <GiphyMediaView
            media={media}
            style={{aspectRatio: media.aspectRatio}}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
