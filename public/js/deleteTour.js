/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteTour = async (tourId, page, rowsPerPage, searchQuery) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/tours/${tourId}`
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Xoá tour thành công!');
      $.get(window.location.href, { page: page + 1, rowsPerPage: rowsPerPage, search: searchQuery }, function(data) {
        $('#tourTable').html(data.tourTableHtml);
        $('#paginationWrapper').html(data.paginationHtml);
      });
      $('#exampleModalDeleteTour').modal('hide');
    } 
  } catch (err) {
    showAlert('error', `Lỗi xoá tour: ${err.response.data.message}`);
  }
};


