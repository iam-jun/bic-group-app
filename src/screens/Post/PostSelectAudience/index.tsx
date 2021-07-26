import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import SearchInput from '~/beinComponents/inputs/SearchInput';

export interface PostSelectAudienceProps {
  listSelected: any[];
  onSelectedChange: (data: any[]) => void;
}

const PostSelectAudience: React.FC<PostSelectAudienceProps> = ({
  listSelected = [],
  onSelectedChange,
  ...props
}: PostSelectAudienceProps) => {
  const [selected, setSelected] = useState(listSelected || []);

  console.log(
    '\x1b[36m',
    'namanh --- props | SelectAudience : ',
    props,
    '\x1b[0m',
  );

  const theme: ITheme = useTheme();
  const styles = createStyle(theme);

  const onPressSave = () => {
    console.log(
      '\x1b[36m',
      'namanh ---  | onPressSave : ',
      JSON.stringify(selected, undefined, 2),
      '\x1b[0m',
    );
    onSelectedChange?.(selected);
  };

  return (
    <ScreenWrapper style={styles.container}>
      <Header
        title={'post:select_audience'}
        titleTextProps={{useI18n: true}}
        buttonText={'post:save'}
        buttonProps={{useI18n: true}}
        onPressButton={onPressSave}
      />
      <SearchInput style={styles.searchInput} />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    searchInput: {
      margin: spacing?.margin.base,
    },
  });
};

export default PostSelectAudience;
