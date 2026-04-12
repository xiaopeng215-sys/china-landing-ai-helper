/**
 * SEO 结构化数据组件
 * 用于在各页面中添加 Schema.org JSON-LD 数据
 */

import React from 'react';

interface StructuredDataProps {
  type?: 'WebPage' | 'Article' | 'Product' | 'Event' | 'FAQ';
  data: Record<string, any>;
}

/**
 * 结构化数据组件
 * 将 JSON-LD 数据注入页面
 */
export function StructuredData({ type = 'WebPage', data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * FAQ 结构化数据 - 用于常见问题页面
 */
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }),
      }}
    />
  );
}

/**
 * 面包屑导航结构化数据
 */
export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        }),
      }}
    />
  );
}

export default StructuredData;
