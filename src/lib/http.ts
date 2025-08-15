import { NextResponse } from "next/server";

export const ok = <T>(data: T, init: ResponseInit = {}) =>
  NextResponse.json({ ok: true, data }, { status: 200, ...init });

export const bad = (message: string, code = "BAD_REQUEST", status = 400, details?: unknown) =>
  NextResponse.json({ ok: false, error: { code, message, details } }, { status });

export const err = (message = "Internal error", status = 500, details?: unknown) =>
  NextResponse.json({ ok: false, error: { code: "INTERNAL", message, details } }, { status });
