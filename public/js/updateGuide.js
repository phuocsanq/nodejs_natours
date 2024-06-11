/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateGuideInfor = async (userId, name, page, rowsPerPage, searchQuery) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${userId}`,
      data: {
        name
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Cập nhật thông tin người dùng thành công!');
      $.get(window.location.href, { page: page + 1, rowsPerPage: rowsPerPage, search: searchQuery }, function(data) {
        $('#guideTable').html(data.guideTableHtml);
        $('#paginationWrapper').html(data.paginationHtml);
      });
    }
  } catch (err) {
    showAlert('error', `Lỗi cập nhật thông tin người dùng: ${err.response.data.message}`);
  }
};

export const updateGuidePassword = async (userId, password, passwordConfirm, page, rowsPerPage, searchQuery) => {
  try {
    console.log(userId, password, passwordConfirm)
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${userId}/updateUserPassword`,
      data: {
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Cập nhật mật khẩu người dùng thành công!');
      $.get(window.location.href, { page: page + 1, rowsPerPage: rowsPerPage, search: searchQuery }, function(data) {
        $('#guideTable').html(data.guideTableHtml);
        $('#paginationWrapper').html(data.paginationHtml);
      });
    }
  } catch (err) {
    showAlert('error', `Lỗi cập nhật mật khẩu người dùng: ${err.response.data.message}`);
  }
};

