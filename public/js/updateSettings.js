/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      if(type.toUpperCase() === 'DATA') {
        showAlert('success', `Cập nhật thông tin thành công!`);
      } else {
        showAlert('success', `Cập nhật mật khẩu thành công!`);
      }
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
