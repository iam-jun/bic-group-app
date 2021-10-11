import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import appActions from '~/store/app/actions';
import {scaleSize} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {getUrlFromText} from '~/utils/common';

interface Props {
  text?: string;
}

const LinkPreviewer = ({text}: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const [link, setLink] = useState<string | null | undefined>('');
  const linkPreviews = useKeySelector(`app.linkPreviews`);

  useEffect(() => {
    const url = getUrlFromText(text);
    setLink(url);
  }, [text]);

  useEffect(() => {
    if (link && !linkPreviews?.[link]) {
      console.log('link', link);

      dispatch(appActions.getLinkPreview(link));
    }
  }, [link]);

  if (!link || !linkPreviews?.[link]) return null;

  return (
    <View style={styles.container}>
      <Image style={styles.thumbnail} source={linkPreviews?.[link].thumbnail} />
      <View style={styles.metadata}>
        <Text.ButtonBase style={styles.title}>
          {linkPreviews?.[link].title}
        </Text.ButtonBase>
        <Text.Subtitle>{linkPreviews?.[link].description}</Text.Subtitle>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      marginTop: spacing.margin.small,
      borderRadius: spacing.borderRadius.small,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderDivider,
      overflow: 'hidden',
    },
    thumbnail: {
      width: Platform.OS === 'web' ? 300 : scaleSize(307),
      height: Platform.OS === 'web' ? 200 : scaleSize(225.5),
    },
    metadata: {
      paddingHorizontal: spacing.padding.small,
      paddingBottom: spacing.padding.large,
    },
    title: {
      marginBottom: spacing.margin.small,
      marginTop: spacing.margin.extraLarge,
    },
  });
};

export default LinkPreviewer;
