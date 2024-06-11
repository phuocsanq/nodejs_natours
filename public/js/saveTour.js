/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const saveTour = async (id, formData, page, rowsPerPage, searchQuery) => {
  
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/tours/${id}`,
      data: formData
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Cập nhật tour thành công!');
      $.get(window.location.href, { page: page + 1, rowsPerPage: rowsPerPage, search: searchQuery }, function(data) {
        $('#tourTable').html(data.tourTableHtml);
        $('#paginationWrapper').html(data.paginationHtml);
      });

    }
  } catch (err) {
    showAlert('error', `Lỗi cập nhật tour: ${err.response.data.message}`);
  }
};
