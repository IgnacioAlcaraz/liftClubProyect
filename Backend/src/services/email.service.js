const transporter = require("../configs/nodemailer");

const sendResetPasswordEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Restablecimiento de contraseña",
    html: `
      <h1>Recuperación de contraseña</h1>
      <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para continuar:</p>
      <h2 style="color: #6366f1; font-size: 24px; letter-spacing: 2px;">${code}</h2>
      <p>Este código expirará en 1 hora.</p>
      <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
      <br>
      <p>Saludos,</p>
      <p>El equipo de LiftClub</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente");
  } catch (error) {
    console.error("Error al enviar el correo", error);
  }
};

module.exports = { sendResetPasswordEmail };
