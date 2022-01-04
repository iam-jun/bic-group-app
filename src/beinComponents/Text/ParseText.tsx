import React, {FC} from 'react';
import {StyleSheet, TextProps as RNTextProps} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import ParsedText from 'react-native-parsed-text';
import {openLink} from '~/utils/common';
import {useKeySelector} from '~/hooks/selector';

export interface IMarkdownAudience {
  type?: 'u' | 'g' | string;
  id?: string;
  name?: string;
}

export interface ParseTextProps extends RNTextProps {
  children?: React.ReactNode;
  showRawText?: boolean;
  parentId: string;
  selector: string;
  onPressAudience?: (audience: IMarkdownAudience) => void;
}

const ParseText: FC<ParseTextProps> = ({
  children,
  showRawText,
  selector,
  parentId,
  onPressAudience,
  ...props
}: ParseTextProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const audienceRegex = /\B(@([^@\r\n]*))$/i;

  //params: url: string, matchIndex: number
  const onPressUrl = async (url: string) => {
    await openLink(url);
  };

  const onPressPhoneNumber = async (phoneNumber: string) => {
    await openLink(`tel:${phoneNumber}`);
  };

  const onPressEmail = async (email: string) => {
    await openLink(`mailto:${email}`);
  };

  const _onPressAudience = (matched: string) => {
    if (matched) {
      const match = matched.match(audienceRegex);
      const audience: IMarkdownAudience = {
        type: match?.[1],
        id: match?.[2],
        name: match?.[3],
      };
      onPressAudience?.(audience);
    }
  };

  const getMatchText = (matched: string, matches: string[]) => {
    if (showRawText) {
      return matched;
    } else {
      return matches?.[1] || matched;
    }
  };

  const getMatchAudienceText = (matched: string, matches: string[]) => {
    if (showRawText) {
      return matched;
    } else {
      const name = useKeySelector(
        `${selector}.${parentId}.mentions.${matched}.data.name`,
      );
      return name || matched;
    }
  };

  return (
    <ParsedText
      childrenProps={{allowFontScaling: false}}
      parse={[
        // {type: 'url', style: styles.url, onPress: onPressUrl},
        // {
        //   type: 'phone',
        //   style: styles.phone,
        //   onPress: onPressPhoneNumber,
        // },
        // {
        //   type: 'email',
        //   style: styles.email,
        //   onPress: onPressEmail,
        // },
        // {pattern: /#(\w+)/, style: styles.hashTag},
        // {
        //   pattern: /\*(.*?)\*/,
        //   style: styles.bold,
        //   renderText: getMatchText,
        // },
        {
          pattern: audienceRegex,
          style: styles.audience,
          renderText: getMatchAudienceText,
          onPress: _onPressAudience,
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
    audience: {
      fontWeight: 'bold',
      color: colors.link,
    },
  });
};

export default ParseText;
