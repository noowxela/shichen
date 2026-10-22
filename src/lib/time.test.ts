import { describe, expect, it } from "vitest";
import { SHICHEN } from "../data/shichen";
import {
  angleDegFromMinutes,
  getChuZheng,
  getGeng,
  getShichenAt,
  minutesFromAngleDeg,
  shichenIndexFromHour,
  wedgeCenterDeg,
} from "./time";

function at(hours: number, minutes = 0): Date {
  return new Date(2026, 8, 10, hours, minutes, 0, 0);
}

describe("shichenIndexFromHour", () => {
  it("maps each civil hour to the standard 23:00-start table", () => {
    const expected = [
      "zi",
      "chou",
      "chou",
      "yin",
      "yin",
      "mao",
      "mao",
      "chen",
      "chen",
      "si",
      "si",
      "wu",
      "wu",
      "wei",
      "wei",
      "shen",
      "shen",
      "you",
      "you",
      "xu",
      "xu",
      "hai",
      "hai",
      "zi",
    ];
    expected.forEach((id, hour) => {
      expect(SHICHEN[shichenIndexFromHour(hour)].id).toBe(id);
    });
  });
});

describe("boundaries", () => {
  it("treats 01:00 as 丑 and 23:00 as 子", () => {
    expect(getShichenAt(at(0, 59)).id).toBe("zi");
    expect(getShichenAt(at(1, 0)).id).toBe("chou");
    expect(getShichenAt(at(22, 59)).id).toBe("hai");
    expect(getShichenAt(at(23, 0)).id).toBe("zi");
  });

  it("keeps 子 across midnight", () => {
    expect(getShichenAt(at(23, 30)).branch).toBe("子");
    expect(getShichenAt(at(0, 0)).branch).toBe("子");
    expect(getShichenAt(at(0, 30)).branch).toBe("子");
  });
});

describe("初正 and 更", () => {
  it("splits 子 into 子初 at 23:00 and 子正 at 00:00", () => {
    expect(getChuZheng(at(23))).toBe("初");
    expect(getChuZheng(at(0))).toBe("正");
  });

  it("splits odd/even hours for the other eleven", () => {
    expect(getChuZheng(at(7))).toBe("初");
    expect(getChuZheng(at(8))).toBe("正");
    expect(getChuZheng(at(11))).toBe("初");
    expect(getChuZheng(at(12))).toBe("正");
  });

  it("names the five night watches", () => {
    expect(getGeng(at(19))).toBe("一更");
    expect(getGeng(at(21))).toBe("二更");
    expect(getGeng(at(23))).toBe("三更");
    expect(getGeng(at(0))).toBe("三更");
    expect(getGeng(at(1))).toBe("四更");
    expect(getGeng(at(3))).toBe("五更");
    expect(getGeng(at(12))).toBeUndefined();
  });
});

describe("wheel angles", () => {
  it("puts midnight at north (+Y, 90°)", () => {
    expect(angleDegFromMinutes(0)).toBeCloseTo(90, 5);
    expect(wedgeCenterDeg(0)).toBeCloseTo(90, 5);
  });

  it("moves clockwise toward 卯 as time increases", () => {
    expect(angleDegFromMinutes(60)).toBeCloseTo(75, 5);
    expect(angleDegFromMinutes(6 * 60)).toBeCloseTo(0, 5);
  });

  it("round-trips minutes through the disc angle, including 23:00", () => {
    for (const minutes of [0, 60, 1380, 1439]) {
      const deg = angleDegFromMinutes(minutes);
      expect(minutesFromAngleDeg(deg)).toBeCloseTo(minutes, 5);
    }
  });
});
