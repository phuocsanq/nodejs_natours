/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './openstreetmap';
import { login, logout, signup } from './login';
import { updateSettings } from './updateSettings';
import { requestResetEmail } from './requestResetEmail';
import { resetPassword } from './resetPassword';
import { bookTour } from './payOS';
import { getSearchTourForm } from './searchTour';
import { updateUserInfor, updateUserPassword } from './updateUser'
import { createUser } from './createUser'
import { deleteUser } from './deleteUser'
import { createTour } from './createTour'
import { saveTour } from './saveTour'
import { deleteTour } from './deleteTour'

import { updateGuideInfor, updateGuidePassword } from './updateGuide'
import { createGuide } from './createGuide'
import { deleteGuide } from './deleteGuide'

// DOM ELEMENTS
// const mapBox = document.getElementById('map');
const mapBox = document.querySelector('#map')
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const requestResetEmailForm = document.querySelector('.form--request-reset-email');
const resetPasswordForm = document.querySelector('.form--reset-password');
const bookBtn = document.getElementById('book-tour');
const bookingInforForm = document.querySelector('.booking-infor-form');
const searchTourBtn = document.getElementById('searchTourBtn');

const btnChangUserInfor = document.getElementById('changUserInfor');
const btnChangUserPass = document.getElementById('changUserPass');
const btnAddUser = document.getElementById('btnAddUser');
const btnDeleteUser = document.getElementById('deleteUser');

const btnChangGuideInfor = document.getElementById('changGuideInfor');
const btnChangGuidePass = document.getElementById('changGuidePass');
const btnAddGuide = document.getElementById('btnAddGuide');
const btnDeleteGuide = document.getElementById('deleteGuide');
const btnDeleteTour = document.getElementById('deleteTour');

const addTourForm = document.querySelector('.form--add-tour');


// DELEGATION
if (mapBox) {
  const locationsData = JSON.parse(mapBox.getAttribute('data-locations'));
  displayMap(locationsData);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const params = new URLSearchParams(window.location.search);
    // console.log('------', params.get('redirect'))
    const redirectUrl = params.get('redirect') ? decodeURIComponent(params.get('redirect')) : '/';
    login(email, password, redirectUrl);
    // console.log(redirectUrl);
});

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
});

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (requestResetEmailForm)
  requestResetEmailForm.addEventListener('submit', async e => {
    e.preventDefault();

    document.querySelector('.btn--green').textContent = 'Processing...';
    const email = document.getElementById('email').value;
    if(await requestResetEmail(email)) {
      document.querySelector('.lable-request-email').textContent = `Kiểm tra email để đặt lại mật khẩu. 
      Chúng tôi đã gửi một email chứa liên kết đặt lại mật khẩu đến địa chỉ email được đăng ký. 
      Vui lòng truy cập hộp thư đến của tài khoản email và nhấp vào liên kết để hoàn tất quá trình đặt lại mật khẩu 🔔📩`;
      document.getElementById('email').style.display = "none";
      document.querySelector('.btn--green').style.display = "none";
    }
    document.querySelector('.btn--green').textContent = 'Send email link';
  });

if (resetPasswordForm)
  resetPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const url = new URL(window.location.href);
    const path = url.pathname;
    const resetToken = path.substring(path.lastIndexOf('/') + 1);
    console.log(password, passwordConfirm, resetToken);
    resetPassword(password, passwordConfirm, resetToken);

  });

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';

    const { tourId } = e.target.dataset;
    
    const myInput = document.getElementById("my-input");
    const quantity = myInput.getAttribute("value");
    bookTour(tourId, quantity);
    console.log(tourId, quantity);
  });

if(bookingInforForm) {
  const decrementBtn = document.getElementById('decrement');
  const incrementBtn = document.getElementById('increment');
  const myInput = document.getElementById("my-input");

  decrementBtn.addEventListener('click', e => {
    let min = myInput.getAttribute("min");
    let max = myInput.getAttribute("max");
    let val = myInput.getAttribute("value");
    let newValue = parseInt(val) - 1;

    if(newValue >= min && newValue <= max){
        myInput.setAttribute("value", newValue);
    }
  });

  incrementBtn.addEventListener('click', e => {
    let min = myInput.getAttribute("min");
    let max = myInput.getAttribute("max");
    let val = myInput.getAttribute("value");
    let newValue = parseInt(val) + 1;

    if(newValue >= min && newValue <= max){
        myInput.setAttribute("value", newValue);
    }
  });
}

