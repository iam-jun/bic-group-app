import i18Next from '~/localization';

export const convertMultiLanguage = () => {
  const locale = i18Next.language;
  const languages: any = i18Next.options.resources;
  return languages[locale];
};
