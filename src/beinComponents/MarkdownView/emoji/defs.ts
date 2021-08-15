import full from './data/full';
import light from './data/light';
import reactionIcons from '~/resources/reactions';

const getDefs = (defaultDefs = {}) => {
  const reactions: {[key: string]: string} = {};
  Object.keys(reactionIcons).map(key => (reactions[key] = ''));
  return Object.assign({}, defaultDefs, reactions);
};

const defs = getDefs(full);

export default defs;