if(searchTourBtn) {
  searchTourBtn.addEventListener('click', function() {
    const type = document.getElementById('domesticBtn').classList.contains('active') ? 'domestic' : 'international';
    const departure = document.getElementById('departure').value;
    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('startDate').value;

    const searchParams = new URLSearchParams();
    searchParams.append('type', type);
    if (departure) searchParams.append('departure', departure);
    if (destination) searchParams.append('destination', destination);
    if (startDate) searchParams.append('startDate', startDate);

    // console.log(searchParams.toString());
    getSearchTourForm(searchParams);
  });
}
/////

if(btnChangUserInfor)
  btnChangUserInfor.addEventListener('click', async () => {
    const form = btnChangUserInfor.closest('form');
    if (form.checkValidity()) {
      const exampleModal = document.getElementById('exampleModalChangeUserInfor');

      const userId = exampleModal.querySelector('.modal-body input#staticId').value;
      const updatedName = exampleModal.querySelector('.modal-body input#staticName').value;
      // const updatedRole = exampleModal.querySelector('.modal-body select#staticRole').value;

      //- console.log(userId, updatedName, updatedRole)
      
      const searchQuery = $('#searchUser').val();
      const page = $('.page-link').data('page');
      const rowsPerPage = $('.rowsPerPage').val();
      updateUserInfor(userId, updatedName, page, rowsPerPage, searchQuery);
      // $.get(window.location.href, { page: page, rowsPerPage: rowsPerPage }, function(data) {
      //   $('#userTable').html(data.userTableHtml);
      //   $('#paginationWrapper').html(data.paginationHtml);
      // });
    }
  });

if(btnChangUserPass)
  btnChangUserPass.addEventListener('click', async () => {
    const form = btnChangUserPass.closest('form');
    if (form.checkValidity()) {
      const exampleModal = document.getElementById('exampleModalChangeUserInfor');

      const userId = exampleModal.querySelector('.modal-body input#staticId').value;
      const password = exampleModal.querySelector('.modal-body input#staticPassword').value;
      const passwordConfirm = exampleModal.querySelector('.modal-body input#staticPasswordConfirm').value;


      // - console.log(userId, password, passwordConfirm)
      const searchQuery = $('#searchUser').val();
      const page = $('.page-link').data('page');
      const rowsPerPage = $('.rowsPerPage').val();
      updateUserPassword(userId, password, passwordConfirm, page, rowsPerPage, searchQuery);
    }    
  });

if(btnAddUser)
  btnAddUser.addEventListener('click', async () => {
    const form = btnAddUser.closest('form');
    if (form.checkValidity()) {

      const exampleModal = document.getElementById('exampleModalAddUser');

      const name = exampleModal.querySelector('.modal-body input#staticAddName').value;
      const email = exampleModal.querySelector('.modal-body input#staticAddEmail').value;
      // const role = exampleModal.querySelector('.modal-body select#staticAddRole').value;
      const role = 'user';
      const password = exampleModal.querySelector('.modal-body input#staticAddPassword').value;
      const passwordConfirm = exampleModal.querySelector('.modal-body input#staticAddPasswordConfirm').value;


      const searchQuery = $('#searchUser').val();
      const page = $('.page-link').data('page');
      const rowsPerPage = $('.rowsPerPage').val();
      createUser(name, email, role, password, passwordConfirm, page, rowsPerPage, searchQuery);
    }
  });

if(btnDeleteUser)
  btnDeleteUser.addEventListener('click', async () => {

    const exampleModal = document.getElementById('exampleModalDeleteUser');

    const id = exampleModal.querySelector('.modal-body input#staticDeleteId').value;

    const searchQuery = $('#searchUser').val();
    const page = $('.page-link').data('page');
    const rowsPerPage = $('.rowsPerPage').val();
    deleteUser(id, page, rowsPerPage, searchQuery);
    
  });

