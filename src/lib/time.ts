import { SHICHEN, type Shichen } from "../data/shichen";

const MINUTES_PER_DAY = 24 * 60;

export function minutesFromMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

export function dateFromMinutes(minutes: number, reference: Date): Date {
  const wrapped = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const next = new Date(reference);
  const hours = Math.floor(wrapped / 60);
  const mins = Math.floor(wrapped % 60);
  const secs = Math.floor((wrapped * 60) % 60);
  next.setHours(hours, mins, secs, 0);
  return next;
}

/** 0 = 子 … 11 = 亥. 子 covers 23:00–01:00. */
export function shichenIndexFromHour(hour: number): number {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  return Math.floor(((h + 1) % 24) / 2);
}

export function shichenIndexAt(date: Date): number {
  return shichenIndexFromHour(date.getHours());
}

export function getShichenAt(date: Date): Shichen {
  return SHICHEN[shichenIndexAt(date)];
}

export function getChuZheng(date: Date): "初" | "正" {
  const hour = date.getHours();
  if (hour === 23) return "初";
  if (hour === 0) return "正";
  return hour % 2 === 1 ? "初" : "正";
}

export function chuZhengHours(shichen: Shichen): { chu: number; zheng: number } {
  if (shichen.id === "zi") return { chu: 23, zheng: 0 };
  return { chu: shichen.hourStart, zheng: (shichen.hourStart + 1) % 24 };
}

export function formatHourRange(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const next = (h + 1) % 24;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:00–${pad(next)}:00`;
}

export function getGeng(date: Date): string | undefined {
  const hour = date.getHours();
  if (hour >= 19 && hour < 21) return "一更";
  if (hour >= 21 && hour < 23) return "二更";
  if (hour === 23 || hour === 0) return "三更";
  if (hour >= 1 && hour < 3) return "四更";
  if (hour >= 3 && hour < 5) return "五更";
  return undefined;
}

/**
 * Math angle in the wheel XY plane: 0° = +X (east/卯), 90° = +Y (north/子).
 * Time runs clockwise from 子 toward 卯.
 */
export function angleDegFromMinutes(minutes: number): number {
  const wrapped = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return (90 - wrapped * 0.25 + 360) % 360;
}

export function minutesFromAngleDeg(deg: number): number {
  return (((90 - deg) % 360) + 360) % 360 * 4;
}

export function wedgeStartDeg(index: number): number {
  return ((75 - index * 30) % 360 + 360) % 360;
}

export function wedgeCenterDeg(index: number): number {
  return ((90 - index * 30) % 360 + 360) % 360;
}

export function midpointMinutes(shichen: Shichen): number {
  if (shichen.id === "zi") return 0;
  return ((shichen.hourStart + 1) % 24) * 60;
}

export function padTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
