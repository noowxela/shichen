import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { SHICHEN } from "./data/shichen";
import {
  dateFromMinutes,
  getChuZheng,
  getShichenAt,
  midpointMinutes,
  minutesFromMidnight,
  padTime,
} from "./lib/time";
import { DetailPanel } from "./ui/DetailPanel";
import { ExploreBar } from "./ui/ExploreBar";
import { ShichenStrip } from "./ui/ShichenStrip";

const ClockScene = lazy(async () => {
  const mod = await import("./scene/ClockScene");
  return { default: mod.ClockScene };
});

export default function App() {
  const [now, setNow] = useState(() => new Date());
  const [followNow, setFollowNow] = useState(true);
  const [virtualDate, setVirtualDate] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const displayDate = followNow ? now : virtualDate;
  const shichen = getShichenAt(displayDate);
  const minutes = minutesFromMidnight(displayDate);

  const scrubTo = (nextMinutes: number) => {
    setFollowNow(false);
    setVirtualDate(dateFromMinutes(nextMinutes, now));
  };

  const selectIndex = (index: number) => {
    const item = SHICHEN[index];
    setFollowNow(false);
    setVirtualDate(dateFromMinutes(midpointMinutes(item), now));
  };

  return (
    <div
      className="app"
      style={
        {
          "--zenith": shichen.sky.zenith,
          "--horizon": shichen.sky.horizon,
        } as CSSProperties
      }
    >
      <main className="stage">
        <p className="compass-hint">
          盘面：子北 · 卯东 · 午南 · 酉西 · 顺时针走时 · 拖动拨时刻
        </p>
        <div className="stage-canvas">
          <Suspense fallback={<p className="canvas-fallback">正在装盘…</p>}>
            <ClockScene
              minutes={minutes}
              selectedIndex={shichen.index}
              sky={shichen.sky}
              onScrubMinutes={scrubTo}
              onSelectIndex={selectIndex}
            />
          </Suspense>
        </div>
        <ExploreBar
          followNow={followNow}
          clockLabel={`${padTime(displayDate)}  ·  ${shichen.branch}${getChuZheng(displayDate)}`}
          onFollowNow={() => {
            setFollowNow(true);
            setVirtualDate(new Date());
          }}
        />
        <ShichenStrip selectedId={shichen.id} onSelectIndex={selectIndex} />
      </main>
      <DetailPanel shichen={shichen} displayDate={displayDate} />
    </div>
  );
}
