export interface IPostAudience {
  users?: number[];
  groups?: number[];
}

export interface IAudience {
  id?: number | string;
  name?: string;
  icon?: string;
  avatar?: string;
  userCount?: number;
  type?: string;
  isGroup?: boolean;
}

export interface IPostData {
  content?: string;
  images?: string[];
  videos?: string[];
  files?: string[];
}

/**
  actor: userId
  - Getstream saved as string
  - Backend saved as int
    =>  When post data to Backend, actor should be NUMBER
        Otherwhile, when get data from Backend or Getstrea, actor should be STRING
 */
export interface IPostActivity {
  id?: number;
  foreign_id?: string;
  getstream_id?: string;
  actor?: string | number;
  verb?: string;
  type?: string;
  data?: IPostData;
  followers?: number[];
  audience?: IPostAudience;
  tags?: string[];
  time?: string;
}

export interface IPostCreatePost {
  actor?: number;
  data?: IPostData;
  audience?: IPostAudience;
  tags?: number[];
}
