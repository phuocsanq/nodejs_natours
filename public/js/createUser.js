/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const createUser = async (name, email, role, password, passwordConfirm, page, rowsPerPage, searchQuery) => {
  // Validate inputs
  // if (!name || !email || !role || !password || !passwordConfirm) {
  //   showAlert("notification", "Vui lòng điền đầy đủ thông tin.");
  //   return;
  // }
  // // Check if passwords match
  // if (password !== passwordConfirm) {
  //   showAlert("notification", "Mật khẩu và xác nhận mật khẩu không khớp.");
  //   return;
  // }

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
        $('#userTable').html(data.userTableHtml);
        $('#paginationWrapper').html(data.paginationHtml);
      });
    }
  } catch (err) {
    showAlert('error', `Lỗi thêm người dùng: ${err.response.data.message}`);
  }
};
