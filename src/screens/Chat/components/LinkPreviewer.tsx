import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';
import appActions from '~/store/app/actions';
import {ITheme} from '~/theme/interfaces';
import {getUrlFromText} from '~/utils/common';

interface Props {
  text?: string;
}

const LinkPreviewer = ({text}: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);
  const [link, setLink] = useState<string | undefined>('');
  const linkPreview = useKeySelector(`app.linkPreviews.${link}`);

  useEffect(() => {
    const url = getUrlFromText(text);
    setLink(url);
  }, [text]);

  useEffect(() => {
    if (link && !linkPreview) {
      dispatch(appActions.getLinkPreview(link));
    }
  }, [link]);

  if (!linkPreview) return null;

  return (
    <View style={styles.container}>
      <Image source={linkPreview.thumbnail} />
      <Text>{linkPreview.title}</Text>
      <Text>{linkPreview.description}</Text>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      borderRadius: spacing.borderRadius.small,
    },
  });
};

export default LinkPreviewer;
