
const nodemailer = require("nodemailer");

const mailClient = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "akashsarkeronline@gmail.com",
    pass: "zbihqqqshxpcbfda",
  },
});

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};

module.exports = { mailClient, sender };


