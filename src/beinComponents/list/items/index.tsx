import FlatGroupItem from './FlatGroupItem';

const items: {[key: string]: any} = {
  flatGroups: FlatGroupItem,
};

export type IListViewItem = keyof typeof items;

export default items;
