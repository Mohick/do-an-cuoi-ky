const heartMain = (container: HTMLElement, navigate: (str: string) => void) => {
  const handleScroll = () => {
    const bottomPos = Math.round(container.getBoundingClientRect().bottom);
    const screenHeight = window.innerHeight;
    if (bottomPos <= screenHeight) {
      // navigate("/back");
    }
  };

  document.addEventListener("scrollend", handleScroll);

  return () => {
    document.removeEventListener("scrollend", handleScroll);
  };
};

export { heartMain };
