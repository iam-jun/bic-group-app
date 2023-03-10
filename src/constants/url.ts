import getEnv from '~/utils/env';

export const POLICY_URL = `https://${getEnv('SELF_DOMAIN')}/policy`;
