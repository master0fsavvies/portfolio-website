import React, { useState, useRef } from 'react';
import { TiLocationArrow } from "react-icons/ti";
import { Canvas } from '@react-three/fiber';
import ParticleScene from './ParticleScene';

const Particles = () => {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 100, near: 0.1, far: 100, position: [0, 0, 10] }}
      style={{ background: "#101010" }}
    >
      <ambientLight />
      <ParticleScene />
    </Canvas>
  );
};

const BentoTilt = ({ children, className = "", disableTilt = false }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current || disableTilt) return;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 10;
    const tiltY = (relativeX - 0.5) * -10;
    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    if (!disableTilt) setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

const BentoCanvas = ({ title, description, scene: SceneComponent }) => {
  return (
    <div className="relative size-full">
      <div className="absolute inset-0">
        <SceneComponent />
      </div>
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <h1 className="bento-title special-font">{title}</h1>
        {description && (
          <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
        )}
      </div>
    </div>
  );
};

const BentoCard = ({ src, title, description }) => {
  return (
    <div className="relative size-full">
      <video
        src={src}
        loop
        muted
        autoPlay
        playsInline
        webkit-playsinline=""
        preload="metadata"
        className="absolute left-0 top-0 size-full object-cover object-center"
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <h1 className="bento-title special-font">{title}</h1>
        {description && (
          <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
        )}
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section className="bg-black pb-20">
      <div className="container mx-auto px-3 md:px-10">
        <div id="about" className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">About Me</p>
          <p className="max-w-md font-circular-web text-md text-blue-50 opacity-50">
            I have a Bachelor's in Computer Science student at SDSU, and I have been admitted to San Diego State University's Master's program in Artificial Intelligence and Technology.
            I specialize in 3D programming, modeling, and animating.
            I do things like electrical engineering, building computers, stock trading, study philosophy, and watch cat videos.
          </p>
        </div>

        <BentoTilt 
          className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh] z-10" 
          disableTilt
          /* onClick={() => window.open("https://your-link.com", "_blank")} */
        >
          <BentoCanvas
            title={<>3D Experiences</>}
            description="Combining 3D graphics and code enables the creation of dynamic interactive experiences."
            scene={Particles}
          />
        </BentoTilt>

        <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt 
            className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2 z-10"
            /* onClick={() => window.open("https://github.com/master0fsavvies", "_blank")} */
          >
            <BentoCard 
              src="/portfolio-website/videos/Arcade.mp4#t=0.1"
              title={<>Arcade Repair</>}
              description=""
            />
          </BentoTilt>

          <BentoTilt 
            className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0 z-10"
            /* onClick={() => window.open("https://your-programming-link.com", "_blank")} */
          >
            <BentoCard 
              src="/portfolio-website/videos/BongoCat.mp4#t=0.1"
              title={<>Programming</>}
              description=""
            />
          </BentoTilt>

          <BentoTilt 
            className="bento-tilt_1 me-14 md:col-span-1 md:me-0 z-10"
            /* onClick={() => window.open("https://your-motion-link.com", "_blank")} */
          >
            <BentoCard 
              src="/portfolio-website/videos/Guitar.mp4#t=0.1"
              title={<>Advanced Rigging</>}
              description=""
            />
          </BentoTilt>

          <BentoTilt 
            className="bento-tilt_2 z-10"
            /* onClick={() => window.open("https://your-future-link.com", "_blank")} */
          >
            <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
              <h1 className="bento-title special-font max-w-64 text-black">
                M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
              </h1>
              <TiLocationArrow className="m-5 scale-[5] self-end" />
            </div>
          </BentoTilt>

          <BentoTilt 
            className="bento-tilt_2 z-10 cursor-pointer hover:scale-105 transition"
          >
            <video
              src="/portfolio-website/videos/danceloop.mp4#t=0.1"
              loop
              muted
              autoPlay
              playsInline
              webkit-playsinline=""
              preload="metadata"
              className="size-full object-cover object-center"
              onClick={() => window.open("https://www.youtube.com/watch?v=bBJKls-r-p4", "_blank")}
            />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default Features;