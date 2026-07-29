import { useLayoutEffect, useRef } from "react";
import { animetionSlogan } from "./service";
import { Link } from "react-router-dom";

const Slogan = () => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = animetionSlogan(ref.current as HTMLDivElement);
    // ctx.revert() sẽ xoá sạch mọi CSS nội tuyến mà GSAP đã thêm vào khi component bị unmount (hoặc reload)
    return () => ctx.revert();
  }, []);
  return (
    <section
      className="flex flex-col relative z-0 items-center justify-center min-h-screen"
      ref={ref}
    >
      <h1 id="title-slogan" className="text-7xl font-bold">
        TASK MANAGER
      </h1>
      <Link to={"/auth"}>
        <button
          id="btn-start"
          className="mt-8 bg-slate-950 text-white px-8 py-3 rounded-btn font-bold text-lg shadow-lg hover:opacity-80 transition-opacity"
          onClick={() => {
            ref.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Bắt Đầu
        </button>

        {/* Quả bóng màu xanh đen dùng để làm hiệu ứng nhuộm màu màn hình */}
        <div
          id="black-ball"
          className="w-10 h-10 bg-slate-950 rounded-full absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ opacity: 0 }} // Mặc định tàng hình
        ></div>
      </Link>
    </section>
  );
};

export default Slogan;
