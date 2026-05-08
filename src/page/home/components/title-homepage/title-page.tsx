import React from "react";
import { motion } from "framer-motion";
import type { PropsSubTitleHomePage, PropsTitleHomePage } from "./props-title-homepage";

/* ------------------ Exported Types ------------------ */


/* ------------------ Variants ------------------ */
const fadeUpVariant = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  },
});

/* ------------------ Sub Components ------------------ */
function TitleHomePageCPN({ text, className = "" }: PropsTitleHomePage) {
  return (
    <h1
      className={`text-3xl md:text-7xl uppercase font-bold w-full text-white ${className}`}
    >
      {text.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {line.split("").map((char, charIndex) => (
            <motion.span
              key={`${lineIndex}-${charIndex}`}
              className={`inline-block ${lineIndex >= 1 ? "text-[#ffb900]" : ""
                }`}
              variants={fadeUpVariant(lineIndex * 0.5 + charIndex * 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {char} {!char.trim() && <span className="p-1"></span>}
            </motion.span>
          ))}
          <br />
        </React.Fragment>
      ))}
    </h1>
  );
}

function SubTitleHomePage({ text, className = "" }: PropsSubTitleHomePage) {
  return (
    <h2
      className={`text-base md:text-3xl text-center text-wrap font-bold w-full text-white ${className}`}
    >
      {text.split(" ").map((line, lineIndex) => (
        line.trim() && <motion.span
          key={lineIndex}
          className="inline-block mr-2 text-wrap"
          variants={fadeUpVariant(lineIndex * 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}

        >
          {line}
        </motion.span>
      ))}
    </h2>
  );
}

/* ------------------ Main Component ------------------ */
interface TitlePageProps {
  title: PropsTitleHomePage;
  subTitle: PropsSubTitleHomePage;
  className?: string;
}

export default function TitlePage({
  title,
  subTitle,
  className = "",
}: TitlePageProps) {
  return (
    <div className={`w-full space-y-2 ${className}`}>
      <TitleHomePageCPN {...title} />
      <SubTitleHomePage {...subTitle} />
    </div>
  );
}
