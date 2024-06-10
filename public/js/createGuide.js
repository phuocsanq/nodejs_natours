/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createGuide = async (name, email, role, password, passwordConfirm, page, rowsPerPage, searchQuery) => {
  
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/signup`,
      data: {
        name,
        email,
        role, 
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Thêm người dùng thành công!');
      $.get(window.location.href, { page: page + 1, rowsPerPage: rowsPerPage, search: searchQuery }, function(data) {
        $('#guideTable').html(data.guideTableHtml);
        $('#paginationWrapper').html(data.paginationHtml);
      });
    }
  } catch (err) {
    showAlert('error', `Lỗi thêm người dùng: ${err.response.data.message}`);
  }
};
