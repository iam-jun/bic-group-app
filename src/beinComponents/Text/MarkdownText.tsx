import React, {FC} from 'react';
import {StyleSheet, TextProps as RNTextProps} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ParsedText from 'react-native-parsed-text';
import {openLink} from '~/utils/common';

export interface MarkdownTextProps extends RNTextProps {
  children?: React.ReactNode;
}

const MarkdownText: FC<MarkdownTextProps> = ({
  children,
  ...props
}: MarkdownTextProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  //params: url: string, matchIndex: number
  const onPressUrl = async (url: string) => {
    await openLink(url);
  };

  const onPressPhoneNumber = async (phoneNumber: string) => {
    await openLink(`tel:${phoneNumber}`);
  };

  const handleEmailPress = async (email: string) => {
    await openLink(`mailto:${email}`);
  };

  const getMatchText = (matched: string, matches: string[]) => {
    return matches?.[1] || matched;
  };

  return (
    <ParsedText
      childrenProps={{allowFontScaling: false}}
      parse={[
        {type: 'url', style: styles.url, onPress: onPressUrl},
        {
          type: 'phone',
          style: styles.phone,
          onPress: onPressPhoneNumber,
        },
        {
          type: 'email',
          style: styles.email,
          onPress: handleEmailPress,
        },
        {pattern: /#(\w+)/, style: styles.hashTag},
        {
          pattern: /\*(.*?)\*/,
          style: styles.bold,
          renderText: getMatchText,
        },
      ]}
      {...props}>
      {children}
    </ParsedText>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    url: {
      color: colors.link,
    },
    email: {
      color: colors.link,
    },
    phone: {
      color: colors.link,
    },
    hashTag: {
      fontStyle: 'italic',
    },
    bold: {
      fontWeight: 'bold',
    },
  });
};

export default MarkdownText;