////
if(btnChangGuideInfor)
  btnChangGuideInfor.addEventListener('click', async () => {
    const form = btnChangGuideInfor.closest('form');
    if (form.checkValidity()) {
      const exampleModal = document.getElementById('exampleModalChangeGuideInfor');

      const userId = exampleModal.querySelector('.modal-body input#staticId').value;
      const updatedName = exampleModal.querySelector('.modal-body input#staticName').value;
      const searchQuery = $('#searchGuide').val();
      const page = $('.page-link').data('page');
      const rowsPerPage = $('.rowsPerGuidePage').val();

      updateGuideInfor(userId, updatedName, page, rowsPerPage, searchQuery);
    }
  });

if(btnChangGuidePass)
  btnChangGuidePass.addEventListener('click', async () => {
    const form = btnChangGuidePass.closest('form');
    if (form.checkValidity()) {
      const exampleModal = document.getElementById('exampleModalChangeGuideInfor');

      const userId = exampleModal.querySelector('.modal-body input#staticId').value;
      const password = exampleModal.querySelector('.modal-body input#staticPassword').value;
      const passwordConfirm = exampleModal.querySelector('.modal-body input#staticPasswordConfirm').value;


      // - console.log(userId, password, passwordConfirm)
      const searchQuery = $('#searchGuide').val();
      const page = $('.page-link').data('page');
      const rowsPerPage = $('.rowsPerGuidePage').val();
      updateGuidePassword(userId, password, passwordConfirm, page, rowsPerPage, searchQuery);
    }    
  });

if(btnAddGuide)
  btnAddGuide.addEventListener('click', async () => {
    const form = btnAddGuide.closest('form');
    if (form.checkValidity()) {

      const exampleModal = document.getElementById('exampleModalAddGuide');

      const name = exampleModal.querySelector('.modal-body input#staticAddName').value;
      const email = exampleModal.querySelector('.modal-body input#staticAddEmail').value;
      // const role = exampleModal.querySelector('.modal-body select#staticAddRole').value;
      const role = 'guide';
      const password = exampleModal.querySelector('.modal-body input#staticAddPassword').value;
      const passwordConfirm = exampleModal.querySelector('.modal-body input#staticAddPasswordConfirm').value;


      const searchQuery = $('#searchGuide').val();
      const page = $('.page-link').data('page');
      const rowsPerPage = $('.rowsPerGuidePage').val();
      createGuide(name, email, role, password, passwordConfirm, page, rowsPerPage, searchQuery);
    }
  });

if(btnDeleteGuide)
  btnDeleteGuide.addEventListener('click', async () => {

    const exampleModal = document.getElementById('exampleModalDeleteGuide');

    const id = exampleModal.querySelector('.modal-body input#staticDeleteId').value;

    const searchQuery = $('#searchGuide').val();
    const page = $('.page-link').data('page');
    const rowsPerPage = $('.rowsPerGuidePage').val();
    deleteGuide(id, page, rowsPerPage, searchQuery);
  });

