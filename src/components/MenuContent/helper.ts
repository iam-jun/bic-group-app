import { PostType } from "~/interfaces/IPost";
import { LinkGeneratorTypes } from '~/utils/link';

export const getCopyLinkType = (contentType) => {
  if (contentType === PostType.POST) {
    return LinkGeneratorTypes.POST;
  }

  if (contentType === PostType.SERIES) {
    return LinkGeneratorTypes.SERIRES;
  }

  if (contentType === PostType.ARTICLE) {
    return LinkGeneratorTypes.ARTICLE;
  }
};
