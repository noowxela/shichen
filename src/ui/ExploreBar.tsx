type Props = {
  followNow: boolean;
  clockLabel: string;
  onFollowNow: () => void;
};

export function ExploreBar({ followNow, clockLabel, onFollowNow }: Props) {
  return (
    <div className="explore">
      <p className="explore-time">
        <span className="explore-kicker">{followNow ? "此刻" : "盘上时刻"}</span>
        <strong>{clockLabel}</strong>
      </p>
      <button
        type="button"
        className={followNow ? "follow-btn is-on" : "follow-btn"}
        aria-pressed={followNow}
        onClick={onFollowNow}
      >
        跟随现在
      </button>
    </div>
  );
}
