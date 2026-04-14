"use client";

import React, { useState } from "react";
import { timelineSteps } from "@/data/timeline";
import { useClientI18n } from "@/lib/i18n/client";

export default function TimelineView() {
  const { t } = useClientI18n();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleComplete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  const progressText = t('TimelineView.progressDone')
    .replace('{count}', String(completedCount))
    .replace('{total}', String(timelineSteps.length));

  return (
    <div className="pb-20 px-4 pt-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('TimelineView.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('TimelineView.subtitle')}</p>
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{progressText}</span>
            <span>{Math.round((completedCount / timelineSteps.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / timelineSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-teal-200" aria-hidden="true" />

        <div className="space-y-4">
          {timelineSteps.map((step, index) => {
            const isExpanded = expanded[step.id];
            const isDone = completed[step.id];

            return (
              <div key={step.id} className="relative flex gap-4">
                {/* Number circle */}
                <div
                  className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isDone
                      ? "bg-gray-300 text-gray-500"
                      : "bg-teal-600 text-white"
                  }`}
                >
                  {isDone ? "✓" : index + 1}
                </div>

                {/* Card */}
                <div
                  className={`flex-1 rounded-xl border transition-all ${
                    isDone
                      ? "bg-gray-50 border-gray-200 opacity-60"
                      : "bg-white border-teal-100 shadow-sm"
                  }`}
                >
                  {/* Card header — always visible, clickable to expand */}
                  <button
                    className="w-full text-left p-4"
                    onClick={() => toggleExpand(step.id)}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl" aria-hidden="true">{step.icon}</span>
                        <div className="min-w-0">
                          <p className={`font-semibold text-sm leading-tight ${isDone ? "line-through text-gray-400" : "text-gray-900"}`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-teal-500 mt-0.5">⏱ {step.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Checkbox */}
                        <div
                          role="checkbox"
                          aria-checked={isDone}
                          aria-label={`Mark ${step.title} as complete`}
                          onClick={(e) => toggleComplete(e, step.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                            isDone
                              ? "bg-gray-400 border-gray-400 text-white"
                              : "border-teal-400 hover:border-teal-600"
                          }`}
                        >
                          {isDone && <span className="text-xs leading-none">✓</span>}
                        </div>
                        {/* Expand chevron */}
                        <span className={`text-gray-400 text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                          ▼
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      {/* Steps */}
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('TimelineView.stepsLabel')}</p>
                        <ol className="space-y-2">
                          {step.steps.map((s, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-700">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-600 text-xs flex items-center justify-center font-medium">
                                {i + 1}
                              </span>
                              <span className="leading-snug">{s}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Tips */}
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('TimelineView.tipsLabel')}</p>
                        <ul className="space-y-1.5">
                          {step.tips.map((tip, i) => (
                            <li key={i} className="flex gap-2 text-sm text-gray-600">
                              <span className="flex-shrink-0 text-teal-400">💡</span>
                              <span className="leading-snug">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All done banner */}
      {completedCount === timelineSteps.length && (
        <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-semibold text-teal-700">{t('TimelineView.allDoneTitle')}</p>
          <p className="text-sm text-teal-600 mt-1">{t('TimelineView.allDoneSubtitle')}</p>
        </div>
      )}
    </div>
  );
}
