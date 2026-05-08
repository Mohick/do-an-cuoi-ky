import { transporter } from "./nodemailer";

export const templateEmailVerifyAccount = async (
    toEmail: string,
    url: string
): Promise<void> => {
    const htmlContent = `
    <a href="${url}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Xác nhận Email</a>
  `;

    await transporter.sendMail({
        from: `"TaskManager" <${process.env.EMAIL}>`,
        to: toEmail,
        subject: "Xác nhận Email - TaskManager",
        html: htmlContent,
    });
};
