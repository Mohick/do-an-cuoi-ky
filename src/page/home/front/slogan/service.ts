import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const animetionSlogan = (container: HTMLElement) => {
  // Dùng gsap.context để quản lý dọn dẹp (cleanup) rất tiện lợi trong React
  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(container);

    // ----------------------------------------------------
    // TIMELINE 1: Chạy ngay lúc load trang (Không có ScrollTrigger)
    // ----------------------------------------------------
    const loadTl = gsap.timeline();

    loadTl.fromTo(
      q("#title-slogan"),
      {
        opacity: 0,
        clipPath: "polygon(20% 40%, 80% 20%, 70% 80%, 30% 60%)",
        scale: 0.5,
      },
      {
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.5,
        scale: 1,
        ease: "power2.inOut",
      },
    );
    // Nút Bắt Đầu: Chuyển động qua nhiều hình polygon (móp méo -> chuẩn)
    loadTl.fromTo(
      q("#btn-start"),
      {
        opacity: 0,
        x: 50,
        // Bắt đầu bằng hình thoi vát chéo
        clipPath: "polygon(0 0%, 0 0%, 0% 0, 0% 0)",
      },
      {
        opacity: 1,
        x: -20, // Bay lố qua trái một chút
        // Biến thành hình bình hành nghiêng
        clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
        duration: 0.4,
        ease: "power2.inOut",
      },
    );

    // Bung ra hình chữ nhật hoàn chỉnh và nảy về đúng vị trí x: 0
    loadTl.to(q("#btn-start"), {
      x: 0,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.6,
      ease: "back.out(1.7)",
    });

    // ----------------------------------------------------
    // TIMELINE 2: Chạy khi cuộn chuột (Có ScrollTrigger)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=100%", // Tăng quãng đường cuộn lên 250% vì có nhiều giai đoạn hiệu ứng hơn
        scrub: 1,
        pin: true,
        pinSpacing: false, // Không sinh ra khoảng cuộn ảo, dùng chung scroll của main
      },
    });

    // GIAI ĐOẠN 1: Chữ và nút xé rách chạy ra 2 hướng
    scrollTl.fromTo(
      q("#title-slogan"),
      { opacity: 1, y: 0, scale: 1 },
      { opacity: 0, y: -1000, scale: 2, duration: 1 },
      0,
    );

    scrollTl.fromTo(
      q("#btn-start"),
      { opacity: 1, y: 0 },
      { opacity: 0, y: 1000, duration: 1, scale: 2 },
      0,
    );

    // GIAI ĐOẠN 2: Quả bóng đen rớt từ trên cao xuống GIỮA CHỪNG
    // Đặt tham số là 0.5 (tức là chạy ở giây 0.5, ngay giữa lúc chữ đang bay đi)
    scrollTl.fromTo(
      q("#black-ball"),
      { y: "50vh", opacity: 0, scale: 1 }, // Bắt đầu từ trên cao khuất màn hình
      { y: "50vh", ease: "bounce.out", duration: 1, opacity: 1 }, // Rớt dội xuống giữa màn hình
      0.01,
    );

    // GIAI ĐOẠN 3: Quả bóng đen bùng nổ nhuộm đen cả màn hình
    scrollTl.to(
      q("#black-ball"),
      { scale: 250, duration: 1.5, ease: "power2.inOut" }, // Phóng to 250 lần
      0.02, // Vẫn chạy nối tiếp ngay sau khi Giai đoạn 2 (quả bóng rớt) kết thúc
    );
  }, container);

  return ctx;
};

export { animetionSlogan };
