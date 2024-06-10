/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const requestResetEmail = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
    //   showAlert('success', 'sent token. Please check email!');
      return 1;
      // alert('Logged in successfully!');
    //   window.setTimeout(() => {
    //     location.assign('/');
    //   }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    return 0;
    // alert('error', err.response.data.message);
  }
};

