import { useLayoutEffect, useRef } from "react";
import { animetionEndSlice } from "./service";
import { Link } from "react-router-dom";

const EndSlice = () => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = animetionEndSlice(ref.current as HTMLDivElement);
    // ctx.revert() sẽ xoá sạch mọi CSS nội tuyến mà GSAP đã thêm vào khi component bị unmount (hoặc reload)
    return () => ctx.revert();
  }, []);
  return (
    <section
      className="flex bg-white flex-col relative z-0 items-center justify-center min-h-screen"
      ref={ref}
    >
      <h1 id="title-end" className="text-7xl font-bold">
        TASK MANAGER
      </h1>
      <Link to={"/auth"}>
        <button
          id="btn-end"
          className="mt-8 bg-slate-950 text-white px-8 py-3 rounded-btn font-bold text-lg shadow-lg hover:opacity-80 transition-opacity"
          onClick={() => {
            ref.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Bắt Đầu
        </button>
      </Link>
    </section>
  );
};

export default EndSlice;
