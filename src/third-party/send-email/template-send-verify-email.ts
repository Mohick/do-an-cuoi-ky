import { transporter } from "./nodemailer";

export const templateEmailVerifyAccount = async (
    toEmail: string,
    url: string
): Promise<void> => {
    const htmlContent = `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Xác nhận Email - TaskManager</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background: #2563eb;
        color: #fff;
        text-align: center;
        padding: 24px;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
      }
      .content {
        padding: 32px 24px;
        text-align: center;
        color: #333;
      }
      .content p {
        margin-bottom: 24px;
        line-height: 1.5;
        font-size: 15px;
      }
      .button {
        display: inline-block;
        background: #2563eb;
        color: #fff;
        text-decoration: none;
        padding: 12px 28px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 16px;
      }
      .footer {
        background: #f9fafb;
        text-align: center;
        font-size: 12px;
        color: #888;
        padding: 16px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>TaskManager</h1>
      </div>
      <div class="content">
        <h2>Xác nhận Email của bạn</h2>
        <p>
          Cảm ơn bạn đã đăng ký tài khoản tại <b>TaskManager</b>.<br />
          Vui lòng nhấn vào nút bên dưới để xác nhận email của bạn.
        </p>
        <a href="${url}" class="button">Xác nhận Email</a>
        <p>
          Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
        </p>
      </div>
      <div class="footer">
        &copy; 2025 TaskManager. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;

    await transporter.sendMail({
        from: `"TaskManager" <${process.env.EMAIL}>`,
        to: toEmail,
        subject: "Xác nhận Email - TaskManager",
        html: htmlContent,
    });
};
