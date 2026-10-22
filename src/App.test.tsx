import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { SHICHEN } from "./data/shichen";
import { getShichenAt } from "./lib/time";

vi.mock("./scene/ClockScene", () => ({
  ClockScene: () => <div data-testid="clock-scene">clock</div>,
}));

afterEach(() => {
  cleanup();
});

describe("explainer HUD", () => {
  it("highlights the current 时辰 and shows the wellness disclaimer", async () => {
    render(<App />);
    const now = getShichenAt(new Date());
    expect(await screen.findByTestId("clock-scene")).toBeTruthy();
    const selected = screen.getByRole("option", {
      name: `${now.branch}时 ${now.ancientName}`,
    });
    expect(selected.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByText(/不能代替医疗建议/)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "跟随现在" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("walks all twelve periods and wraps 亥 → 子 → 丑", () => {
    render(<App />);

    const clickPeriod = (branch: string, ancientName: string) => {
      fireEvent.click(
        screen.getByRole("option", { name: `${branch}时 ${ancientName}` }),
      );
    };

    for (const item of SHICHEN) {
      clickPeriod(item.branch, item.ancientName);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.querySelector(".branch")?.textContent).toBe(item.branch);
      expect(screen.getByText(item.modernLabel)).toBeTruthy();
      const panel = screen.getByRole("complementary", { name: "时辰说明" });
      expect(panel.textContent).toContain(item.zodiac);
      expect(panel.textContent).toContain(item.meridian);
      expect(panel.textContent).toContain(item.wuxing);
    }

    clickPeriod("亥", "人定");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("亥");
    clickPeriod("子", "夜半");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("子");
    clickPeriod("丑", "鸡鸣");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("丑");

    expect(
      screen.getByRole("button", { name: "跟随现在" }).getAttribute("aria-pressed"),
    ).toBe("false");
    fireEvent.click(screen.getByRole("button", { name: "跟随现在" }));
    expect(
      screen.getByRole("button", { name: "跟随现在" }).getAttribute("aria-pressed"),
    ).toBe("true");
    const now = getShichenAt(new Date());
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      now.branch,
    );
  });
});
