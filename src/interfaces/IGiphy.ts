export interface IGiphy {
  id: string;
  type?: string;
  url?: string;
  width?: string;
  height?: string;
  size?: string;
}

export interface IGetGiphyTrendingParams {
    limit?: number;
    rating?: 'g'| 'pg'| 'pg-13'| 'r';
    type?: 'original'| 'preview_gif'| 'preview_webp'
}

export interface IGetSearchGiphyParams extends IGetGiphyTrendingParams {
    q: string;
    lang?: string;
    offset?: number;
}
