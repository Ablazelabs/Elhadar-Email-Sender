const express = require("express");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();

// instantiate an express app
const app = express();


//port will be 5000 for testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});


  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let trans = nodemailer.createTransport({
    host: "mail.elhadar.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "contactus@elhadar.com", // generated ethereal user
      pass: "wadeKHSz38AtEF4", // generated ethereal password
    },
  });


// verify connection configuration
// trans.verify(function (error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Server is ready to take our messages");
//     }
//   });
  app.get("/", (req, res) => { //the root for production is /send/
    console.log("get recived");
    res.status(200).send("Get Recived");
  });
  app.post("/send", (req, res) => { //for production the route is /send/send
    //1. let have the fileds
    let form = new multiparty.Form();
    let data = {};
    form.parse(req, function (err, fields) {
      console.log(fields);
      Object.keys(fields).forEach(function (property) {
        data[property] = fields[property].toString();
      });
  
      //2. You can configure the object however you want
      const mail = {
        from: '"Elhadar Contact Us 👻" <contactus@elhadar.com>', // sender address
        to: 'info@elhadar.com',
        subject: `${data.subject}`,
        text: `${data.name} <${data.email}> \n${data.message}`,
      };

      //3.send the email
      trans.sendMail(mail, (err, data) => {
        if (err) {
          console.log(err);
          res.send(JSON.stringify("Something went wrong."));
        } else {
          res.send(JSON.stringify("Email successfully sent to recipient!"));
        }
      });
    });
  });
  