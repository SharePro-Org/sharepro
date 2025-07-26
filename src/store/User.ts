import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type User = {
  id: string;
  name: string;
  email: string;
  token: string;
};

export const userAtom = atomWithStorage<any>('user', null);
