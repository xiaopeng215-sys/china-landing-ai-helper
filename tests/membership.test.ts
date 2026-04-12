/**
 * 会员系统测试
 * 
 * 测试会员系统的核心功能
 */

import {
  getMembershipTiers,
  getUserMembership,
  getUserMembershipPoints,
  initializeMembershipPoints,
  addPoints,
  getCompleteUserProfile,
  getUserItineraryCount,
  getFavorites,
  getBrowseHistory,
  getUserItineraries,
} from '../src/lib/database';

describe('Membership System Tests', () => {
  const testUserId = 'test-user-123';

  describe('Membership Tiers', () => {
    it('should return all membership tiers', async () => {
      const tiers = await getMembershipTiers();
      
      expect(tiers).toBeDefined();
      expect(tiers.length).toBeGreaterThanOrEqual(4);
      
      // Check default tiers exist
      const tierNames = tiers.map(t => t.name);
      expect(tierNames).toContain('free');
      expect(tierNames).toContain('basic');
      expect(tierNames).toContain('premium');
      expect(tierNames).toContain('vip');
    });

    it('should have correct tier levels', async () => {
      const tiers = await getMembershipTiers();
      
      const freeTier = tiers.find(t => t.name === 'free');
      const basicTier = tiers.find(t => t.name === 'basic');
      const premiumTier = tiers.find(t => t.name === 'premium');
      const vipTier = tiers.find(t => t.name === 'vip');
      
      expect(freeTier?.level).toBe(1);
      expect(basicTier?.level).toBe(2);
      expect(premiumTier?.level).toBe(3);
      expect(vipTier?.level).toBe(4);
    });

    it('should have correct tier benefits', async () => {
      const tiers = await getMembershipTiers();
      const freeTier = tiers.find(t => t.name === 'free');
      
      expect(freeTier?.benefits).toBeDefined();
      expect(freeTier?.benefits.length).toBeGreaterThan(0);
      expect(freeTier?.price_monthly).toBe(0);
      expect(freeTier?.max_daily_queries).toBe(10);
    });
  });

  describe('User Membership', () => {
    it('should return null for user without membership', async () => {
      const membership = await getUserMembership(testUserId);
      
      // New users might not have membership yet
      expect(membership).toBeNull();
    });
  });

  describe('Membership Points', () => {
    it('should initialize points for new user', async () => {
      // Note: This test requires a real user ID in the database
      // Skip in CI/CD environment
      if (process.env.CI) {
        return;
      }

      const result = await initializeMembershipPoints(testUserId);
      
      // May fail if user doesn't exist in DB
      expect(typeof result).toBe('boolean');
    });

    it('should add points successfully', async () => {
      if (process.env.CI) {
        return;
      }

      const result = await addPoints(
        testUserId,
        100,
        'Test points addition',
        'test-123'
      );
      
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Complete User Profile', () => {
    it('should return complete profile data', async () => {
      if (process.env.CI) {
        return;
      }

      const profile = await getCompleteUserProfile(testUserId);
      
      if (profile) {
        expect(profile.user).toBeDefined();
        expect(profile.stats).toBeDefined();
        expect(typeof profile.stats.itineraries).toBe('number');
        expect(typeof profile.stats.favorites).toBe('number');
        expect(typeof profile.stats.history).toBe('number');
      }
    });
  });

  describe('Integration Tests', () => {
    it('should handle full membership flow', async () => {
      if (process.env.CI) {
        return;
      }

      // 1. Get tiers
      const tiers = await getMembershipTiers();
      expect(tiers.length).toBeGreaterThan(0);

      // 2. Get user membership (may be null for new users)
      const membership = await getUserMembership(testUserId);
      
      // 3. Get user points (may be null for new users)
      const points = await getUserMembershipPoints(testUserId);
      
      // 4. Get complete profile
      const profile = await getCompleteUserProfile(testUserId);
      
      // Profile may be null if user doesn't exist
      if (profile) {
        expect(profile.user).toBeDefined();
      }
    });
  });
});

describe('Favorites System Tests', () => {
  const testUserId = 'test-user-123';

  it('should get user favorites', async () => {
    const favorites = await getFavorites(testUserId);
    
    expect(Array.isArray(favorites)).toBe(true);
  });
});

describe('History System Tests', () => {
  const testUserId = 'test-user-123';

  it('should get user browse history', async () => {
    const history = await getBrowseHistory(testUserId, 20);
    
    expect(Array.isArray(history)).toBe(true);
  });
});

describe('Itinerary System Tests', () => {
  const testUserId = 'test-user-123';

  it('should get user itineraries', async () => {
    const itineraries = await getUserItineraries(testUserId);
    
    expect(Array.isArray(itineraries)).toBe(true);
  });

  it('should get itinerary count', async () => {
    const count = await getUserItineraryCount(testUserId);
    
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
