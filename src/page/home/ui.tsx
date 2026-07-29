import { useEffect, useRef } from "react";
import { heartMain } from "./service";
import { Outlet, useNavigate } from "react-router-dom";
const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (containerRef.current) {
      return heartMain(containerRef.current as HTMLDivElement, navigate);
    }
  }, []);

  return (
    <main ref={containerRef} className="overflow-x-hidden">
      <Outlet />
    </main>
  );
};

export default HomePage;
