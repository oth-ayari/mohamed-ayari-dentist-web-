import { NextResponse } from 'next/server';

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export function ok<T>(data: T, message?: string, meta?: Record<string, unknown>, status = 200) {
  const body: ApiSuccess<T> = { success: true, data };
  if (message) body.message = message;
  if (meta) body.meta = meta;
  return NextResponse.json<ApiSuccess<T>>(body, { status });
}

export function created<T>(data: T, message?: string) {
  return ok(data, message, undefined, 201);
}

export function badRequest(error: string, details?: unknown) {
  const body: ApiError = { success: false, error };
  if (details !== undefined) body.details = details;
  return NextResponse.json<ApiError>(body, { status: 400 });
}

export function unauthorized(error = 'Unauthorized') {
  return NextResponse.json<ApiError>({ success: false, error }, { status: 401 });
}

export function forbidden(error = 'Forbidden') {
  return NextResponse.json<ApiError>({ success: false, error }, { status: 403 });
}

export function notFound(error = 'Not found') {
  return NextResponse.json<ApiError>({ success: false, error }, { status: 404 });
}

export function conflict(error: string) {
  return NextResponse.json<ApiError>({ success: false, error }, { status: 409 });
}

export function serverError(error = 'Internal server error') {
  return NextResponse.json<ApiError>({ success: false, error }, { status: 500 });
}

export function corsHeaders() {
  // Never fall back to '*' — use the configured app URL only
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'null';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}
