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
import {getUrlFromText, openLink} from '~/utils/common';
import ButtonWrapper from './Button/ButtonWrapper';

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
      dispatch(appActions.getLinkPreview(link));
    }
  }, [link]);

  // link preview must have title at least
  if (!link || !linkPreviews?.[link]?.title) return null;

  const onPress = () => {
    openLink(link);
  };

  return (
    <ButtonWrapper contentStyle={styles.container} onPress={onPress}>
      {!!linkPreviews?.[link].image && (
        <Image
          style={styles.thumbnail}
          containerStyle={styles.thumbnailContainer}
          source={linkPreviews?.[link].image}
        />
      )}
      <View style={styles.metadata}>
        <Text.ButtonBase style={styles.title}>
          {linkPreviews?.[link].title}
        </Text.ButtonBase>
        {!!linkPreviews?.[link].description && (
          <Text.Subtitle style={styles.description}>
            {linkPreviews?.[link].description}
          </Text.Subtitle>
        )}
      </View>
    </ButtonWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'column',
      marginTop: spacing.margin.small,
      borderRadius: spacing.borderRadius.small,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderDivider,
      overflow: 'hidden',
      alignItems: 'flex-start',
    },
    thumbnailContainer: {
      width: '100%',
      marginBottom: spacing.margin.base,
    },
    thumbnail: {
      width: Platform.OS === 'web' ? '100%' : scaleSize(307),
      height: Platform.OS === 'web' ? 200 : scaleSize(225.5),
    },
    metadata: {
      paddingHorizontal: spacing.padding.small,
      paddingBottom: spacing.padding.large,
    },
    title: {
      marginTop: spacing.margin.small,
    },
    description: {
      marginTop: spacing.margin.small,
    },
  });
};

export default LinkPreviewer;
