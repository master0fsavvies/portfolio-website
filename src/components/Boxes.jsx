import React from 'react'
import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";

const BentoTilt = ({ children, className = ""}) => {
    const [transformStyle, setTransformStyle] = useState("");
    const itemRef = useRef(null);

    const handleMouseMove = (event) => {
        if(!itemRef.current) return;
        const {left, top, width, height } = itemRef.current.getBoundingClientRect();

        const relativeX = (event.clientX - left) / width;
        const relativeY = (event.clientY - top) / height;

        const tiltX = (relativeY - 0.5) * 10;
        const tiltY = (relativeX - 0.5) * -10;

        const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`
        setTransformStyle(newTransform);
    };

    const handleMouseLeave = () => { setTransformStyle(""); };

    return (
        <div
            ref={itemRef}
            className = {className}
            onMouseMove = {handleMouseMove}
            onMouseLeave = {handleMouseLeave}
            style = {{transform: transformStyle }}
        >
            {children}
        </div>
    );
};

const BentoCard = ({ src, title, description, isComingSoon }) => {
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const [hoverOpacity, setHoverOpacity] = useState(0);
    const hoverButtonRef = useRef(null);

    const handleMouseMove = (event) => {
        if(!hoverButtonRef.current) return;
        const rect = hoverButtonRef.current.getBoundingClientRect();

        setCursorPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        });
    };

    const handleMouseEnter = () => setHoverOpacity(1);
    const handleMouseLeave = () => setHoverOpacity(0);
    

    return (
        <div className="relative size-full">
            <video
                src = {src}
                loop
                muted
                autoPlay
                className="absolute left-0 top-0 size-full object-cover object-center"
            />
            <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
                <h1 className="bento-title special-font">{title}</h1>
                {description && (
                    <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
                )}
            </div>
        </div>
    )
}

const Features = () => {
  return (
    <section className="bg-black pb-52">
        <div className="container mx-auto px-3 md:px-10">
            <div className="px-5 py-32">
                <p className="font-circular-web text-lg text-blue-50">About Me</p>
                <p className = "max-w-md font-circular-web text-md text-blue-50 opacity-50">
                    I'm a Computer Science student at SDSU, specializing in 3D programming, modeling, and animating. 
                    I also try to keep my self well rounded by learning skills on my own time: 
                    like electrical engineering, building computers, and carpentry. 
                    <br></br>I also like cat videos.
                </p>
            </div>

            <BentoTilt className = "border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
                <BentoCard 
                    src="/assets/videos/Particles.mp4"
                    title={<>3D in Blender</>}
                    description = "My favorite 3D software is Blender, it is a free and open-source program that can 3D model, rig, animate, do vfx, physics, and even stuff in 2D as well."
                />
            </BentoTilt>

            <div className = "grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
                <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
                    <BentoCard 
                        src="/assets/videos/Arcade.mp4"
                        title={<>Arcade Repair</>}
                        description = "On the side, I fix old arcade machines."
                    />
                </BentoTilt>

                <BentoTilt className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
                    <BentoCard 
                        src="/assets/videos/BongoCat.mp4"
                        title={<>Programming</>}
                        description = "I have been studying Computer Science for 4 years now, my favorite language is JavaScript."
                    />
                </BentoTilt>

                <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
                    <BentoCard 
                        src="/assets/videos/GameDev.mp4"
                        title={<>Arcade Dev</>}
                        description = "Working solo on a custom arcade machine, 'Shotgun Wedding', coming to San Diego!"
                    />
                </BentoTilt>

                <BentoTilt className="bento-tilt_2">
                    <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
                        <h1 className="bento-title special-font max-w-64 text-black">
                            M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
                        </h1>
                        <TiLocationArrow className="m-5 scale-[5] self-end" />
                    </div>
                </BentoTilt>

                <BentoTilt className="bento-tilt_2">
                    <video
                        src="/assets/videos/Ecclesia.mp4"
                        loop
                        muted
                        autoPlay
                        className="size-full object-cover object-center"
                    />
                </BentoTilt>
            </div>
        </div>
    </section>
  )
}

export default Features