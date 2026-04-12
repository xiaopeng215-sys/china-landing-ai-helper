/**
 * TripsView 拆分组件单元测试
 * 测试新拆分的子组件：TripsViewHeader, TripsHeroCard, TripsList, TripsLoadingOverlay
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TripsViewHeader from '@/components/views/TripsViewHeader';
import TripsHeroCard from '@/components/views/TripsHeroCard';
import TripsList from '@/components/views/TripsList';
import TripsLoadingOverlay from '@/components/views/TripsLoadingOverlay';
import { allItineraries } from '@/lib/itineraries';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('TripsViewHeader', () => {
  it('应该正确渲染页面标题和副标题', () => {
    const onCitySelect = jest.fn();
    render(<TripsViewHeader selectedCity="all" onCitySelect={onCitySelect} />);
    
    expect(screen.getByText('My Trips')).toBeInTheDocument();
    expect(screen.getByText('Plan your perfect China journey ✨')).toBeInTheDocument();
  });

  it('应该渲染城市筛选器', () => {
    const onCitySelect = jest.fn();
    render(<TripsViewHeader selectedCity="all" onCitySelect={onCitySelect} />);
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('🇨🇳 Shanghai')).toBeInTheDocument();
  });

  it('应该在城市选择时调用回调', () => {
    const onCitySelect = jest.fn();
    render(<TripsViewHeader selectedCity="all" onCitySelect={onCitySelect} />);
    
    const shanghaiButton = screen.getByText('🇨🇳 Shanghai').closest('button');
    fireEvent.click(shanghaiButton!);
    
    expect(onCitySelect).toHaveBeenCalledWith('shanghai-4days');
  });
});

describe('TripsHeroCard', () => {
  it('应该正确渲染英雄卡片', () => {
    render(<TripsHeroCard />);
    
    expect(screen.getByText('Plan Your Trip')).toBeInTheDocument();
    expect(screen.getByText('AI-powered itinerary tailored to you')).toBeInTheDocument();
    expect(screen.getByText('Create →')).toBeInTheDocument();
  });

  it('应该显示飞机 emoji', () => {
    render(<TripsHeroCard />);
    expect(screen.getByText('✈️')).toBeInTheDocument();
  });

  it('应该在点击时调用 onPlanTrip 回调', () => {
    const onPlanTrip = jest.fn();
    render(<TripsHeroCard onPlanTrip={onPlanTrip} />);
    
    const card = screen.getByText('Plan Your Trip').closest('div');
    fireEvent.click(card!);
    
    expect(onPlanTrip).toHaveBeenCalled();
  });

  it('应该有正确的样式类', () => {
    const { container } = render(<TripsHeroCard />);
    
    // 查找带有渐变背景的卡片容器 (最外层的 div)
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-gradient-to-br');
    expect(card).toHaveClass('from-emerald-500');
    expect(card).toHaveClass('rounded-3xl');
  });
});

describe('TripsList', () => {
  const mockTrips = allItineraries.slice(0, 3);

  it('应该正确渲染行程列表', () => {
    const onTripSelect = jest.fn();
    render(<TripsList trips={mockTrips} selectedCity="all" onTripSelect={onTripSelect} />);
    
    expect(screen.getByText('📍 All Routes')).toBeInTheDocument();
    
    mockTrips.forEach(trip => {
      expect(screen.getByText(trip.city)).toBeInTheDocument();
    });
  });

  it('应该显示筛选后的城市名称', () => {
    const onTripSelect = jest.fn();
    const shanghaiTrips = allItineraries.filter(t => t.id === 'shanghai-4days');
    render(<TripsList trips={shanghaiTrips} selectedCity="shanghai-4days" onTripSelect={onTripSelect} />);
    
    // TripsList 使用 trips[0]?.city 显示城市名 (数据中 city 字段为中文)
    expect(screen.getByText('📍 上海')).toBeInTheDocument();
  });

  it('应该在点击行程时调用回调', () => {
    const onTripSelect = jest.fn();
    render(<TripsList trips={mockTrips} selectedCity="all" onTripSelect={onTripSelect} />);
    
    const viewDetailsButton = screen.getAllByText('View Details')[0];
    fireEvent.click(viewDetailsButton);
    
    expect(onTripSelect).toHaveBeenCalledWith(mockTrips[0]);
  });

  it('应该为每个行程渲染 TripCard', () => {
    const onTripSelect = jest.fn();
    render(<TripsList trips={mockTrips} selectedCity="all" onTripSelect={onTripSelect} />);
    
    expect(screen.getAllByText('View Details')).toHaveLength(mockTrips.length);
  });
});

describe('TripsLoadingOverlay', () => {
  it('应该正确渲染加载覆盖层', () => {
    render(<TripsLoadingOverlay />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('应该有旋转的加载动画', () => {
    render(<TripsLoadingOverlay />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('应该有固定的定位和高 z-index', () => {
    render(<TripsLoadingOverlay />);
    
    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('z-50');
  });

  it('应该有半透明背景和模糊效果', () => {
    render(<TripsLoadingOverlay />);
    
    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).toHaveClass('bg-white/80');
    expect(overlay).toHaveClass('backdrop-blur-sm');
  });
});

describe('组件集成测试', () => {
  it('应该支持完整的组件组合', () => {
    const onCitySelect = jest.fn();
    const onTripSelect = jest.fn();
    const onPlanTrip = jest.fn();
    
    render(
      <>
        <TripsViewHeader selectedCity="all" onCitySelect={onCitySelect} />
        <TripsHeroCard onPlanTrip={onPlanTrip} />
        <TripsList trips={allItineraries.slice(0, 2)} selectedCity="all" onTripSelect={onTripSelect} />
        <TripsLoadingOverlay />
      </>
    );
    
    // 验证所有组件都正确渲染
    expect(screen.getByText('My Trips')).toBeInTheDocument();
    expect(screen.getByText('Plan Your Trip')).toBeInTheDocument();
    expect(screen.getByText('📍 All Routes')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
