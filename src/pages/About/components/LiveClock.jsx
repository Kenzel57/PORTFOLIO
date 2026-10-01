import { useEffect, useState } from "react";

function format(d) {
  const time = d.toLocaleTimeString("en-US");
  const zone =
    new Intl.DateTimeFormat("en-US", { timeZoneName: "shortOffset" })
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return `${time} ${zone}`;
}

export default function LiveClock({ className = "", style }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={className} style={style}>
      {format(now)}
    </div>
  );
}