import React from 'react';
import {
  Text as TextRN,
  TextProps as RNTextProps,
  StyleSheet,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {createStyle} from '~/beinComponents/Text/textStyle';
import {ITheme} from '~/theme/interfaces';
import {useBaseHook} from '~/hooks';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'buttonBase'
  | 'buttonSmall'
  | 'bodyM'
  | 'body'
  | 'bodySM'
  | 'bodyS'
  | 'subtitle'
  | undefined;

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  children?: React.ReactNode;
  color?: string;
  useI18n?: boolean;
}

const _Text: React.FC<TextProps> = ({
  variant,
  style,
  children,
  color,
  useI18n,
  ...props
}: TextProps) => {
  const theme: ITheme = useTheme();
  const {t} = useBaseHook();
  const styles: {[key: string]: any} = createStyle(theme);
  const textStyle = styles[variant || 'body'];

  return (
    <TextRN
      {...props}
      style={StyleSheet.flatten([textStyle, color ? {color} : {}, style])}>
      {useI18n ? t(children) : children}
    </TextRN>
  );
};

const H1 = ({...props}: TextProps) => <_Text variant={'h1'} {...props} />;
const H2 = ({...props}: TextProps) => <_Text variant={'h2'} {...props} />;
const H3 = ({...props}: TextProps) => <_Text variant={'h3'} {...props} />;
const H4 = ({...props}: TextProps) => <_Text variant={'h4'} {...props} />;
const H5 = ({...props}: TextProps) => <_Text variant={'h5'} {...props} />;
const H6 = ({...props}: TextProps) => <_Text variant={'h6'} {...props} />;
const ButtonBase = ({...props}: TextProps) => (
  <_Text variant={'buttonBase'} {...props} />
);
const ButtonSmall = ({...props}: TextProps) => (
  <_Text variant={'buttonSmall'} {...props} />
);
const BodyM = ({...props}: TextProps) => <_Text variant={'bodyM'} {...props} />;
const Body = ({...props}: TextProps) => <_Text variant={'body'} {...props} />;
const BodySM = ({...props}: TextProps) => (
  <_Text variant={'bodySM'} {...props} />
);
const BodyS = ({...props}: TextProps) => <_Text variant={'bodyS'} {...props} />;
const Subtitle = ({...props}: TextProps) => (
  <_Text variant={'subtitle'} {...props} />
);

const Text = Object.assign(_Text, {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  ButtonBase,
  ButtonSmall,
  BodyM,
  Body,
  BodySM,
  BodyS,
  Subtitle,
});

export default Text;
