import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('button[data-start]');
const daysValue = document.querySelector('span[data-days]');
const hoursValue = document.querySelector('span[data-hours]');
const minutesValue = document.querySelector('span[data-minutes]');
const secondsValue = document.querySelector('span[data-seconds]');

document.addEventListener('DOMContentLoaded', () => {
  validate();
});
let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    validate();
    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a valid date in the future',
        position: 'topRight',
        titleColor: '#fff',
        messageColor: '#fff',
        backgroundColor: '#ef4040',
      });
    }
  },
};

flatpickr(datetimePicker, options);

function validate() {
  if (userSelectedDate === null || userSelectedDate <= new Date()) {
    btnStart.disabled = true;
    return !btnStart.disabled;
  } else {
    btnStart.disabled = false;
    return !btnStart.disabled;
  }
}

btnStart.addEventListener('click', ev => {
  if (validate()) {
    datetimePicker.disabled = true;
    const dateNow = new Date().getTime();
    const currentTime = userSelectedDate - dateNow;
    startCountdown(currentTime);
  }
});
let timerInterval = null;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
function startCountdown(duration) {
  timerInterval = setInterval(() => {
    const { days, hours, minutes, seconds } = convertMs(duration);
    daysValue.textContent = addLeadingZero(days);
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);

    duration -= 1000;
    if (duration < 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      daysValue.textContent = '00';
      hoursValue.textContent = '00';
      minutesValue.textContent = '00';
      secondsValue.textContent = '00';
      datetimePicker.disabled = false;
      iziToast.info({
        title: 'Info',
        message: 'Час вийшов!',
      });
    } else {
      btnStart.disabled = true;
    }
  }, 1000);
}