if(addTourForm) {
  // Add the event listener for the "Add Tour" button
  $('#btnAddTour').on('click', function() {
    const tourData = {
      name: $('#tourName').val(),
      category: $('#categorySelect').val(),  
      duration: $('#tourDuration').val(),  
      maxGroupSize: $('#maxGroupSize').val(), 
      price: $('#tourPrice').val(),   
      priceDiscount: $('#tourPriceDiscount').val(),
      summary: $('#tourSummary').val(),  
      description: $('#tourDescription').val(), 
      imageCover: document.getElementById('tourCoverImg').files,  
      images: document.getElementById('tourImg').files,                 
      startDate: $('#tourStartDate').val(),
      // startLocation
      startLocation: {
        coordinates: $('#tourStartCoordinate').val(),
        address: $('#tourStartAddress').val(),
        description: $('#tourStartProvince').val()
      },
      country: $('#countrySelect').val(),
      provinces: [],   
      
      
      //
      guides: [],                                
      itineraries: []                             

    };

    // Collect itineraries
    $('.itinerary-item').each(function(index) {
      const itineraryItem = {
          day: index + 1,
          address: $(this).find('input[name^="itineraries"][name$="[address]"]').val(),
          coordinates: $(this).find('input[name^="itineraries"][name$="[coordinates]"]').val(),
          description: $(this).find('textarea[name^="itineraries"][name$="[description]"]').val()
      };
      tourData.itineraries.push(itineraryItem);
    });
  

    
    // Collect locations
    $('.location-item select').each(function() {
      tourData.provinces.push($(this).val());
    });

    // Collect guides
    $('.guide-item select').each(function() {
      tourData.guides.push($(this).val());
    });

    // Create FormData object to send files
    const formData = new FormData();
    formData.append('name', tourData.name);
    formData.append('category', tourData.category);
    formData.append('duration', tourData.duration);
    formData.append('maxGroupSize', tourData.maxGroupSize);
    formData.append('price', tourData.price);
    formData.append('priceDiscount', tourData.priceDiscount);
    formData.append('summary', tourData.summary);
    formData.append('description', tourData.description);
    formData.append('startDate', tourData.startDate);
    formData.append('startLocation', JSON.stringify(tourData.startLocation));

    formData.append('country', tourData.country);
    formData.append('provinces', JSON.stringify(tourData.provinces));

    formData.append('guides', JSON.stringify(tourData.guides));
    formData.append('itineraries', JSON.stringify(tourData.itineraries));
    
    // Append files
    const imageCover = document.getElementById('tourCoverImg').files[0];
    if (imageCover) {
      formData.append('imageCover', imageCover);
    }

    const images = document.getElementById('tourImg').files;
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    // Create FormData object to send files
    // const formData = new FormData();
    // for (const key in tourData) {
    //   if (key === 'imageCover') {
    //     formData.append('imageCover', tourData[key]);
    //   } else if (key === 'images') {
    //     tourData[key].forEach((file, index) => {
    //       formData.append(`images[${index}]`, file);
    //     });
    //   } else if (typeof tourData[key] === 'object' && !Array.isArray(tourData[key])) {
    //     formData.append(key, JSON.stringify(tourData[key]));
    //   } else if (Array.isArray(tourData[key])) {
    //     formData.append(key, JSON.stringify(tourData[key]));
    //   } else {
    //     formData.append(key, tourData[key]);
    //   }
    // }

    // Create FormData object to send files
    // const formData = new FormData();
    // for (const key in tourData) {
    //   if (key === 'imageCover') {
    //     formData.append('imageCover', tourData[key]);
    //   } else if (key === 'images') {
    //     if (Array.isArray(tourData[key])) {
    //       tourData[key].forEach((file, index) => {
    //         formData.append(`images[${index}]`, file);
    //       });
    //     }
    //   } else if (typeof tourData[key] === 'object' && !Array.isArray(tourData[key])) {
    //     formData.append(key, JSON.stringify(tourData[key]));
    //   } else if (Array.isArray(tourData[key])) {
    //     formData.append(key, JSON.stringify(tourData[key]));
    //   } else {
    //     formData.append(key, tourData[key]);
    //   }
    // }
    // console.log(',,,,,,,', tourData.itineraries)

    // $.ajax({
    //   url: '/api/v1/tours',
    //   method: 'POST',
    //   data: formData,
    //   processData: false,
    //   contentType: false,
    //   success: function(response) {
    //     alert('Tour added successfully!');
    //     // Optionally, refresh the page or update the UI to reflect the new tour
    //   },
    //   error: function(error) {
    //     // alert(error);
    //     // Convert the error object to a string to see the details
    //     const errorMessage = JSON.stringify(error, null, 2);
    //     alert('Error: ' + errorMessage);
    //     // console.error(error);
    //   }
    // });

    const searchQuery = $('#searchTour').val();
    const page = $('.page-link').data('page');
    const rowsPerTourPage = $('.rowsPerTourPage').val();
    createTour(formData, page, rowsPerTourPage, searchQuery)

    // Send AJAX request to save the tour
    // $.ajax({
    //   url: '/api/v1/tours',
    //   method: 'POST',
    //   contentType: 'application/json',
    //   data: JSON.stringify(tourData),
    //   success: function(response) {
    //     alert('Tour added successfully!');
    //     location.reload(); // Reload the page or redirect to another page
    //   },
    //   error: function(xhr, status, error) {
    //     alert('Failed to add tour: ' + error);
    //   }
    // });
    // console.log(tourData)
  });

  $('#btnSaveTour').on('click', function() {
    const tourData = {
      name: $('#tourName').val(),
      category: $('#categorySelect').val(),  
      duration: $('#tourDuration').val(),  
      maxGroupSize: $('#maxGroupSize').val(), 
      price: $('#tourPrice').val(),   
      priceDiscount: $('#tourPriceDiscount').val(),
      summary: $('#tourSummary').val(),  
      description: $('#tourDescription').val(), 
      imageCover: document.getElementById('tourCoverImg').files,  
      images: document.getElementById('tourImg').files,                 
      startDate: $('#tourStartDate').val(),
      // startLocation
      startLocation: {
        coordinates: $('#tourStartCoordinate').val(),
        address: $('#tourStartAddress').val(),
        description: $('#tourStartProvince').val()
      },
      country: $('#countrySelect').val(),
      provinces: [],   
      
      
      //
      guides: [],                                
      itineraries: []                             

    };

    // Collect itineraries
    $('.itinerary-item').each(function(index) {
      const itineraryItem = {
          day: index + 1,
          address: $(this).find('input[name^="itineraries"][name$="[address]"]').val(),
          coordinates: $(this).find('input[name^="itineraries"][name$="[coordinates]"]').val(),
          description: $(this).find('textarea[name^="itineraries"][name$="[description]"]').val()
      };
      tourData.itineraries.push(itineraryItem);
    });
  

    
    // Collect locations
    $('.location-item select').each(function() {
      tourData.provinces.push($(this).val());
    });

    // Collect guides
    $('.guide-item select').each(function() {
      tourData.guides.push($(this).val());
    });

    // Create FormData object to send files
    const formData = new FormData();
    formData.append('name', tourData.name);
    formData.append('category', tourData.category);
    formData.append('duration', tourData.duration);
    formData.append('maxGroupSize', tourData.maxGroupSize);
    formData.append('price', tourData.price);
    formData.append('priceDiscount', tourData.priceDiscount);
    formData.append('summary', tourData.summary);
    formData.append('description', tourData.description);
    formData.append('startDate', tourData.startDate);
    formData.append('startLocation', JSON.stringify(tourData.startLocation));

    formData.append('country', tourData.country);
    formData.append('provinces', JSON.stringify(tourData.provinces));

    formData.append('guides', JSON.stringify(tourData.guides));
    formData.append('itineraries', JSON.stringify(tourData.itineraries));
    
    // Append files
    const imageCover = document.getElementById('tourCoverImg').files[0];
    if (imageCover) {
      formData.append('imageCover', imageCover);
    }

    const images = document.getElementById('tourImg').files;
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    const tourId = $('#tourId').val()
    // console.log("id", tourId)
    const searchQuery = $('#searchTour').val();
    const page = $('.page-link').data('page');
    const rowsPerTourPage = $('.rowsPerTourPage').val();

    saveTour(tourId, formData, page, rowsPerTourPage, searchQuery)

  });
}


if(btnDeleteTour)
  btnDeleteTour.addEventListener('click', async () => {
    console.log('delete tour clicked')

    const exampleModal = document.getElementById('exampleModalDeleteTour');

    const id = exampleModal.querySelector('.modal-body input#deleteTourId').value;

    const searchQuery = $('#searchGuide').val();
    const page = $('.page-link').data('page');
    const rowsPerPage = $('.rowsPerTourPage').val();
    deleteTour(id, page, rowsPerPage, searchQuery);
  });


