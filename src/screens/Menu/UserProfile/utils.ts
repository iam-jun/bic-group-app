import speakingLanguages from '~/constants/speakingLanguages';

export const getLanguages = (language: string[]) => {
  const userLanguageList = language?.map((
    code: string,
  ) => speakingLanguages[code].name);

  return userLanguageList?.join(', ');
}
