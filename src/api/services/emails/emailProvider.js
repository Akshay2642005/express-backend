const Email = require('email-templates');
const nodemailer = require('nodemailer');
const { emailConfig } = require('../../../config/vars');

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.email,
    pass: emailConfig.password,
  },
});

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.log(error);
    console.log('error with email connection');
  }
  else {
    console.log('email connection is ready');
  }
});

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: 'support@your-app.com',
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordReset',
      message: {
        to: passwordResetObject.userEmail,
      },
      locals: {
        productName: 'Test App',
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `https://your-app/new-password/view?resetToken=${passwordResetObject.resetToken}`,
      },
    })
    .catch(() => console.log('error sending password reset email'));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: 'support@your-app.com',
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordChange',
      message: {
        to: user.email,
      },
      locals: {
        productName: 'Test App',
        name: user.name,
      },
    })
    .catch(() => console.log('error sending change password email'));
};
