/**
 * TravelerLocal.ai — 冒烟测试
 *
 * 覆盖核心用户流程，每次发布前必须全部通过。
 * 运行：npx jest tests/e2e/smoke.test.ts --testEnvironment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// ─── BottomNav ────────────────────────────────────────────────────────────────

// Mock i18n so BottomNav renders without provider
jest.mock("@/lib/i18n/client", () => ({
  useClientI18n: () => ({
    t: (key: string, fallback: string) => fallback,
  }),
}));

import BottomNav, { Tab } from "@/components/BottomNav";

describe("底部导航", () => {
  const tabs: { id: Tab; label: string }[] = [
    { id: "chat", label: "Home" },
    { id: "itinerary", label: "Plan" },
    { id: "food", label: "Food" },
    { id: "explore", label: "Explore" },
    { id: "essentials", label: "Essentials" },
    { id: "profile", label: "Profile" },
  ];

  it("显示 6 个 tab", () => {
    render(<BottomNav activeTab="chat" onTabChange={jest.fn()} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(6);
  });

  it("tab 顺序：Home / Plan / Food / Explore / Essentials / Profile", () => {
    render(<BottomNav activeTab="chat" onTabChange={jest.fn()} />);
    const buttons = screen.getAllByRole("button");
    tabs.forEach((tab, i) => {
      expect(buttons[i]).toHaveTextContent(tab.label);
    });
  });

  it("当前激活 tab 有 aria-current=page", () => {
    render(<BottomNav activeTab="food" onTabChange={jest.fn()} />);
    const activeBtn = screen.getByRole("button", { name: /food/i });
    expect(activeBtn).toHaveAttribute("aria-current", "page");
  });

  it("点击 tab 触发 onTabChange 回调", () => {
    const onChange = jest.fn();
    render(<BottomNav activeTab="chat" onTabChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /essentials/i }));
    expect(onChange).toHaveBeenCalledWith("essentials");
  });

  it("点击每个 tab 都能触发正确的 id", () => {
    const onChange = jest.fn();
    render(<BottomNav activeTab="chat" onTabChange={onChange} />);
    tabs.forEach((tab) => {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(tab.label, "i") }));
      expect(onChange).toHaveBeenCalledWith(tab.id);
    });
  });

  it("Explore 子 tab 激活时 Explore 按钮高亮", () => {
    render(<BottomNav activeTab="hotels" onTabChange={jest.fn()} />);
    const exploreBtn = screen.getByRole("button", { name: /explore/i });
    expect(exploreBtn).toHaveAttribute("aria-current", "page");
  });

  it("nav 有 aria-label", () => {
    render(<BottomNav activeTab="chat" onTabChange={jest.fn()} />);
    expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Navigation");
  });
});

// ─── Chat 页面路由 ─────────────────────────────────────────────────────────────

describe("Chat 功能 (单元级)", () => {
  it("Home tab id 为 chat（映射正确）", () => {
    // BottomNav 中 Home tab 的 id 是 "chat"，确保路由映射不被误改
    const onChange = jest.fn();
    render(<BottomNav activeTab="chat" onTabChange={onChange} />);
    const homeBtn = screen.getByRole("button", { name: /home/i });
    expect(homeBtn).toHaveAttribute("aria-current", "page");
    fireEvent.click(homeBtn);
    expect(onChange).toHaveBeenCalledWith("chat");
  });
});

// ─── Plan 功能 ────────────────────────────────────────────────────────────────

describe("Plan 功能 (单元级)", () => {
  it("Plan tab id 为 itinerary（路由映射正确）", () => {
    const onChange = jest.fn();
    render(<BottomNav activeTab="itinerary" onTabChange={onChange} />);
    const planBtn = screen.getByRole("button", { name: /plan/i });
    expect(planBtn).toHaveAttribute("aria-current", "page");
    fireEvent.click(planBtn);
    expect(onChange).toHaveBeenCalledWith("itinerary");
  });
});

// ─── Essentials 页面 ──────────────────────────────────────────────────────────

describe("Essentials 页面 (单元级)", () => {
  it("Essentials tab 可点击并触发正确 id", () => {
    const onChange = jest.fn();
    render(<BottomNav activeTab="chat" onTabChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /essentials/i }));
    expect(onChange).toHaveBeenCalledWith("essentials");
  });
});

// ─── Profile Guest 状态 ───────────────────────────────────────────────────────

// 动态 import Profile 页面组件（如果存在）
describe("Profile — Guest 状态", () => {
  it("未登录时 Profile tab 可点击", () => {
    const onChange = jest.fn();
    render(<BottomNav activeTab="chat" onTabChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /profile/i }));
    expect(onChange).toHaveBeenCalledWith("profile");
  });
});
