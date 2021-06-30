import {toNumber} from 'lodash';
import {IObject} from '~/interfaces/common';

export default (type: string, item: IObject<any>) => {
  switch (type) {
    case 'content':
      return {
        ...item,
        price: toNumber(item.price),
        media: item?.coverUrl && {
          type: 'image',
          uri: item.coverUrl,
          isLoading: false,
          percentage: undefined,
        },
        topics: item.topics || [],
        questions: item.questions || [],
        hashtags: item.hashtags
          ? item.hashtags.map((item: IObject<any>) => ({name: item}))
          : [],
        reaction: {
          like: item.likeCount || 0,
          comment: item.commentCount || 0,
          share: item.shareCount || 0,
          // donate: item.donateCount || 0,
        },
      };
    default:
      return item;
  }
};
