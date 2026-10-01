import { useEffect, useState } from "react";

// True on data-saver mode or 2G. Not supported in Safari (falls back to false).
export default function useSlowConnection() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const conn = navigator.connection;
    if (!conn) return;
    const update = () =>
      setSlow(
        conn.saveData === true ||
          ["slow-2g", "2g"].includes(conn.effectiveType)
      );
    update();
    conn.addEventListener("change", update);
    return () => conn.removeEventListener("change", update);
  }, []);

  return slow;
}