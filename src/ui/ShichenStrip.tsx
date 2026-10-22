import { SHICHEN, type Shichen } from "../data/shichen";

type Props = {
  selectedId: string;
  onSelectIndex: (index: number) => void;
};

export function ShichenStrip({ selectedId, onSelectIndex }: Props) {
  return (
    <div className="strip" role="listbox" aria-label="十二时辰">
      {SHICHEN.map((item: Shichen) => {
        const selected = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={selected}
            aria-label={`${item.branch}时 ${item.ancientName}`}
            className={selected ? "strip-btn is-on" : "strip-btn"}
            onClick={() => onSelectIndex(item.index)}
          >
            <span className="strip-branch">{item.branch}</span>
            <span className="strip-name">{item.ancientName}</span>
          </button>
        );
      })}
    </div>
  );
}
