import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const videoStarted = useRef(false);

  const videoSrc = "/portfolio-website/videos/Hero.mp4";

  const logVideoState = (eventName, video) => {
    console.log(`[VIDEO] ${eventName}`, {
      src: video.currentSrc || video.src,
      readyState: video.readyState,
      networkState: video.networkState,
      duration: video.duration,
      currentTime: video.currentTime,
      buffered:
        video.buffered.length > 0
          ? `${video.buffered
              .end(video.buffered.length - 1)
              .toFixed(2)} seconds`
          : "nothing buffered",
      error: video.error
        ? {
            code: video.error.code,
            message: video.error.message,
          }
        : null,
    });
  };

  const handleVideoReady = (event) => {
    console.log("[VIDEO] Video data loaded");
    logVideoState("loaded data", event.currentTarget);

    // Hide the loading screen
    setLoading(false);
  };

  useEffect(() => {
    console.log("[VIDEO] Loading state changed:", loading);

    // Start the video only after the loading screen disappears
    if (!loading && videoRef.current && !videoStarted.current) {
      const video = videoRef.current;

      console.log("[VIDEO] Attempting to play video");
      logVideoState("before play", video);

      videoStarted.current = true;
      video.currentTime = 0;

      video
        .play()
        .then(() => {
          console.log("[VIDEO] Video started successfully");
          logVideoState("after play", video);
        })
        .catch((error) => {
          console.error("[VIDEO] Play failed:", error);
          logVideoState("play failed", video);
        });
    }
  }, [loading]);

  useEffect(() => {
    console.log("[VIDEO] Component rendered", {
      videoSrc,
      currentPage: window.location.href,
      baseUrl: import.meta.env.BASE_URL,
    });
  }, []);

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });

    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden bg-black">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <h1 className="special-font hero-heading absolute bottom-5 right-5 z-1 text-violet-300">
        IN 3D
      </h1>

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          preload="auto"
          className="absolute left-0 top-0 size-full object-cover object-center"
          onLoadStart={(event) => {
            console.log("[VIDEO] Loading started");
            logVideoState("loadstart", event.currentTarget);
          }}
          onLoadedMetadata={(event) => {
            console.log("[VIDEO] Metadata loaded");
            logVideoState("metadata loaded", event.currentTarget);
          }}
          onLoadedData={handleVideoReady}
          onCanPlay={(event) => {
            console.log("[VIDEO] Video can play");
            logVideoState("can play", event.currentTarget);
          }}
          onCanPlayThrough={(event) => {
            console.log("[VIDEO] Video can play through");
            logVideoState("can play through", event.currentTarget);
          }}
          onProgress={(event) => {
            logVideoState("progress", event.currentTarget);
          }}
          onWaiting={(event) => {
            console.log("[VIDEO] Video is waiting");
            logVideoState("waiting", event.currentTarget);
          }}
          onPlaying={(event) => {
            console.log("[VIDEO] Video is playing");
            logVideoState("playing", event.currentTarget);
          }}
          onStalled={(event) => {
            console.warn("[VIDEO] Video stalled");
            logVideoState("stalled", event.currentTarget);
          }}
          onSuspend={(event) => {
            console.warn("[VIDEO] Video suspended");
            logVideoState("suspend", event.currentTarget);
          }}
          onError={(event) => {
            const video = event.currentTarget;

            console.error("[VIDEO] VIDEO ERROR", {
              src: video.currentSrc,
              errorCode: video.error?.code,
              errorMessage: video.error?.message,
            });

            setLoading(false);
          }}
        />

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          IN 3D
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-75">
              Creating
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Coding, programming, and animating in 3D
            </p>

            <Button
              id="watch-trailer"
              title="Watch More"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-violet-300 flex-center gap-1"
              href="https://www.youtube.com/@DuckyDog3D"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;