/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createTour = async (formData) => {
  
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours`,
      data: formData
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Thêm tour thành công!');
      // $.get(window.location.href, { page: page + 1, rowsPerPage: rowsPerPage, search: searchQuery }, function(data) {
      //   $('#userTable').html(data.userTableHtml);
      //   $('#paginationWrapper').html(data.paginationHtml);
      // });
    }
  } catch (err) {
    showAlert('error', `Lỗi thêm tour: ${err.response.data.message}`);
  }
};
