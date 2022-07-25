import full from './plugin/lib/data/full.json';
import light from './plugin/lib/data/light.json';
import reactionIcons from '~/resources/reactions';

const getDefs = (defaultDefs = {}) => {
  const reactions: {[key: string]: string} = {};
  Object.keys(reactionIcons).map((key) => (reactions[key] = ''));
  return { ...defaultDefs, ...reactions };
};

const defs = getDefs(full);

export default defs;
