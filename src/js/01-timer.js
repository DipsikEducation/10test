
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const myInput = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('[data-start]');
const timerDays = document.querySelector('[data-days]');
const timerHours = document.querySelector('[data-hours]');
const timerMinutes = document.querySelector('[data-minutes]');
const timerSeconds = document.querySelector('[data-seconds]');

let userSelectedDate = null;
btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] > Date.now()) {
      userSelectedDate = selectedDates[0];
      btnStart.disabled = false;
    } else {
      btnStart.disabled = true;
      iziToast.error({
        color: 'red',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    }
  },
};

const fp = flatpickr(myInput, options);

btnStart.addEventListener('click', onBtnStartClick);

function onBtnStartClick() {
  myInput.disabled = true;
  const intervalId = setInterval(() => {
    const deltaTime = userSelectedDate.getTime() - Date.now();

    if (deltaTime >= 0) {
      const result = convertMs(deltaTime);
      timerDays.textContent = addLeadingZero(result.days);
      timerHours.textContent = addLeadingZero(result.hours);
      timerMinutes.textContent = addLeadingZero(result.minutes);
      timerSeconds.textContent = addLeadingZero(result.seconds);
      btnStart.disabled = true;
    } else {
      clearInterval(intervalId);
      myInput.disabled = false;
    }
  }, 1000);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

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