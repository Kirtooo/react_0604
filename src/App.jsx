import { useRef, useState, useEffect } from "react";
import Point from "./Point";
import { getDistance, getCenter } from "./utils";

export default function App() {
  const containerRef = useRef(null);
  const startedOneFinger = useRef(false);
  const fingerMoved = useRef(false);
  const lastTouches = useRef([]);
  const lastDistance = useRef(null);
  const lastCenter = useRef(null);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [points, setPoints] = useState([]);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      startedOneFinger.current = true;
      fingerMoved.current = false;
      lastTouches.current = [e.touches[0]];
    } else if (e.touches.length === 2) {
      startedOneFinger.current = false;
      lastDistance.current = getDistance(e.touches[0], e.touches[1]);
      lastCenter.current = getCenter(e.touches[0], e.touches[1]);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      fingerMoved.current = true;
    }

    if (e.touches.length === 2) {
      e.preventDefault();
      fingerMoved.current = true;

      const newDistance = getDistance(e.touches[0], e.touches[1]);
      const newCenter = getCenter(e.touches[0], e.touches[1]);

      const zoomFactor = newDistance / lastDistance.current;
      const prevScale = scale;
      const newScale = Math.max(0.5, Math.min(2, prevScale * zoomFactor));
      const scaleDelta = newScale / prevScale;

      const panDx = newCenter.x - lastCenter.current.x;
      const panDy = newCenter.y - lastCenter.current.y;

      const dx = (translate.x + panDx - newCenter.x) * scaleDelta + newCenter.x;
      const dy = (translate.y + panDy - newCenter.y) * scaleDelta + newCenter.y;

      setScale(newScale);
      setTranslate({ x: dx, y: dy });

      lastDistance.current = newDistance;
      lastCenter.current = newCenter;
    }
  };

  const handleTouchEnd = (e) => {
    if (
      startedOneFinger.current &&
      !fingerMoved.current &&
      e.touches.length === 0 &&
      e.changedTouches.length === 1
    ) {
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.changedTouches[0];
      const newPoint = {
        x: (touch.clientX - rect.left - translate.x) / scale,
        y: (touch.clientY - rect.top - translate.y) / scale,
      };
      setPoints((prev) => [...prev, newPoint]);
    }
    lastTouches.current = Array.from(e.touches);
  };

  const handleClick = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const newPoint = {
      x: (e.clientX - rect.left - translate.x) / scale,
      y: (e.clientY - rect.top - translate.y) / scale,
    };
    setPoints((prev) => [...prev, newPoint]);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scale, translate]);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      tabIndex={-1}
      style={{
        width: "100vw",
        height: "100vh",
        background: "white",
        overflow: "hidden",
        touchAction: "none",
        position: "relative",
        userSelect: "none",
        outline: "none",
      }}
    >
      <div
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      >
        {points.map((p, i) => (
          <Point key={i} x={p.x} y={p.y} />
        ))}
      </div>
    </div>
  );
}
