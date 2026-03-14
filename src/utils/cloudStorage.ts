/**
 * cloudStorage.ts — Supabase CRUD 래퍼 (ISSUE-008)
 *
 * 환경변수 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 설정된 경우에만 활성화.
 * 미설정 시 모든 함수는 no-op 또는 빈 배열을 반환하여 localStorage fallback 동작.
 *
 * 테이블 스키마 (Supabase SQL):
 *   create table study_records (
 *     id          text primary key,
 *     user_id     uuid references auth.users not null,
 *     date        text not null,
 *     total_minutes integer not null default 0,
 *     sessions    jsonb not null default '[]',
 *     updated_at  timestamptz not null default now()
 *   );
 *   alter table study_records enable row level security;
 *   create policy "users own records" on study_records
 *     for all using (auth.uid() = user_id);
 */

import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js'
import type { StudyRecord, AppUser } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    // isConfigured() 체크 후에만 호출되므로 non-null 보장
    _client = createClient(supabaseUrl!, supabaseAnonKey!)
  }
  return _client
}

function toAppUser(user: User): AppUser {
  return {
    id: user.id,
    email: user.email ?? null,
    displayName: user.user_metadata?.['full_name'] ?? user.user_metadata?.['name'] ?? null,
    avatarUrl: user.user_metadata?.['avatar_url'] ?? null,
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/** Google OAuth 팝업 로그인. 환경 미설정 시 null 반환 */
export async function signInWithGoogle(): Promise<AppUser | null> {
  if (!isConfigured()) return null
  const { error } = await getClient().auth.signInWithOAuth({
    provider: 'google',
    options: { queryParams: { prompt: 'select_account' } },
  })
  if (error) throw error
  return null // OAuth 리다이렉트 후 onAuthStateChange 로 수신
}

/** 로그아웃 */
export async function signOut(): Promise<void> {
  if (!isConfigured()) return
  await getClient().auth.signOut()
}

/** 현재 세션의 사용자 반환 */
export async function getCurrentUser(): Promise<AppUser | null> {
  if (!isConfigured()) return null
  const { data } = await getClient().auth.getUser()
  return data.user ? toAppUser(data.user) : null
}

/** 인증 상태 변경 구독. 컴포넌트 언마운트 시 반환된 cleanup 호출 */
export function subscribeAuthState(callback: (user: AppUser | null) => void): () => void {
  if (!isConfigured()) return () => {}
  const { data } = getClient().auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? toAppUser(session.user) : null)
  })
  return () => data.subscription.unsubscribe()
}

// ── Study Records ─────────────────────────────────────────────────────────────

/** 사용자의 전체 기록 로드 */
export async function fetchRecords(userId: string): Promise<StudyRecord[]> {
  if (!isConfigured()) return []
  const { data, error } = await getClient()
    .from('study_records')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true })
  if (error) throw error
  return (data ?? []).map((row) => ({
    id: row.id as string,
    date: row.date as string,
    totalMinutes: row.total_minutes as number,
    sessions: row.sessions as StudyRecord['sessions'],
  }))
}

/** 단일 기록 upsert (insert or update) */
export async function upsertRecord(userId: string, record: StudyRecord): Promise<void> {
  if (!isConfigured()) return
  const { error } = await getClient().from('study_records').upsert({
    id: record.id,
    user_id: userId,
    date: record.date,
    total_minutes: record.totalMinutes,
    sessions: record.sessions,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}
