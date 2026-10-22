import {
  DISCLAIMER,
  GENG_NOTE,
  HISTORY_NOTE,
  UNIT_NOTE,
  WUXING_NOTE,
} from "../data/notes";
import type { Shichen } from "../data/shichen";
import {
  chuZhengHours,
  formatHourRange,
  getChuZheng,
  getGeng,
} from "../lib/time";

type Props = {
  shichen: Shichen;
  displayDate: Date;
};

export function DetailPanel({ shichen, displayDate }: Props) {
  const chuZheng = getChuZheng(displayDate);
  const hours = chuZhengHours(shichen);
  const geng = getGeng(displayDate) ?? shichen.nightWatch;

  return (
    <aside className="panel" aria-label="时辰说明">
      <header className="panel-hero">
        <p className="eyebrow">十二地支 · 一时辰两小时</p>
        <h1>
          <span className="branch">{shichen.branch}</span>
          <span className="branch-rest">
            时 · {shichen.pinyin}
            <small>{shichen.ancientName}</small>
          </span>
        </h1>
        <p className="modern">{shichen.modernLabel}</p>
        <p className="aliases">
          {shichen.ancientPinyin}
          {shichen.aliases.length > 0
            ? ` · 又名 ${shichen.aliases.join("、")}`
            : ""}
        </p>
      </header>

      <section>
        <h2>此刻对照</h2>
        <ul className="facts">
          <li>
            <span>生肖</span>
            <strong>
              {shichen.zodiac}
              <em>{shichen.zodiacNote}</em>
            </strong>
          </li>
          <li>
            <span>初 / 正</span>
            <strong>
              {shichen.branch}
              {chuZheng}
              <em>
                {shichen.branch}初 {formatHourRange(hours.chu)}；{shichen.branch}
                正 {formatHourRange(hours.zheng)}
              </em>
            </strong>
          </li>
          {geng ? (
            <li>
              <span>夜间更点</span>
              <strong>{geng}</strong>
            </li>
          ) : (
            <li>
              <span>夜间更点</span>
              <strong>白日以钟报时，这一段不入五更。</strong>
            </li>
          )}
        </ul>
        <p className="meaning">{shichen.meaning}</p>
      </section>

      <section>
        <h2>五行 · 经络</h2>
        <p className="wuxing-line">{WUXING_NOTE}</p>
        <ul className="facts">
          <li>
            <span>五行</span>
            <strong>{shichen.wuxing}</strong>
          </li>
          <li>
            <span>当令</span>
            <strong>
              {shichen.organ} · {shichen.meridian}
            </strong>
          </li>
          <li>
            <span>传统条目</span>
            <strong>{shichen.symptoms}</strong>
          </li>
        </ul>
      </section>

      <section>
        <h2>宜忌（文化）</h2>
        <p className="wellness">{shichen.wellness}</p>
        <div className="yi-ji">
          <p>
            <span>宜</span>
            {shichen.yi.join(" · ")}
          </p>
          <p>
            <span>忌</span>
            {shichen.ji.join(" · ")}
          </p>
        </div>
        <p className="disclaimer">{DISCLAIMER}</p>
      </section>

      <details>
        <summary>{GENG_NOTE.title}</summary>
        {GENG_NOTE.paragraphs.map((p) => (
          <p key={p.slice(0, 12)}>{p}</p>
        ))}
      </details>
      <details>
        <summary>{UNIT_NOTE.title}</summary>
        {UNIT_NOTE.paragraphs.map((p) => (
          <p key={p.slice(0, 12)}>{p}</p>
        ))}
      </details>
      <details>
        <summary>{HISTORY_NOTE.title}</summary>
        {HISTORY_NOTE.paragraphs.map((p) => (
          <p key={p.slice(0, 12)}>{p}</p>
        ))}
      </details>
    </aside>
  );
}
