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

// 会员等级
export interface MembershipTier {
  id: string;
  name: string;
  name_zh: string;
  level: number;
  icon: string;
  color: string;
  benefits: string[];
  price_monthly: number;
  price_yearly: number;
  max_daily_queries: number;
  max_concurrent_sessions: number;
  priority_support: boolean;
  custom_themes: boolean;
  data_export: boolean;
}

// 用户会员信息
export interface UserMembership {
  id: string;
  user_id: string;
  tier_id: string;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  started_at: string;
  expires_at?: string;
  cancelled_at?: string;
  payment_method?: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

// 会员积分
export interface MembershipPoints {
  id: string;
  user_id: string;
  points: number;
  lifetime_points: number;
  level: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

// 积分流水
export interface PointsTransaction {
  id: string;
  user_id: string;
  points_change: number;
  balance_after: number;
  transaction_type: 'earn' | 'spend' | 'bonus' | 'refund' | 'adjustment';
  reason: string;
  reference_id?: string;
  created_at: string;
}

// 用户表
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  language: string;
  budget_range: string;
  interests: string[];
  membership_tier: string;
  membership_points: number;
  is_premium: boolean;
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

// 聊天会话表
export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// 消息表
export interface Message {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  tokens?: number;
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

/**
 * 聊天会话操作
 */

export async function createChatSession(
  userId: string,
  title: string = '新对话'
): Promise<string | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('chat_sessions')
      .insert({
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('创建会话失败:', error);
    return null;
  }
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取会话列表失败:', error);
    return [];
  }
}

export async function updateChatSessionTitle(
  sessionId: string,
  title: string
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('chat_sessions')
      .update({
        title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('更新会话标题失败:', error);
    return false;
  }
}

export async function deleteChatSession(sessionId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    // 先删除消息
    await client
      .from('messages')
      .delete()
      .eq('session_id', sessionId);

    // 再删除会话
    const { error } = await client
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('删除会话失败:', error);
    return false;
  }
}

/**
 * 消息操作
 */

export async function saveMessage(
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  tokens?: number
): Promise<string | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        role,
        content,
        tokens,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) throw error;

    // 更新会话的 updated_at
    await client
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    return data.id;
  } catch (error) {
    console.error('保存消息失败:', error);
    return null;
  }
}

export async function getMessages(sessionId: string, limit = 50): Promise<Message[]> {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取消息失败:', error);
    return [];
  }
}

export async function getUserMessagesCount(userId: string): Promise<number> {
  const client = getSupabase();
  if (!client) return 0;

  try {
    const { count, error } = await client
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('获取消息数量失败:', error);
    return 0;
  }
}

/**
 * 会员等级相关操作
 */

export async function getMembershipTiers(): Promise<MembershipTier[]> {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('membership_tiers')
      .select('*')
      .order('level', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('获取会员等级失败:', error);
    return [];
  }
}

export async function getUserMembership(userId: string): Promise<UserMembership | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('user_memberships')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  } catch (error) {
    console.error('获取用户会员信息失败:', error);
    return null;
  }
}

export async function getUserMembershipPoints(userId: string): Promise<MembershipPoints | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('membership_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('获取用户积分失败:', error);
    return null;
  }
}

export async function initializeMembershipPoints(userId: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('membership_points')
      .insert({
        user_id: userId,
        points: 0,
        lifetime_points: 0,
        level: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('初始化会员积分失败:', error);
    return false;
  }
}

export async function addPoints(
  userId: string,
  points: number,
  reason: string,
  referenceId?: string
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    // 获取当前积分
    const currentPoints = await getUserMembershipPoints(userId);
    const currentBalance = currentPoints?.points || 0;
    const newBalance = currentBalance + points;

    // 添加积分流水
    const { error: txError } = await client
      .from('points_transactions')
      .insert({
        user_id: userId,
        points_change: points,
        balance_after: newBalance,
        transaction_type: points > 0 ? 'earn' : 'spend',
        reason,
        reference_id: referenceId,
        created_at: new Date().toISOString(),
      });

    if (txError) throw txError;

    // 更新积分
    if (currentPoints) {
      const { error: updateError } = await client
        .from('membership_points')
        .update({
          points: newBalance,
          lifetime_points: (currentPoints.lifetime_points || 0) + (points > 0 ? points : 0),
          last_activity_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      await initializeMembershipPoints(userId);
    }

    return true;
  } catch (error) {
    console.error('添加积分失败:', error);
    return false;
  }
}

export async function getUserItineraryCount(userId: string): Promise<number> {
  const client = getSupabase();
  if (!client) return 0;

  try {
    const { count, error } = await client
      .from('itineraries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('获取行程数量失败:', error);
    return 0;
  }
}

export async function getCompleteUserProfile(userId: string) {
  const client = getSupabase();
  if (!client) return null;

  try {
    // 获取用户基本信息
    const { data: user, error: userError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // 获取会员信息
    const { data: membership, error: membershipError } = await client
      .from('user_memberships')
      .select('*, membership_tiers(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    // 获取积分信息
    const { data: points, error: pointsError } = await client
      .from('membership_points')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 获取统计数据
    const itineraryCount = await getUserItineraryCount(userId);
    const favoriteCount = (await getFavorites(userId)).length;
    const historyCount = (await getBrowseHistory(userId, 100)).length;

    return {
      user,
      membership: membership ? {
        ...membership,
        tier: membership.membership_tiers,
      } : null,
      points: points || null,
      stats: {
        itineraries: itineraryCount,
        favorites: favoriteCount,
        history: historyCount,
      },
    };
  } catch (error) {
    console.error('获取完整用户资料失败:', error);
    return null;
  }
}
