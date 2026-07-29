import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const animetionEndSlice = (container: HTMLElement) => {
  // Dùng gsap.context để quản lý dọn dẹp (cleanup) rất tiện lợi trong React
  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(container);
    const startTitlePoint = gsap.timeline();
    startTitlePoint.to(q("#title-end"), {
      y: -1000,
      ease: "power2.inOut",
      scale: 2,
    });
    startTitlePoint.to(q("#btn-end"), {
      y: 1000,
      scale: 2,
      ease: "power2.inOut",
    });
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "0% top",
        end: "+=100%", // Tăng quãng đường cuộn lên 250% vì có nhiều giai đoạn hiệu ứng hơn
        scrub: 1,
        pin: true,
        pinSpacing: true, // Không sinh ra khoảng cuộn ảo, dùng chung scroll của main
      },
    });
    scrollTl.to(
      q("#title-end"),
      {
        y: 0,
        ease: "power2.inOut",
        scale: 1,
      },
      0.5,
    );
    scrollTl.to(
      q("#btn-end"),
      {
        y: 0,
        ease: "power2.inOut",
        scale: 1,
      },
      0.5,
    );
  }, container);

  return ctx;
};

export { animetionEndSlice };
