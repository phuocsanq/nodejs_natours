/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteBooking = async (id, page, rowsPerPage, searchQuery) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/bookings/${id}`
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Xoá booking thành công!');
      $.get(window.location.href, { page: page + 1, rowsPerPage: rowsPerPage, search: searchQuery }, function(data) {
        $('#bookingTable').html(data.bookingTableHtml);
        $('#paginationWrapper').html(data.paginationHtml);
      });
      $('#exampleModalDeleteBooking').modal('hide');
    } 
  } catch (err) {
    showAlert('error', `Lỗi xoá booking: ${err.response.data.message}`);
  }
};


