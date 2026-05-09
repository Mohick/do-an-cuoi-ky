export const sendEmailVerifyAccount = async (toEmail: string, verifyUrl: string): Promise<void> => {
  // Gom dữ liệu theo cấu trúc của EmailJS API
  const data = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID_VERIFY_ACCOUNT,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY, // Private Key để authenticate từ Backend
    template_params: {
      to_email: toEmail,
      verify_link: verifyUrl,
      project_name: "Task Manager",
    },
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS Error: ${errorText}`);
    }
    console.log("✅ [EmailJS] Đã gửi mail thành công!");
  } catch (error) {
    // Log lỗi để check trên Render Logs
    console.error("❌ [EmailJS] Lỗi gửi mail:", error);
  }
};