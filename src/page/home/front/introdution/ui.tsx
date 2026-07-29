import { useLayoutEffect, useRef } from "react";
import { animationIntroduction } from "./service";

const Introduction = () => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = animationIntroduction(ref.current as HTMLDivElement);
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative z-10 w-full flex flex-col items-center justify-center min-h-screen overflow-hidden"
      ref={ref}
    >
      <h2 className="introdution-title absolute text-4xl md:text-7xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-blue-100 drop-shadow-lg px-4">
        Bạn cần một công cụ<br />quản lý dự án ư?
      </h2>
      {/* Khối vuông trắng sẽ bung ra làm nền */}
      <div id="white-box" className="absolute w-10 h-10 bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[-1]" style={{ opacity: 0 }}></div>

      <div className="introdution-content absolute flex flex-col items-center text-center px-4 w-full pointer-events-none">
        <h4 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-600 drop-shadow-md mb-6">
          Chúng tôi có gì?
        </h4>
        <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl">
          Nền tảng tuyệt vời nhất để biến mọi ý tưởng thành hiện thực.
        </p>
      </div>

      {/* Các khối tính năng nổi bật sẽ lần lượt xuất hiện */}
      <div className="introdution-feature-1 absolute flex flex-col md:flex-row items-center justify-between px-8 w-full max-w-6xl pointer-events-none">
        <div className="w-full md:w-1/2 text-left pr-8">
          <h4 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 drop-shadow-md mb-4">
            Quản Lý Thời Gian Thực
          </h4>
          <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl">
            Đồng bộ hóa dữ liệu task ngay lập tức. Mọi thay đổi đều được cập nhật real-time trên mọi thiết bị.
          </p>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0 shadow-2xl rounded-2xl overflow-hidden border border-purple-500/30">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Dashboard" className="w-full h-auto object-cover opacity-90" />
        </div>
      </div>

      <div className="introdution-feature-2 absolute flex flex-col md:flex-row-reverse items-center justify-between px-8 w-full max-w-6xl pointer-events-none">
        <div className="w-full md:w-1/2 text-right pl-8">
          <h4 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 drop-shadow-md mb-4">
            Phân Quyền Chặt Chẽ
          </h4>
          <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl ml-auto">
            Hệ thống bảo mật và phân quyền linh hoạt, đảm bảo đúng người đúng việc, an toàn tuyệt đối.
          </p>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0 shadow-2xl rounded-2xl overflow-hidden border border-orange-500/30">
          <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80" alt="Security" className="w-full h-auto object-cover opacity-90" />
        </div>
      </div>

      <div className="introdution-feature-3 absolute flex flex-col md:flex-row items-center justify-between px-8 w-full max-w-6xl pointer-events-none">
        <div className="w-full md:w-1/2 text-left pr-8">
          <h4 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600 drop-shadow-md mb-4">
            Chia Task Cho Thành Viên
          </h4>
          <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl">
            Giao việc dễ dàng chỉ với vài click chuột. Tối ưu hóa hiệu suất làm việc nhóm.
          </p>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-0 shadow-2xl rounded-2xl overflow-hidden border border-rose-500/30">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Teamwork" className="w-full h-auto object-cover opacity-90" />
        </div>
      </div>

      <div className="introdution-feature-4 absolute flex flex-col items-center text-center px-4 w-full pointer-events-none">
        <h4 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-green-500 to-emerald-600 drop-shadow-xl mb-4">
          Hoàn Toàn Miễn Phí!
        </h4>
        <p className="text-xl md:text-2xl text-gray-700 font-medium max-w-2xl mb-8">
          Sử dụng tất cả các tính năng cao cấp nhất mà không tốn một xu nào.
        </p>
        <div className="w-full max-w-3xl shadow-2xl rounded-2xl overflow-hidden border border-emerald-500/30">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="Success" className="w-full h-48 md:h-80 object-cover opacity-90" />
        </div>
      </div>
    </section>
  );
};

export default Introduction;
