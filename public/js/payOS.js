/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId, quantity) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/bookings/create-payment-link/${tourId}/${quantity}`,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Going checkout!');
      window.location.href = res.data.paymentLinkRes.checkoutUrl;
      // console.log(res.data.paymentLinkRes);
    }
  } catch (err) {
      showAlert('error', err.response.data.message);
  }
};

