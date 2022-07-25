import React from 'react';
import { Text as TextRN, TextProps as RNTextProps } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { createTextStyle } from '~/beinComponents/Text/textStyle';
import { useBaseHook } from '~/hooks';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitleL'
  | 'subtitleM'
  | 'subtitleS'
  | 'subtitleXS'
  | 'bodyM'
  | 'bodyMMedium'
  | 'bodyS'
  | 'bodySMedium'
  | 'paragraphL'
  | 'paragraphM'
  | 'paragraphS'
  | 'buttonL'
  | 'buttonM'
  | 'buttonS'
  | 'tabL'
  | 'tabM'
  | 'tabS'
  | 'linkM'
  | 'linkS'
  | 'badgeL'
  | 'badgeM'
  | 'badgeS'
  | 'badgeXS'
  | 'labelL'
  | 'labelM'
  | 'dropdownM'
  | 'dropdownS'
  | 'numberM'
  | 'numberS'
  | 'captionS'
  | undefined;

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  children?: React.ReactNode;
  color?: string;
  useI18n?: boolean;
  maxLength?: number;
}

const TextComponent: React.FC<TextProps> = ({
  variant,
  style,
  children,
  color,
  useI18n,
  maxLength,
  ...props
}: TextProps) => {
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const styles = createTextStyle(theme);
  const textStyle = styles[variant || 'bodyM'];

  let content = useI18n ? t(children) : children;

  if (
    maxLength
    && !isNaN(maxLength)
    && maxLength > 0
    && maxLength < content.length
    && typeof content === 'string'
  ) {
    content = `${content.substring(0, maxLength)}...`;
  }

  return (
    <TextRN
      // allowFontScaling={false} disable block font scaling because somewhere not set fontSize (markdown, input) still use scale size
      {...props}
      style={[textStyle, color ? { color } : {}, style]}
    >
      {content}
    </TextRN>
  );
};

const H1 = ({ ...props }: TextProps) => (
  <TextComponent variant="h1" {...props} />
);
const H2 = ({ ...props }: TextProps) => (
  <TextComponent variant="h2" {...props} />
);
const H3 = ({ ...props }: TextProps) => (
  <TextComponent variant="h3" {...props} />
);
const H4 = ({ ...props }: TextProps) => (
  <TextComponent variant="h4" {...props} />
);
const H5 = ({ ...props }: TextProps) => (
  <TextComponent variant="h5" {...props} />
);
const H6 = ({ ...props }: TextProps) => (
  <TextComponent variant="h6" {...props} />
);
const SubtitleL = ({ ...props }: TextProps) => (
  <TextComponent variant="subtitleL" {...props} />
);
const SubtitleM = ({ ...props }: TextProps) => (
  <TextComponent variant="subtitleM" {...props} />
);
const SubtitleS = ({ ...props }: TextProps) => (
  <TextComponent variant="subtitleS" {...props} />
);
const SubtitleXS = ({ ...props }: TextProps) => (
  <TextComponent variant="subtitleXS" {...props} />
);
const BodyM = ({ ...props }: TextProps) => (
  <TextComponent variant="bodyM" {...props} />
);
const BodyMMedium = ({ ...props }: TextProps) => (
  <TextComponent variant="bodyMMedium" {...props} />
);
const BodyS = ({ ...props }: TextProps) => (
  <TextComponent variant="bodyS" {...props} />
);
const BodySMedium = ({ ...props }: TextProps) => (
  <TextComponent variant="bodySMedium" {...props} />
);
const ParagraphL = ({ ...props }: TextProps) => (
  <TextComponent variant="paragraphL" {...props} />
);
const ParagraphM = ({ ...props }: TextProps) => (
  <TextComponent variant="paragraphM" {...props} />
);
const ParagraphS = ({ ...props }: TextProps) => (
  <TextComponent variant="paragraphS" {...props} />
);
const ButtonL = ({ ...props }: TextProps) => (
  <TextComponent variant="buttonL" {...props} />
);
const ButtonM = ({ ...props }: TextProps) => (
  <TextComponent variant="buttonM" {...props} />
);
const ButtonS = ({ ...props }: TextProps) => (
  <TextComponent variant="buttonS" {...props} />
);
const TabL = ({ ...props }: TextProps) => (
  <TextComponent variant="tabL" {...props} />
);
const TabM = ({ ...props }: TextProps) => (
  <TextComponent variant="tabM" {...props} />
);
const TabS = ({ ...props }: TextProps) => (
  <TextComponent variant="tabS" {...props} />
);
const LinkM = ({ ...props }: TextProps) => (
  <TextComponent variant="linkM" {...props} />
);
const LinkS = ({ ...props }: TextProps) => (
  <TextComponent variant="linkS" {...props} />
);
const BadgeL = ({ ...props }: TextProps) => (
  <TextComponent variant="badgeL" {...props} />
);
const BadgeM = ({ ...props }: TextProps) => (
  <TextComponent variant="badgeM" {...props} />
);
const BadgeS = ({ ...props }: TextProps) => (
  <TextComponent variant="badgeS" {...props} />
);
const BadgeXS = ({ ...props }: TextProps) => (
  <TextComponent variant="badgeXS" {...props} />
);
const LabelL = ({ ...props }: TextProps) => (
  <TextComponent variant="labelL" {...props} />
);
const LabelM = ({ ...props }: TextProps) => (
  <TextComponent variant="labelM" {...props} />
);
const DropdownM = ({ ...props }: TextProps) => (
  <TextComponent variant="dropdownM" {...props} />
);
const DropdownS = ({ ...props }: TextProps) => (
  <TextComponent variant="dropdownS" {...props} />
);
const NumberM = ({ ...props }: TextProps) => (
  <TextComponent variant="numberM" {...props} />
);
const NumberS = ({ ...props }: TextProps) => (
  <TextComponent variant="numberS" {...props} />
);
const CaptionS = ({ ...props }: TextProps) => (
  <TextComponent variant="captionS" {...props} />
);

const Text = Object.assign(TextComponent, {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  SubtitleL,
  SubtitleM,
  SubtitleS,
  SubtitleXS,
  BodyM,
  BodyMMedium,
  BodyS,
  BodySMedium,
  ParagraphL,
  ParagraphM,
  ParagraphS,
  ButtonL,
  ButtonM,
  ButtonS,
  TabL,
  TabM,
  TabS,
  LinkM,
  LinkS,
  BadgeL,
  BadgeM,
  BadgeS,
  BadgeXS,
  LabelL,
  LabelM,
  DropdownM,
  DropdownS,
  NumberM,
  NumberS,
  CaptionS,
});

export default Text;
