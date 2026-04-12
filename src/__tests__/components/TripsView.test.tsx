/**
 * TripsView 组件及子组件单元测试
 * 覆盖率目标：> 80%
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TripsView from '@/components/views/TripsView';
import TripCard from '@/components/trips/TripCard';
import CityFilterChips from '@/components/trips/CityFilterChips';
import TripDetailModal from '@/components/trips/TripDetailModal';
import ActivityItem from '@/components/trips/ActivityItem';
import { allItineraries } from '@/lib/itineraries';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('TripsView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染页面标题', () => {
    render(<TripsView />);
    expect(screen.getByText('My Trips')).toBeInTheDocument();
  });

  it('应该显示所有城市筛选器', () => {
    render(<TripsView />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('🇨🇳 Shanghai')).toBeInTheDocument();
    expect(screen.getByText('🏯 Beijing')).toBeInTheDocument();
  });

  it('应该显示特色行程', () => {
    render(<TripsView />);
    expect(screen.getByText('🌟 Featured Routes')).toBeInTheDocument();
  });

  it('应该显示所有行程', () => {
    render(<TripsView />);
    expect(screen.getByText('📍 All Routes')).toBeInTheDocument();
  });

  it('应该显示更多目的地', () => {
    render(<TripsView />);
    expect(screen.getByText('🗺️ More Destinations')).toBeInTheDocument();
  });

  it('应该支持城市筛选', async () => {
    render(<TripsView />);
    
    const shanghaiFilter = screen.getByText('🇨🇳 Shanghai');
    fireEvent.click(shanghaiFilter);
    
    await waitFor(() => {
      // 数据中 city 字段为中文
      expect(screen.getByText('📍 上海')).toBeInTheDocument();
    });
  });
});

describe('CityFilterChips', () => {
  it('应该渲染所有城市选项', () => {
    const onCitySelect = jest.fn();
    render(<CityFilterChips selectedCity="all" onCitySelect={onCitySelect} />);
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('🇨🇳 Shanghai')).toBeInTheDocument();
    expect(screen.getByText('🏯 Beijing')).toBeInTheDocument();
    expect(screen.getByText('🏛️ Xi\'an')).toBeInTheDocument();
    expect(screen.getByText('🐼 Chengdu')).toBeInTheDocument();
    expect(screen.getByText('🏞️ Guilin')).toBeInTheDocument();
    expect(screen.getByText('🌸 Hangzhou')).toBeInTheDocument();
  });

  it('应该高亮显示选中的城市', () => {
    const onCitySelect = jest.fn();
    render(<CityFilterChips selectedCity="shanghai-4days" onCitySelect={onCitySelect} />);
    
    const shanghaiButton = screen.getByText('🇨🇳 Shanghai').closest('button');
    expect(shanghaiButton).toHaveClass('bg-emerald-500');
  });

  it('应该在城市点击时调用回调', () => {
    const onCitySelect = jest.fn();
    render(<CityFilterChips selectedCity="all" onCitySelect={onCitySelect} />);
    
    const shanghaiFilter = screen.getByText('🇨🇳 Shanghai').closest('button');
    fireEvent.click(shanghaiFilter!);
    
    expect(onCitySelect).toHaveBeenCalledWith('shanghai-4days');
  });
});

describe('TripCard', () => {
  const mockTrip = allItineraries[0];

  it('应该正确渲染行程卡片', () => {
    const onViewDetails = jest.fn();
    render(<TripCard trip={mockTrip} onViewDetails={onViewDetails} />);
    
    expect(screen.getByText(mockTrip.city)).toBeInTheDocument();
    expect(screen.getByText(mockTrip.subtitle)).toBeInTheDocument();
    // 天数显示为分开的元素
    expect(screen.getByText(mockTrip.days.toString())).toBeInTheDocument();
    expect(screen.getByText('days')).toBeInTheDocument();
  });

  it('应该显示预算信息', () => {
    const onViewDetails = jest.fn();
    render(<TripCard trip={mockTrip} onViewDetails={onViewDetails} />);
    
    expect(screen.getByText(mockTrip.budget)).toBeInTheDocument();
  });

  it('应该显示主题标签', () => {
    const onViewDetails = jest.fn();
    render(<TripCard trip={mockTrip} onViewDetails={onViewDetails} />);
    
    mockTrip.theme.forEach(theme => {
      expect(screen.getByText(theme)).toBeInTheDocument();
    });
  });

  it('应该在点击查看详情时调用回调', () => {
    const onViewDetails = jest.fn();
    render(<TripCard trip={mockTrip} onViewDetails={onViewDetails} />);
    
    const viewDetailsButton = screen.getByText('View Details');
    fireEvent.click(viewDetailsButton);
    
    expect(onViewDetails).toHaveBeenCalledWith(mockTrip);
  });

  it('应该显示行程预览', () => {
    const onViewDetails = jest.fn();
    render(<TripCard trip={mockTrip} onViewDetails={onViewDetails} />);
    
    expect(screen.getByText('Quick Preview')).toBeInTheDocument();
    expect(screen.getByText(`Day ${mockTrip.dayPlans[0].day}`)).toBeInTheDocument();
  });
});

describe('ActivityItem', () => {
  const mockActivity = {
    time: '09:00',
    name: '外滩',
    nameEn: 'The Bund',
    type: 'attraction' as const,
    duration: '2 小时',
    description: '上海标志性景点',
    price: '免费',
    location: '黄浦区',
    locationLat: 31.2405,
    locationLng: 121.4901,
    highlights: ['夜景'],
    tips: '建议晚上去',
  };

  it('应该正确渲染活动项', () => {
    render(<ActivityItem activity={mockActivity} index={0} />);
    
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('外滩')).toBeInTheDocument();
    expect(screen.getByText('2 小时')).toBeInTheDocument();
    expect(screen.getByText('免费')).toBeInTheDocument();
  });

  it('应该显示正确的类型图标', () => {
    const { rerender } = render(<ActivityItem activity={mockActivity} index={0} />);
    expect(screen.getByText('🏛️')).toBeInTheDocument();

    const foodActivity = { ...mockActivity, type: 'food' as const };
    rerender(<ActivityItem activity={foodActivity} index={0} />);
    expect(screen.getByText('🍜')).toBeInTheDocument();
  });
});

describe('TripDetailModal', () => {
  const mockTrip = allItineraries[0];
  const onClose = jest.fn();

  it('应该渲染模态框内容', () => {
    render(<TripDetailModal trip={mockTrip} onClose={onClose} />);
    
    expect(screen.getByText(mockTrip.title)).toBeInTheDocument();
    expect(screen.getByText(mockTrip.subtitle)).toBeInTheDocument();
  });

  it('应该显示行程统计信息', () => {
    render(<TripDetailModal trip={mockTrip} onClose={onClose} />);
    
    expect(screen.getByText(`${mockTrip.days} Days`)).toBeInTheDocument();
    expect(screen.getByText(mockTrip.budget)).toBeInTheDocument();
  });

  it('应该显示每日计划', () => {
    render(<TripDetailModal trip={mockTrip} onClose={onClose} />);
    
    mockTrip.dayPlans.forEach(dayPlan => {
      // 格式为 "Day 1: 浦西经典之旅"
      expect(screen.getByText(`Day ${dayPlan.day}:`)).toBeInTheDocument();
    });
  });

  it('应该显示活动项', () => {
    render(<TripDetailModal trip={mockTrip} onClose={onClose} />);
    
    const firstActivity = mockTrip.dayPlans[0].activities[0];
    expect(screen.getByText(firstActivity.name)).toBeInTheDocument();
  });

  it('点击关闭按钮应该调用 onClose', () => {
    render(<TripDetailModal trip={mockTrip} onClose={onClose} />);
    
    const closeButton = screen.getByText('✕').closest('button');
    fireEvent.click(closeButton!);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('点击背景应该关闭模态框', () => {
    render(<TripDetailModal trip={mockTrip} onClose={onClose} />);
    
    const overlay = document.querySelector('.fixed.inset-0');
    fireEvent.click(overlay!);
    
    expect(onClose).toHaveBeenCalled();
  });
});

describe('集成测试', () => {
  it('应该支持完整的行程查看流程', async () => {
    render(<TripsView />);
    
    // 点击行程卡片
    const viewDetailsButtons = screen.getAllByText('View Details');
    fireEvent.click(viewDetailsButtons[0]);
    
    // 等待模态框打开
    await waitFor(() => {
      expect(screen.getByText('Plan This Trip with AI ✈️')).toBeInTheDocument();
    });
    
    // 关闭模态框
    const closeButton = screen.getByText('✕').closest('button');
    fireEvent.click(closeButton!);
    
    await waitFor(() => {
      expect(screen.queryByText('Plan This Trip with AI ✈️')).not.toBeInTheDocument();
    });
  });

  it('应该支持城市筛选和行程查看', async () => {
    render(<TripsView />);
    
    // 选择上海
    const shanghaiFilter = screen.getByText('🇨🇳 Shanghai').closest('button');
    fireEvent.click(shanghaiFilter!);
    
    await waitFor(() => {
      // 数据中 city 字段为中文
      expect(screen.getByText('📍 上海')).toBeInTheDocument();
    });
  });
});
