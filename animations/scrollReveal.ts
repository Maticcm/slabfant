import gsap from "./gsap";

export const scrollReveal = (el: HTMLElement) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    }
  );
};
