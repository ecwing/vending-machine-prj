import type { Coin } from './types/index';

import usNickel from './assets/us-nickel.webp';
import usDime from './assets/us-dime.webp';
import usQuarter from './assets/us-quarter.webp';

import canNickel from './assets/can-nickel.webp';
import canDime from './assets/can-dime.webp';
import canQuarter from './assets/can-quarter.webp';

import crispCola from './assets/crisp-cola.webp';
import crispDietCola from './assets/crisp-diet-cola.webp';
import crispLimeSoda from './assets/crisp-lime-soda.webp';
import crispWater from './assets/crisp-water.webp';

export const COIN_IMAGES = {
  USD: {
    nickel: usNickel,
    dime: usDime,
    quarter: usQuarter,
  },
  CAD: {
    nickel: canNickel,
    dime: canDime,
    quarter: canQuarter,
  },
} as const;

export const DRINK_IMAGES = {
  cola: crispCola,
  dietCola: crispDietCola,
  limeSoda: crispLimeSoda,
  water: crispWater,
} as const;

export const DEPOSIT_SOUND_DURATION_MS = 1500;

export const COINS: Coin[] = ['nickel', 'dime', 'quarter'];
export const COINS_SORTED_DESCENDING: Coin[] = ['quarter', 'dime', 'nickel'];
