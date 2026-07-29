const heartMain = (container: HTMLElement, navigate: (str: string) => void) => {
  const handleScroll = () => {
    // const bottomPos = Math.round(container.getBoundingClientRect().bottom);
    // const screenHeight = window.innerHeight;

    if (false) {
      console.log(container);

      navigate("/back");
    }
  };

  document.addEventListener("scrollend", handleScroll);

  return () => {
    document.removeEventListener("scrollend", handleScroll);
  };
};

export { heartMain };
