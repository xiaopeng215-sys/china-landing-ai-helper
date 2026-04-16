'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type Section = { heading: string; body: string | string[] };

type LocaleContent = {
  title: string;
  lastUpdated: string;
  sections: Section[];
  backToTerms: string;
  backToHome: string;
};

const privacyContent: Record<string, LocaleContent> = {
  'en-US': {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: January 2025',
    backToTerms: 'Terms of Service',
    backToHome: '← Back to Home',
    sections: [
      {
        heading: '1. Information We Collect',
        body: [
          'Account data: Email address and name when you register',
          'Chat messages: Your travel questions and AI responses, stored to provide conversation history',
          'Usage data: Pages visited, features used, and session duration for service improvement',
          'Device data: Browser type, operating system, and IP address for security and analytics',
        ],
      },
      {
        heading: '2. How We Use Your Data',
        body: [
          'Provide and improve the AI travel assistant service',
          'Maintain your conversation history and saved itineraries',
          'Send service-related notifications (with your consent)',
          'Detect and prevent fraud or abuse',
        ],
      },
      {
        heading: '3. Data Storage',
        body: 'Your data is stored securely using Supabase (PostgreSQL) with encryption at rest and in transit. Servers are located in the United States. We retain your data for as long as your account is active, or up to 2 years after your last login.',
      },
      {
        heading: '4. Data Sharing',
        body: [
          'AI providers (MiniMax, Qwen): Your chat messages are sent to generate responses',
          'Analytics services (Sentry): Anonymized error and performance data',
          'Legal authorities: When required by law',
        ],
      },
      {
        heading: '5. Your Rights (GDPR)',
        body: [
          'Access: Request a copy of your personal data',
          'Rectification: Correct inaccurate data',
          'Erasure: Delete your account and associated data',
          'Portability: Export your data in JSON format',
          'Objection: Opt out of non-essential data processing',
        ],
      },
      {
        heading: '6. Contact',
        body: 'For privacy requests or questions, contact us at: privacy@travelerlocal.ai',
      },
      {
        heading: '7. Data Deletion',
        body: 'To request deletion of your account and all associated data, email privacy@travelerlocal.ai with subject "Data Deletion Request". We will process your request within 30 days. You can also delete your account directly from the Profile page in the app.',
      },
    ],
  },

  'zh-CN': {
    lastUpdated: '最后更新：2025年1月',
    backToTerms: '服务条款',
    backToHome: '← 返回首页',
    sections: [
      {
        heading: '1. 我们收集的信息',
        body: [
          '账户信息：注册时收集您的邮箱和姓名',
          '聊天记录：您的旅行问题及AI回复，用于提供对话历史',
          '使用数据：访问页面、功能使用情况及会话时长，用于改善服务',
          '设备信息：浏览器类型、操作系统及IP地址，用于安全分析',
        ],
      },
      {
        heading: '2. 数据使用方式',
        body: [
          '提供并改善AI旅行助手服务',
          '维护您的对话历史和行程记录',
          '发送服务相关通知（需您同意）',
          '检测并防止欺诈或滥用行为',
        ],
      },
      {
        heading: '3. 数据存储',
        body: '您的数据通过Supabase（PostgreSQL）安全存储，传输和静态均已加密。服务器位于美国。账户活跃期间保留数据，最后登录后最多保留2年。',
      },
      {
        heading: '4. 数据共享',
        body: [
          'AI服务商（MiniMax、Qwen）：您的聊天消息用于生成回复',
          '分析服务（Sentry）：匿名化的错误和性能数据',
          '法律机构：法律要求时',
        ],
      },
      {
        heading: '5. 您的权利（GDPR）',
        body: [
          '访问权：申请获取您的个人数据副本',
          '更正权：更正不准确的数据',
          '删除权：删除您的账户及相关数据',
          '数据可携带权：以JSON格式导出您的数据',
          '反对权：拒绝非必要数据处理',
        ],
      },
      {
        heading: '6. 联系我们',
        body: '如有隐私相关请求或问题，请联系：privacy@travelerlocal.ai',
      },
    ],
  },

  'zh-TW': {
    title: '隱私政策',
    lastUpdated: '最後更新：2025年1月',
    backToTerms: '服務條款',
    backToHome: '← 返回首頁',
    sections: [
      {
        heading: '1. 我們收集的資訊',
        body: [
          '帳戶資訊：註冊時收集您的電子郵件和姓名',
          '聊天記錄：您的旅遊問題及AI回覆，用於提供對話歷史',
          '使用資料：訪問頁面、功能使用情況及會話時長，用於改善服務',
          '裝置資訊：瀏覽器類型、作業系統及IP位址，用於安全分析',
        ],
      },
      {
        heading: '2. 資料使用方式',
        body: [
          '提供並改善AI旅遊助手服務',
          '維護您的對話歷史和行程記錄',
          '發送服務相關通知（需您同意）',
          '偵測並防止詐欺或濫用行為',
        ],
      },
      {
        heading: '3. 資料儲存',
        body: '您的資料透過Supabase（PostgreSQL）安全儲存，傳輸和靜態均已加密。伺服器位於美國。帳戶活躍期間保留資料，最後登入後最多保留2年。',
      },
      {
        heading: '4. 資料共享',
        body: [
          'AI服務商（MiniMax、Qwen）：您的聊天訊息用於生成回覆',
          '分析服務（Sentry）：匿名化的錯誤和效能資料',
          '法律機構：法律要求時',
        ],
      },
      {
        heading: '5. 您的權利（GDPR）',
        body: [
          '存取權：申請獲取您的個人資料副本',
          '更正權：更正不準確的資料',
          '刪除權：刪除您的帳戶及相關資料',
          '資料可攜帶權：以JSON格式匯出您的資料',
          '反對權：拒絕非必要資料處理',
        ],
      },
      {
        heading: '6. 聯絡我們',
        body: '如有隱私相關請求或問題，請聯絡：privacy@travelerlocal.ai',
      },
    ],
  },

  'ko-KR': {
    title: '개인정보 처리방침',
    lastUpdated: '최종 업데이트: 2025년 1월',
    backToTerms: '서비스 이용약관',
    backToHome: '← 홈으로 돌아가기',
    sections: [
      {
        heading: '1. 수집하는 정보',
        body: [
          '계정 정보: 가입 시 이메일 주소와 이름',
          '채팅 기록: 여행 질문 및 AI 응답 (대화 기록 제공 목적)',
          '사용 데이터: 방문 페이지, 기능 사용 현황, 세션 시간 (서비스 개선 목적)',
          '기기 정보: 브라우저 유형, 운영체제, IP 주소 (보안 및 분석 목적)',
        ],
      },
      {
        heading: '2. 데이터 이용',
        body: [
          'AI 여행 서비스 제공 및 개선',
          '대화 기록 및 저장된 여행 일정 유지',
          '서비스 관련 알림 발송 (동의 시)',
          '부정 이용 및 사기 방지',
        ],
      },
      {
        heading: '3. 데이터 보관',
        body: '귀하의 데이터는 Supabase(PostgreSQL)를 통해 전송 및 저장 시 암호화되어 안전하게 보관됩니다. 서버는 미국에 위치합니다. 계정 활성 기간 동안 데이터를 보관하며, 마지막 로그인 후 최대 2년간 보관합니다.',
      },
      {
        heading: '4. 데이터 공유',
        body: [
          'AI 제공업체 (MiniMax, Qwen): 응답 생성을 위해 채팅 메시지 전송',
          '분석 서비스 (Sentry): 익명화된 오류 및 성능 데이터',
          '법적 기관: 법률에 의해 요구되는 경우',
        ],
      },
      {
        heading: '5. 귀하의 권리 (GDPR)',
        body: [
          '접근권: 개인 데이터 사본 요청',
          '정정권: 부정확한 데이터 수정',
          '삭제권: 계정 및 관련 데이터 삭제',
          '데이터 이동권: JSON 형식으로 데이터 내보내기',
          '반대권: 비필수 데이터 처리 거부',
        ],
      },
      {
        heading: '6. 문의',
        body: '개인정보 관련 요청이나 문의사항은 다음으로 연락하세요: privacy@travelerlocal.ai',
      },
    ],
  },

  'ja-JP': {
    title: 'プライバシーポリシー',
    lastUpdated: '最終更新：2025年1月',
    backToTerms: '利用規約',
    backToHome: '← ホームに戻る',
    sections: [
      {
        heading: '1. 収集する情報',
        body: [
          'アカウント情報：登録時のメールアドレスと氏名',
          'チャット履歴：旅行に関する質問とAIの回答（会話履歴提供のため）',
          '利用データ：訪問ページ、機能の使用状況、セッション時間（サービス改善のため）',
          'デバイス情報：ブラウザの種類、OS、IPアドレス（セキュリティと分析のため）',
        ],
      },
      {
        heading: '2. データの利用',
        body: [
          'AIトラベルアシスタントサービスの提供と改善',
          '会話履歴と保存された旅程の維持',
          'サービス関連の通知送信（同意した場合）',
          '不正利用や詐欺の検出・防止',
        ],
      },
      {
        heading: '3. データ保管',
        body: 'お客様のデータはSupabase（PostgreSQL）を使用して、転送中および保存中に暗号化された状態で安全に保管されます。サーバーは米国に位置しています。アカウントが有効な期間中データを保持し、最後のログインから最大2年間保管します。',
      },
      {
        heading: '4. データ共有',
        body: [
          'AIプロバイダー（MiniMax、Qwen）：回答生成のためチャットメッセージを送信',
          '分析サービス（Sentry）：匿名化されたエラーおよびパフォーマンスデータ',
          '法的機関：法律で要求される場合',
        ],
      },
      {
        heading: '5. お客様の権利（GDPR）',
        body: [
          'アクセス権：個人データのコピーを請求',
          '訂正権：不正確なデータの修正',
          '削除権：アカウントおよび関連データの削除',
          'データポータビリティ：JSON形式でデータをエクスポート',
          '異議申立権：非必須データ処理の拒否',
        ],
      },
      {
        heading: '6. お問い合わせ',
        body: 'プライバシーに関するご要望やご質問は、こちらまでご連絡ください：privacy@travelerlocal.ai',
      },
    ],
  },

  'es-ES': {
    title: 'Política de Privacidad',
    lastUpdated: 'Última actualización: enero de 2025',
    backToTerms: 'Términos de Servicio',
    backToHome: '← Volver al inicio',
    sections: [
      {
        heading: '1. Información que recopilamos',
        body: [
          'Datos de cuenta: Correo electrónico y nombre al registrarse',
          'Mensajes de chat: Sus preguntas de viaje y respuestas de IA, almacenados para el historial de conversación',
          'Datos de uso: Páginas visitadas, funciones utilizadas y duración de la sesión para mejorar el servicio',
          'Datos del dispositivo: Tipo de navegador, sistema operativo y dirección IP para seguridad y análisis',
        ],
      },
      {
        heading: '2. Uso de datos',
        body: [
          'Proporcionar y mejorar el servicio de asistente de viaje IA',
          'Mantener su historial de conversación e itinerarios guardados',
          'Enviar notificaciones relacionadas con el servicio (con su consentimiento)',
          'Detectar y prevenir fraudes o abusos',
        ],
      },
      {
        heading: '3. Almacenamiento de datos',
        body: 'Sus datos se almacenan de forma segura con Supabase (PostgreSQL) con cifrado en tránsito y en reposo. Los servidores están ubicados en Estados Unidos. Conservamos sus datos mientras su cuenta esté activa, o hasta 2 años después de su último acceso.',
      },
      {
        heading: '4. Compartir datos',
        body: [
          'Proveedores de IA (MiniMax, Qwen): Sus mensajes de chat se envían para generar respuestas',
          'Servicios de análisis (Sentry): Datos anónimos de errores y rendimiento',
          'Autoridades legales: Cuando lo exija la ley',
        ],
      },
      {
        heading: '5. Sus derechos (GDPR)',
        body: [
          'Acceso: Solicitar una copia de sus datos personales',
          'Rectificación: Corregir datos inexactos',
          'Supresión: Eliminar su cuenta y datos asociados',
          'Portabilidad: Exportar sus datos en formato JSON',
          'Oposición: Rechazar el procesamiento de datos no esenciales',
        ],
      },
      {
        heading: '6. Contacto',
        body: 'Para solicitudes de privacidad o preguntas, contáctenos en: privacy@travelerlocal.ai',
      },
    ],
  },

  'pt-BR': {
    title: 'Política de Privacidade',
    lastUpdated: 'Última atualização: janeiro de 2025',
    backToTerms: 'Termos de Serviço',
    backToHome: '← Voltar ao início',
    sections: [
      {
        heading: '1. Informações coletadas',
        body: [
          'Dados da conta: Email e nome ao se cadastrar',
          'Mensagens de chat: Suas perguntas de viagem e respostas da IA, armazenadas para o histórico de conversa',
          'Dados de uso: Páginas visitadas, recursos utilizados e duração da sessão para melhoria do serviço',
          'Dados do dispositivo: Tipo de navegador, sistema operacional e endereço IP para segurança e análise',
        ],
      },
      {
        heading: '2. Uso dos dados',
        body: [
          'Fornecer e melhorar o serviço de assistente de viagem IA',
          'Manter seu histórico de conversa e roteiros salvos',
          'Enviar notificações relacionadas ao serviço (com seu consentimento)',
          'Detectar e prevenir fraudes ou abusos',
        ],
      },
      {
        heading: '3. Armazenamento de dados',
        body: 'Seus dados são armazenados com segurança usando Supabase (PostgreSQL) com criptografia em trânsito e em repouso. Os servidores estão localizados nos Estados Unidos. Retemos seus dados enquanto sua conta estiver ativa, ou até 2 anos após seu último acesso.',
      },
      {
        heading: '4. Compartilhamento de dados',
        body: [
          'Provedores de IA (MiniMax, Qwen): Suas mensagens de chat são enviadas para gerar respostas',
          'Serviços de análise (Sentry): Dados anônimos de erros e desempenho',
          'Autoridades legais: Quando exigido por lei',
        ],
      },
      {
        heading: '5. Seus direitos (GDPR)',
        body: [
          'Acesso: Solicitar uma cópia dos seus dados pessoais',
          'Retificação: Corrigir dados imprecisos',
          'Exclusão: Deletar sua conta e dados associados',
          'Portabilidade: Exportar seus dados em formato JSON',
          'Oposição: Recusar o processamento de dados não essenciais',
        ],
      },
      {
        heading: '6. Contato',
        body: 'Para solicitações de privacidade ou dúvidas, entre em contato: privacy@travelerlocal.ai',
      },
    ],
  },

  'ar-SA': {
    title: 'سياسة الخصوصية',
    lastUpdated: 'آخر تحديث: يناير 2025',
    backToTerms: 'شروط الخدمة',
    backToHome: '→ العودة إلى الرئيسية',
    sections: [
      {
        heading: '1. المعلومات التي نجمعها',
        body: [
          'بيانات الحساب: البريد الإلكتروني والاسم عند التسجيل',
          'سجل المحادثات: أسئلتك السياحية وردود الذكاء الاصطناعي، مخزنة لتوفير تاريخ المحادثة',
          'بيانات الاستخدام: الصفحات المزارة والميزات المستخدمة ومدة الجلسة لتحسين الخدمة',
          'معلومات الجهاز: نوع المتصفح ونظام التشغيل وعنوان IP للأمان والتحليل',
        ],
      },
      {
        heading: '2. استخدام البيانات',
        body: [
          'تقديم خدمة مساعد السفر الذكي وتحسينها',
          'الحفاظ على سجل محادثاتك وخطط رحلاتك المحفوظة',
          'إرسال إشعارات متعلقة بالخدمة (بموافقتك)',
          'اكتشاف الاحتيال والإساءة ومنعها',
        ],
      },
      {
        heading: '3. تخزين البيانات',
        body: 'يتم تخزين بياناتك بأمان باستخدام Supabase (PostgreSQL) مع تشفير كامل أثناء النقل والتخزين. الخوادم موجودة في الولايات المتحدة. نحتفظ ببياناتك طوال فترة نشاط حسابك، وحتى سنتين بعد آخر تسجيل دخول.',
      },
      {
        heading: '4. مشاركة البيانات',
        body: [
          'مزودو الذكاء الاصطناعي (MiniMax، Qwen): يتم إرسال رسائل الدردشة لتوليد الردود',
          'خدمات التحليل (Sentry): بيانات مجهولة الهوية للأخطاء والأداء',
          'السلطات القانونية: عند الطلب القانوني',
        ],
      },
      {
        heading: '5. حقوقك (GDPR)',
        body: [
          'حق الوصول: طلب نسخة من بياناتك الشخصية',
          'حق التصحيح: تصحيح البيانات غير الدقيقة',
          'حق الحذف: حذف حسابك والبيانات المرتبطة به',
          'قابلية نقل البيانات: تصدير بياناتك بتنسيق JSON',
          'حق الاعتراض: رفض معالجة البيانات غير الضرورية',
        ],
      },
      {
        heading: '6. تواصل معنا',
        body: 'لطلبات الخصوصية أو الاستفسارات، تواصل معنا على: privacy@travelerlocal.ai',
      },
    ],
  },
};

