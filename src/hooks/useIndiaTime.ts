// hooks/useIndiaTime.ts
import { useEffect, useState } from "react";

type IndiaTime = {
  hour: string;
  minute: string;
  period: "AM" | "PM";
  isActive: boolean;
};

export default function useIndiaTime(live = false): IndiaTime {
  const [time, setTime] = useState<IndiaTime>({
    hour: "",
    minute: "",
    period: "AM",
    isActive: false,
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });

      const [hourMin, period] = date.split(" ");
      const [hourStr, minute] = hourMin.split(":");
      const hour = parseInt(hourStr, 10);
      const hour24 = period === "pm" && hour !== 12 ? hour + 12 : period === "am" && hour === 12 ? 0 : hour;

      setTime({
        hour: hourStr.padStart(2, "0"),
        minute,
        period: period as "AM" | "PM",
        isActive: hour24 >= 8 && hour24 < 20,
      });
    };

    updateTime();
    if (live) {
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [live]);

  return time;
}
