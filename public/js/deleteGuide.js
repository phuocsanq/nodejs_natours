/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteGuide = async (userId, page, rowsPerPage, searchQuery) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${userId}`,
      data: {
        active: false
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Xoá người dùng thành công!');
      $.get(window.location.href, { page: page + 1, rowsPerPage: rowsPerPage, search: searchQuery }, function(data) {
        $('#guideTable').html(data.guideTableHtml);
        $('#paginationWrapper').html(data.paginationHtml);
      });
      $('#exampleModalDeleteGuide').modal('hide');
    }
  } catch (err) {
    showAlert('error', `Lỗi xoá người dùng: ${err.response.data.message}`);
  }
};


