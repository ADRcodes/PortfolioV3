import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

export default function RouteScroll() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map());

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    const saved = navigationType === "POP" && positions.current.get(location.key);
    let anchorId = location.hash.slice(1);
    try {
      anchorId = decodeURIComponent(anchorId);
    } catch {
      // A malformed fragment should not prevent the page from rendering.
    }
    const anchor = anchorId && document.getElementById(anchorId);

    if (saved) {
      window.scrollTo({ left: saved.x, top: saved.y, behavior: "instant" });
    } else if (anchor) {
      anchor.scrollIntoView({ behavior: "instant" });
    } else {
      window.scrollTo({ left: 0, top: 0, behavior: "instant" });
    }

    const rememberPosition = () => {
      positions.current.set(location.key, { x: window.scrollX, y: window.scrollY });
    };
    rememberPosition();
    window.addEventListener("scroll", rememberPosition, { passive: true });
    return () => window.removeEventListener("scroll", rememberPosition);
  }, [location.key, location.hash, navigationType]);

  return null;
}
