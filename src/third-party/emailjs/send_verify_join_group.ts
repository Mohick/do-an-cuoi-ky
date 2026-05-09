export const sendGroupInvitationEmail = async (
  toEmail: string, 
  inviterName: string, 
  groupName: string, 
  url: string
): Promise<void> => {
  const data = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    // ID của template lời mời nhóm mới tạo trên EmailJS
    template_id: process.env.EMAILJS_TEMPLATE_ID_GROUP_INVITATION, 
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      to_email: toEmail,
      inviter_name: inviterName,
      group_name: groupName,
      accept_link: url, // Link dẫn tới trang chấp nhận tham gia nhóm
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
    
    console.log(`✅ [EmailJS] Đã gửi lời mời tham gia nhóm ${groupName} thành công!`);
  } catch (error) {
    console.error("❌ [EmailJS] Lỗi gửi mail mời nhóm:", error);
  }
};