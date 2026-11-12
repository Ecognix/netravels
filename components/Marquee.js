import { Children } from "react";

// Right-to-left infinite scroller. Content is rendered twice so the loop is seamless.
export default function Marquee({ children, speed = 45, label }) {
  const items = Children.toArray(children);
  return (
    <div className="marquee" role="region" aria-label={label} style={{ "--marquee-speed": `${speed}s` }}>
      <div className="marquee-track">
        <div className="marquee-group">{items}</div>
        <div className="marquee-group" aria-hidden="true">{items}</div>
      </div>
    </div>
  );
}
