import { transporter } from "./nodemailer"; // Giả định bro đã có file này

/**
 * Gửi email mời một user tham gia vào nhóm
 * @param toEmail Email người nhận lời mời
 * @param url URL (link) để chấp nhận lời mời
 * @param inviterName Tên của người gửi lời mời
 * @param groupName Tên của nhóm được mời tham gia
 */
export const templateEmailJoinGroup = async (
  toEmail: string,
  url: string,
  inviterName: string,
  groupName: string
): Promise<void> => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Lời mời tham gia nhóm - TaskManager</title>
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
        background: #4f46e5; /* Màu tím/indigo, hợp với "mời" hơn */
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
      .content h2 {
        color: #111827;
      }
      .content p {
        margin-bottom: 24px;
        line-height: 1.5;
        font-size: 15px;
      }
      .button {
        display: inline-block;
        background: #4f46e5; /* Cập nhật màu nút */
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
        <h2>Bạn được mời tham gia một nhóm</h2>
        <p>
          Chào bạn,<br />
          <b>${inviterName}</b> đã mời bạn tham gia nhóm <b>${groupName}</b> trên TaskManager.
          <br />
          Vui lòng nhấn vào nút bên dưới để chấp nhận lời mời.
        </p>
        <a href="${url}" class="button">Chấp nhận lời mời</a>
        <p style="margin-top: 24px; font-size: 14px; color: #555;">
          Nếu bạn không thực hiện yêu cầu này hoặc không biết người mời,
          vui lòng bỏ qua email này.
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
    subject: `Bạn được mời tham gia nhóm "${groupName}" - TaskManager`,
    html: htmlContent,
  });
};