function detectLocale(): string {
  if (typeof window === 'undefined') return 'en-US';
  const saved = localStorage.getItem('preferred-locale');
  if (saved && privacyContent[saved]) return saved;
  const nav = navigator.language || 'en-US';
  if (privacyContent[nav]) return nav;
  // 匹配语言前缀，如 zh -> zh-CN
  const prefix = nav.split('-')[0];
  const match = Object.keys(privacyContent).find(k => k.startsWith(prefix));
  return match || 'en-US';
}

export default function PrivacyPage() {
  const [locale, setLocale] = useState('en-US');
  useEffect(() => { setLocale(detectLocale()); }, []);
  const content = privacyContent[locale] || privacyContent['en-US'];
  const isRTL = locale === 'ar-SA';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-[#484848] mb-2">{content.title}</h1>
        <p className="text-sm text-[#767676] mb-8">{content.lastUpdated}</p>

        {content.sections.map((section, i) => (
          <section key={i} className="mb-8">
            <h2 className="text-xl font-semibold text-[#484848] mb-3">{section.heading}</h2>
            {Array.isArray(section.body) ? (
              <ul className="list-disc list-inside text-[#767676] space-y-2">
                {section.body.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[#767676]">{section.body}</p>
            )}
          </section>
        ))}

        <div className="pt-6 border-t border-gray-100 flex gap-4 text-sm text-[#767676]">
          <Link href="/terms" className="hover:text-[#ff5a5f]">{content.backToTerms}</Link>
          <Link href="/" className="hover:text-[#ff5a5f]">{content.backToHome}</Link>
        </div>
      </div>
    </div>
  );
}
