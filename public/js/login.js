/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password, redirectUrl) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Đăng nhập thành công!');
      // console.log('ROLE---', res.data.data.user.role);
      if(res.data.data.user.role === 'admin') {
        window.setTimeout(() => {
          location.assign('/admin/tour');
        }, 1500);
      }
      else {
        window.setTimeout(() => {
          location.assign(redirectUrl);
        }, 1500);
      }
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if ((res.data.status = 'success'))
      {
        location.reload(true);
        window.location.href = '/';
      }
  } catch (err) {
    // console.log(err.response);
    showAlert('error', 'Lỗi! Vui lòng thử lại.');
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Đăng ký tài khoản thành công!');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
