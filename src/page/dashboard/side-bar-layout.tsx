import { Link, useLocation } from "react-router-dom";

export const TitleDashboard = ({ text }: { text: string }) => {
  return (
    <h1 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[rgba(255,185,0,0.5)] px-2 mb-3">
      {text}
    </h1>
  );
};

const SideBarLayout = ({
  listSideBar,
  name,
}: {
  listSideBar: { name: string; link: string; icon: React.ReactNode }[];
  name: string;
}) => {
  const location = useLocation();

  return (
    <div className="space-y-[2px]">
      <TitleDashboard text={name} />
      {listSideBar.map((item) => {
        const isActive =
          location.pathname.trim().toLowerCase() === item.link.trim().toLowerCase();

        return (
          <Link
            to={item.link}
            key={item.link}
            className={`
              group flex items-center gap-3 px-3 py-[9px] rounded-[10px]
              text-[13px] font-medium transition-all duration-200 relative overflow-hidden
              ${isActive
                ? "bg-[rgba(255,185,0,0.1)] text-[#ffb900] border border-[rgba(255,185,0,0.18)]"
                : "text-white/40 border border-transparent hover:bg-[rgba(255,255,255,0.04)] hover:text-white/70"
              }
            `}
          >
            {/* Active accent bar */}
            {isActive && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-[#ffb900] to-[rgba(255,185,0,0.3)]" />
            )}

            {/* Icon */}
            <span className={`flex-shrink-0 text-[15px] transition-colors duration-200 ${isActive ? "text-[#ffb900]" : "text-white/30 group-hover:text-white/50"}`}>
              {item.icon}
            </span>

            {/* Label */}
            <span className="truncate">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBarLayout;