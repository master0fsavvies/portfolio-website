import React, { useRef, useState, useEffect } from "react";
import { useWindowScroll } from "react-use";
import gsap from "gsap";

const navItems = [
    { label: "Youtube", href: "https://www.youtube.com/@DuckyDog3D" },
    { label: "Instagram", href: "https://www.instagram.com/johnenix.nix/" },
    { label: "Github", href: "https://github.com/master0fsavvies" },
    { label: "About", href: "#about" }, 
    { label: "Contact", href: "#contact" }
];

const Navbar = () => {
    const navContainerRef = useRef(null);
    const { y: currentScrollY } = useWindowScroll();
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        if (currentScrollY === 0) {
            // Topmost position: show navbar without floating-nav
            setIsNavVisible(true);
            navContainerRef.current.classList.remove("floating-nav");
        } else if (currentScrollY > lastScrollY) {
            // Scrolling down: hide navbar and apply floating-nav
            setIsNavVisible(false);
            navContainerRef.current.classList.add("floating-nav");
        } else if (currentScrollY < lastScrollY) {
            // Scrolling up: show navbar with floating-nav
            setIsNavVisible(true);
            navContainerRef.current.classList.add("floating-nav");
        }

        setLastScrollY(currentScrollY);
    }, [currentScrollY, lastScrollY]);

    useEffect(() => {
  const handleMouseMove = (e) => {
    if (e.clientY < 50) {
      setIsNavVisible(true); // show nav when cursor is near top
    }
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);

    useEffect(() => {
        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : -100,
            opacity: isNavVisible ? 1 : 0,
            duration: 0.2,
        });
    }, [isNavVisible]);

    const handleNavClick = (e, label, href) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const target = document.getElementById(href.slice(1));
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    return (
        <div className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-t"
            ref={navContainerRef}>
            <header className="absolute top-1/2 w-full -translate-y-1/2">
                <nav className="flex size-full items-center justify-between p-4">
                    <div className="flex items-center gap-7">
                        <img src="/portfolio-website/img/logo.png" alt="logo" className="w-10" />
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        {navItems.map(({ label, href }) => (
                            <a 
                                key={label} 
                                href={href} 
                                className="nav-hover-btn"
                                target={href.startsWith("http") ? "_blank" : "_self"}
                                rel={href.startsWith("http") ? "noopener noreferrer" : ""}
                                onClick={(e) => handleNavClick(e, label, href)}
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Navbar;