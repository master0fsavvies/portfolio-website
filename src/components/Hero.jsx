import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const [debugLogs, setDebugLogs] = useState([]);

  const videoRef = useRef(null);
  const videoStarted = useRef(false);

  const videoSrc = "/portfolio-website/videos/Hero.mp4";

  const debugEnabled = new URLSearchParams(
    window.location.search
  ).has("debug");

  const addDebugLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();

    const logMessage = data
      ? `${timestamp} - ${message}: ${JSON.stringify(data)}`
      : `${timestamp} - ${message}`;

    console.log(logMessage);

    setDebugLogs((previousLogs) => [
      ...previousLogs.slice(-20),
      logMessage,
    ]);
  };

  const handleVideoMetadata = (event) => {
    const video = event.currentTarget;

    addDebugLog("Metadata loaded", {
      duration: video.duration,
      readyState: video.readyState,
      networkState: video.networkState,
    });

    // Important:
    // Hide the loading screen when metadata is ready.
    // Mobile Safari may not load the first frame until playback begins.
    setLoading(false);
  };

  useEffect(() => {
    addDebugLog("Loading state changed", { loading });

    // Start the video only after the loading screen disappears
    if (!loading && videoRef.current && !videoStarted.current) {
      const video = videoRef.current;

      videoStarted.current = true;
      video.currentTime = 0;

      addDebugLog("Attempting to play video", {
        src: video.currentSrc || video.src,
        readyState: video.readyState,
        networkState: video.networkState,
      });

      video
        .play()
        .then(() => {
          addDebugLog("Video started successfully");
        })
        .catch((error) => {
          addDebugLog("Video play failed", {
            message: error.message,
          });

          console.error("Video play failed:", error);
        });
    }
  }, [loading]);

  useEffect(() => {
    addDebugLog("Component rendered", {
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

      {debugEnabled && (
        <pre className="fixed bottom-0 left-0 z-[9999] max-h-[50vh] w-full overflow-auto bg-black p-3 text-xs text-green-400">
          {debugLogs.join("\n")}
        </pre>
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
            addDebugLog("Video loading started", {
              src: event.currentTarget.currentSrc,
            });
          }}
          onLoadedMetadata={handleVideoMetadata}
          onLoadedData={(event) => {
            addDebugLog("Video data loaded", {
              readyState: event.currentTarget.readyState,
              networkState: event.currentTarget.networkState,
            });
          }}
          onCanPlay={(event) => {
            addDebugLog("Video can play", {
              readyState: event.currentTarget.readyState,
              networkState: event.currentTarget.networkState,
            });
          }}
          onCanPlayThrough={(event) => {
            addDebugLog("Video can play through", {
              readyState: event.currentTarget.readyState,
              networkState: event.currentTarget.networkState,
            });
          }}
          onProgress={(event) => {
            const video = event.currentTarget;

            addDebugLog("Video progress", {
              readyState: video.readyState,
              networkState: video.networkState,
              buffered:
                video.buffered.length > 0
                  ? video.buffered.end(
                      video.buffered.length - 1
                    )
                  : 0,
            });
          }}
          onWaiting={(event) => {
            addDebugLog("Video waiting", {
              currentTime: event.currentTarget.currentTime,
            });
          }}
          onPlaying={(event) => {
            addDebugLog("Video is playing", {
              currentTime: event.currentTarget.currentTime,
            });
          }}
          onStalled={() => {
            addDebugLog("Video stalled");
          }}
          onSuspend={() => {
            addDebugLog("Video suspended");
          }}
          onError={(event) => {
            const video = event.currentTarget;

            addDebugLog("VIDEO ERROR", {
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