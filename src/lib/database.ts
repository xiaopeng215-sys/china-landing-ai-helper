/**
 * 数据库客户端 - Supabase 集成
 * 懒加载初始化，避免构建时 Env 缺失报错
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Supabase] Env vars not configured, DB features disabled');
    return null;
  }
  
  _supabase = createClient(supabaseUrl, supabaseKey);
  return _supabase;
}

// Lazy supabase instance
export const supabase = {
  get client() { return getSupabase(); },
  
  auth: {
    getSession() { 
      return getSupabase()?.auth.getSession() ?? Promise.resolve({ data: { session: null }, error: null }) as any;
    },
    getUser() {
      return getSupabase()?.auth.getUser() ?? Promise.resolve({ data: { user: null }, error: null }) as any;
    },
    signInWithPassword(credentials: { email: string; password: string }) {
      return getSupabase()?.auth.signInWithPassword(credentials) 
        ?? Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') });
    },
    signOut() {
      return getSupabase()?.auth.signOut() 
        ?? Promise.resolve({ error: new Error('Supabase not configured') });
    },
  },
  
  from(table: string) {
    const client = getSupabase();
    if (!client) {
      // Return a mock that returns empty promises
      return {
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      } as any;
    }
    return client.from(table);
  },
};

/**
 * 数据库 Schema
 */

// 用户表
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  language: string;
  budget_range: string;
  interests: string[];
  created_at: string;
  updated_at: string;
}

// 浏览历史表
export interface BrowseHistory {
  id: string;
  user_id: string;
  page_type: 'itinerary' | 'food' | 'transport' | 'attraction';
  page_id: string;
  page_title: string;
  viewed_at: string;
}

// 收藏表
export interface Favorite {
  id: string;
  user_id: string;
  type: 'itinerary' | 'food' | 'attraction';
  item_id: string;
  created_at: string;
}

// 行程表
export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  days: number;
  budget: number;
  days_plan: DayPlan[];
  created_at: string;
  updated_at: string;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export interface Activity {
  time: string;
  type: 'attraction' | 'food' | 'transport';
  name: string;
  description?: string;
  price?: number;
  location?: string;
}

/**
 * 用户相关操作
 */

export async function getUserProfile(userId: string): Promise<User | null> {
  const client = getSupabase();
  if (!client) return null;
  
  try {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取用户资料失败:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  
  try {
    const { error } = await client
      .from('users')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('更新用户资料失败:', error);
    return false;
  }
}

/**
 * 浏览历史操作
 */

export async function addBrowseHistory(
  userId: string,
  pageType: BrowseHistory['page_type'],
  pageId: string,
  pageTitle: string
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  
  try {
    const { error } = await client
      .from('browse_history')
      .insert({
        user_id: userId,
        page_type: pageType,
        page_id: pageId,
        page_title: pageTitle,
        viewed_at: new Date().toISOString(),
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('添加浏览历史失败:', error);
    return false;
  }
}

export async function getBrowseHistory(userId: string, limit = 20): Promise<BrowseHistory[]> {
  const client = getSupabase();
  if (!client) return [];
  
  try {
    const { data, error } = await client
      .from('browse_history')
      .select('*')
      .eq('user_id', userId)
      .order('viewed_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取浏览历史失败:', error);
    return [];
  }
}

/**
 * 收藏操作
 */

export async function addFavorite(
  userId: string,
  type: Favorite['type'],
  itemId: string
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  
  try {
    const { error } = await client
      .from('favorites')
      .insert({
        user_id: userId,
        type,
        item_id: itemId,
        created_at: new Date().toISOString(),
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('添加收藏失败:', error);
    return false;
  }
}

export async function removeFavorite(
  userId: string,
  itemId: string,
  type?: Favorite['type']
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  
  try {
    let query = client
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId);
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { error } = await query;
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('移除收藏失败:', error);
    return false;
  }
}

export async function getFavorites(userId: string): Promise<Favorite[]> {
  const client = getSupabase();
  if (!client) return [];
  
  try {
    const { data, error } = await client
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取收藏失败:', error);
    return [];
  }
}

/**
 * 行程操作
 */

export async function saveItinerary(
  userId: string,
  title: string,
  destination: string,
  days: number,
  budget: number,
  daysPlan: DayPlan[]
): Promise<string | null> {
  const client = getSupabase();
  if (!client) return null;
  
  try {
    const { data, error } = await client
      .from('itineraries')
      .insert({
        user_id: userId,
        title,
        destination,
        days,
        budget,
        days_plan: daysPlan,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('保存行程失败:', error);
    return null;
  }
}

export async function getItineraries(userId: string): Promise<Itinerary[]> {
  const client = getSupabase();
  if (!client) return [];
  
  try {
    const { data, error } = await client
      .from('itineraries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取行程失败:', error);
    return [];
  }
}

export async function deleteItinerary(itineraryId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  
  try {
    const { error } = await client
      .from('itineraries')
      .delete()
      .eq('id', itineraryId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('删除行程失败:', error);
    return false;
  }
}

export async function clearBrowseHistory(userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  
  try {
    const { error } = await client
      .from('browse_history')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('清除浏览历史失败:', error);
    return false;
  }
}

// Alias for getItineraries
export { getItineraries as getUserItineraries };
