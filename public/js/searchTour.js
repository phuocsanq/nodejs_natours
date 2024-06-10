/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const getSearchTourForm = async (searchParams) => {
  try {
    if(!searchParams.toString().includes('departure')) {
        showAlert('notification', 'Vui lòng chọn điểm đi!');
        return 0;
    }

    window.location.href = `/search-tour?${searchParams.toString()}`;

  } catch (err) {
      showAlert('error', err.response.data.message);
  }
};

