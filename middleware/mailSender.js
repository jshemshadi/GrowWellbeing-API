const mjml2html = require("mjml");
const nodemailer = require("nodemailer");
const path = require("path");
const pug = require("pug");

const renderEmailTemplate = ({ data, type }) => {
  const viewBase = "../view/email";
  const template = pug.compileFile(
    path.join(__dirname, viewBase, `${type}.pug`)
  );

  const mjmlPage = template(data);
  const email = mjml2html(mjmlPage);

  return email.html;
};

module.exports = {
  sendEmail: ({ type, subject, data, to, cc, bcc, attachments }) => {
    const transporter = nodemailer.createTransport({
      host: env.var.mailSenderHost,
      port: Number(env.var.mailSenderPort),
      secure: utils.toBoolean(env.var.mailSenderSecure),
      auth: {
        user: env.var.mailSenderUsername,
        pass: env.var.mailSenderPassword,
      },
    });
    const content = renderEmailTemplate({
      type,
      data,
    });
    transporter.sendMail({
      from: env.var.mailSenderUsername,
      subject,
      to,
      cc,
      bcc,
      attachments,
      html: content,
    });
  },
};
