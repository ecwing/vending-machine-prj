import selectionSound from '../assets/button-selection-sound.mp3';
import coinInsertSound from '../assets/deposit.mp3';
import dispenseSound from '../assets/purchase-dispense-sound.mp3';
import refundCoinsSound from '../assets/coin-return.mp3';
import adminResetSound from '../assets/success.mp3';

const sounds = {
  select: selectionSound,
  deposit: coinInsertSound,
  dispense: dispenseSound,
  refund: refundCoinsSound,
  adminReset: adminResetSound,
};

export function playSound(type: keyof typeof sounds) {
  const audio = new Audio(sounds[type]);
  audio.volume = 0.5;
  audio.play().catch(err => {
    console.warn('Sound failed to play:', err);
  });
}

export function playRefundSound(times: number, delay = 350) {
  let count = 0;

  const interval = setInterval(() => {
    if (count >= times) {
      clearInterval(interval);
      return;
    }

    const audio = new Audio(sounds.refund);
    audio.volume = 0.5;
    audio.play().catch(err => {
      console.warn('Failed to play refund sound:', err);
    });

    count++;
  }, delay);
}
