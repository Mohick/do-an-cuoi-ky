import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const animationIntroduction = (container: HTMLElement) => {
  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(container);

    // ScrollTrigger timeline cho việc xuất hiện các thành phần
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top", // Bắt đầu khi cạnh trên của Intro chạm mốc 70% chiều cao màn hình
        end: "+=600%", // Tăng không gian cuộn lên 600% vì có nhiều nội dung hơn
        scrub: 1, // Đổi thành 1 (hoặc true) để animation chạy đồng bộ theo từng pixel bạn cuộn chuột
        pin: true, // GHIM LẠI ở giữa màn hình khi cuộn
      },
    });

    // 1. Dòng chữ đầu tiên xuất hiện (Phóng to + Hiện rõ)
    tl.fromTo(
      q(".introdution-title"),
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    // 2. Dòng chữ đầu tiên mờ đi và bay lên (Tạo khoảng trống)
    tl.to(
      q(".introdution-title"),
      { scale: 1.2, opacity: 0, y: -50, duration: 1, ease: "power2.in" }
    );

    // 2.5 Khối vuông trắng bùng nổ để làm nền mới
    tl.fromTo(
      q("#white-box"),
      { scale: 0, opacity: 1, borderRadius: "20%" }, // Khối vuông hơi bo tròn lúc đầu
      { scale: 150, borderRadius: "0%", duration: 1, ease: "power2.inOut" },
      "-=0.5" // Bùng ra ngay lúc chữ đang mờ đi
    );

    // 3. Khối giới thiệu TASK MANAGER xuất hiện
    tl.fromTo(
      q(".introdution-content"),
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
    tl.to(q(".introdution-content"), { scale: 1.2, opacity: 0, y: -50, duration: 1, ease: "power2.in" });

    // 4. Khối tính năng 1 xuất hiện
    tl.fromTo(
      q(".introdution-feature-1"),
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
    tl.to(q(".introdution-feature-1"), { scale: 1.2, opacity: 0, y: -50, duration: 1, ease: "power2.in" });

    // 5. Khối tính năng 2 xuất hiện
    tl.fromTo(
      q(".introdution-feature-2"),
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
    tl.to(q(".introdution-feature-2"), { scale: 1.2, opacity: 0, y: -50, duration: 1, ease: "power2.in" });

    // 6. Khối tính năng 3 xuất hiện
    tl.fromTo(
      q(".introdution-feature-3"),
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
    tl.to(q(".introdution-feature-3"), { scale: 1.2, opacity: 0, y: -50, duration: 1, ease: "power2.in" });

    // 7. Khối tính năng 4 (Miễn phí) xuất hiện và ở lại cuối cùng
    tl.fromTo(
      q(".introdution-feature-4"),
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );
  }, container);

  return ctx;
};

export { animationIntroduction };
