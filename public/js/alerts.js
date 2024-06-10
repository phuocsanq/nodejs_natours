/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.my-alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error' or 'notification'
export const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="my-alert my-alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};
