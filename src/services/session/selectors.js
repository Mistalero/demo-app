import { get } from 'lodash';

export const getPrivateKey: Function = (state: Object): Object =>
  get(state, 'services.session.privateKey');

export const getSession: Function = (state: Object): Object =>
  get(state, 'services.session');

export const isOwner: Function = (state: Object, address: string): boolean =>
  get(getSession(state), 'address') === address;
