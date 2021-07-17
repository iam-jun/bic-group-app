import React from 'react';
import {Text as TextRN, TextProps, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {createStyle} from '~/beinComponents/Text/textStyle';
import {ITheme} from '~/theme/interfaces';

export interface BeinTextProps extends TextProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'bodyM'
    | 'body'
    | 'bodySM'
    | 'bodyS'
    | 'subtitle'
    | undefined;
  children?: React.ReactNode;
  color?: string;
}

const Text: React.FC<BeinTextProps> = ({
  variant,
  style,
  children,
  color,
  ...props
}) => {
  const theme: ITheme = useTheme();
  const styles: {[key: string]: any} = createStyle(theme);
  const textStyle = styles[variant || 'body'];

  return (
    <TextRN
      {...props}
      style={StyleSheet.flatten([textStyle, color ? {color} : {}, style])}>
      {children}
    </TextRN>
  );
};

const H1 = ({...props}: BeinTextProps) => <Text variant={'h1'} {...props} />;
const H2 = ({...props}: BeinTextProps) => <Text variant={'h2'} {...props} />;
const H3 = ({...props}: BeinTextProps) => <Text variant={'h3'} {...props} />;
const H4 = ({...props}: BeinTextProps) => <Text variant={'h4'} {...props} />;
const H5 = ({...props}: BeinTextProps) => <Text variant={'h5'} {...props} />;
const H6 = ({...props}: BeinTextProps) => <Text variant={'h6'} {...props} />;
const BodyM = ({...props}: BeinTextProps) => (
  <Text variant={'bodyM'} {...props} />
);
const Body = ({...props}: BeinTextProps) => (
  <Text variant={'body'} {...props} />
);
const BodySM = ({...props}: BeinTextProps) => (
  <Text variant={'bodySM'} {...props} />
);
const BodyS = ({...props}: BeinTextProps) => (
  <Text variant={'bodyS'} {...props} />
);
const Subtitle = ({...props}: BeinTextProps) => (
  <Text variant={'subtitle'} {...props} />
);

export default Object.assign(Text, {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  BodyM,
  Body,
  BodySM,
  BodyS,
  Subtitle,
});
