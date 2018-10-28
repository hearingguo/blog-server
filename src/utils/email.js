/**
 * email
 */

const config = require("../config")
const msg = require("../config/message")
const nodemailer = require("nodemailer")
const smtpTransport = require("nodemailer-smtp-transport")

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: "smtp.qq.com",
    secure: true,
    port: 465,
    auth: {
      user: config.EMAIL.account,
      pass: config.EMAIL.password
    }
  })
)

const verifyClient = () => {
  transporter.verify((error, success) => {
    if (error) {
      clientIsValid = false;
      console.warn(msg.msg_cn.mail_init_fail);
      setTimeout(verifyClient, 1000 * 60 * 60);
    } else {
      clientIsValid = true;
      console.log(msg.msg_cn.mail_init_success);
    }
  })
}

verifyClient()

const sendMail = mailOptions => {

  if (!clientIsValid) {
    console.warn(msg.msg_cn.mail_init_refuse)
    return false;
	}

	mailOptions.from = '"highya" <highyaguo@163.com>'

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.warn(msg.msg_cn.mail_send_fail, error)
    console.log(msg.msg_cn.mail_send_success, info.messageId, info.response)
  })
}

exports.sendMail = sendMail
exports.nodemailer = nodemailer
exports.transporter = transporter