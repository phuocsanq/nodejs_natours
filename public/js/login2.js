/* eslint-disable */

const login = async (email, password) => {
    console.log(email, password);
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
            // showAlert('success', 'Logged in successfully!');
            alert('Logged in successfully!');
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
        }

    } catch (err) {
        // showAlert('error', err.response.data.message);
        alert(err.response.data.message);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.form--login').addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
});
