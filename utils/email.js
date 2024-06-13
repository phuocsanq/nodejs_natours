const nodemailer = require('nodemailer');
const pug = require('pug')
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url, bookingInfo = null) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Phan Phuoc Sang <${process.env.EMAIL_FROM}>`;
    if(bookingInfo) {
      // this.tourName = bookingInfo.tourName;
      // this.startDate = bookingInfo.startDate;
      // this.duration = bookingInfo.duration;
      // this.difficulty = bookingInfo.difficulty;
      // this.price = bookingInfo.price;
      // this.quantity = bookingInfo.quantity;
      // this.qrCodeDataURL = bookingInfo.qrCodeDataURL;
      // this.bookingDate = bookingInfo.bookingDate
      this.bookingInfo = bookingInfo
    }
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    console.log("dev------------")

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    let html;
    if (this.bookingInfo) {
      html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        tourName: this.bookingInfo.tourName,
        startDate: this.bookingInfo.startDate,
        duration: this.bookingInfo.duration,
        // difficulty: this.bookingInfo.difficulty,
        price: this.bookingInfo.price,
        priceDiscount: this.bookingInfo.priceDiscount,
        quantity: this.bookingInfo.quantity,
        qrCode: this.bookingInfo.qrCode,
        bookingDate: this.bookingInfo.bookingDate,
        subject
      });
    } else {
      // Render HTML without bookingInfo
      html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject
      });
    }

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Chào mừng đến với BookingTours!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Liên kết đặt lại mật khẩu (chỉ có hiệu lực trong 10 phút)'
    );
  }

  async sendTicket() {
    await this.send(
      'ticket',
      'Xác nhận đặt tour'
    );
  }
};
