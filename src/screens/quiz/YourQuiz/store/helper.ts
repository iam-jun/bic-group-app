import { ContentQuiz } from '~/interfaces/IQuiz';

export const getParamsTypeContentQuiz = (contentFilter: ContentQuiz) => {
  switch (contentFilter) {
    case ContentQuiz.ALL:
      return undefined;
    case ContentQuiz.ARTICLE:
      return ContentQuiz.ARTICLE;
    case ContentQuiz.POST:
      return ContentQuiz.POST;
  }
};
