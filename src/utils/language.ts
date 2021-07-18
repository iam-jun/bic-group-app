import {Resource, ResourceLanguage} from 'i18next';
import i18Next from '~/localization';

export const convertMultiLanguage = (): ResourceLanguage => {
  const locale = i18Next.language;
  // @ts-ignore
  const languages: Resource = i18Next.options.resources;
  return languages[locale];
};
