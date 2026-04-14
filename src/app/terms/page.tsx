'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type Section = { heading: string; body: string | string[] };

type LocaleContent = {
  title: string;
  lastUpdated: string;
  sections: Section[];
  backToPrivacy: string;
  backToHome: string;
};

const termsContent: Record<string, LocaleContent> = {
  'en-US': {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: January 2025',
    backToPrivacy: 'Privacy Policy',
    backToHome: '← Back to Home',
    sections: [
      {
        heading: '1. Service Description',
        body: 'China AI Travel Helper is an AI-powered travel assistant that provides travel information, itinerary suggestions, and practical tips for visiting China. The service is provided "as is" for informational purposes only.',
      },
      {
        heading: '2. Acceptance of Terms',
        body: 'By using this service, you agree to these terms. If you do not agree, please do not use the service. We may update these terms at any time; continued use constitutes acceptance of the updated terms.',
      },
      {
        heading: '3. Disclaimer of Liability',
        body: [
          'Verifying all information (opening hours, prices, visa requirements) from official sources before travel',
          'Not relying solely on AI recommendations for safety-critical decisions',
          'Checking current travel advisories from your government',
        ],
      },
      {
        heading: '4. User Conduct',
        body: [
          'Use the service for any illegal purpose',
          'Attempt to reverse-engineer, scrape, or abuse the API',
          'Submit harmful, offensive, or misleading content',
          'Share your account credentials with others',
          'Use automated tools to generate excessive requests',
        ],
      },
      {
        heading: '5. Account Termination',
        body: 'We reserve the right to suspend or terminate accounts that violate these terms, abuse the service, or engage in fraudulent activity. You may delete your account at any time from the Profile settings.',
      },
      {
        heading: '6. Intellectual Property',
        body: 'The service, including its design, code, and content, is owned by China AI Travel Helper. AI-generated responses are provided for your personal use only and may not be republished commercially without permission.',
      },
      {
        heading: '7. Governing Law',
        body: 'These terms are governed by applicable law. Disputes shall be resolved through good-faith negotiation before any legal proceedings.',
      },
      {
        heading: '8. Contact',
        body: 'Questions about these terms: support@travelerlocal.ai',
      },
    ],
  },

  'zh-CN': {
    title: '服务条款',
    lastUpdated: '最后更新：2025年1月',
    backToPrivacy: '隐私政策',
    backToHome: '← 返回首页',
    sections: [
      {
        heading: '1. 服务说明',
        body: 'China Landing AI Helper是面向来华旅行者的AI旅行助手，提供行程规划、交通指南、美食推荐等服务。本服务仅供参考，按"现状"提供。',
      },
      {
        heading: '2. 条款接受',
        body: '使用本服务即表示您同意这些条款。如不同意，请停止使用。我们可能随时更新条款，继续使用即视为接受更新后的条款。',
      },
      {
        heading: '3. 免责声明',
        body: [
          'AI生成内容仅供参考，不构成专业建议',
          '餐厅、景点等信息可能有变，请出行前通过官方渠道确认',
          '请勿将AI建议作为安全关键决策的唯一依据',
          '请关注您所在国家/地区发布的旅行警告',
        ],
      },
      {
        heading: '4. 使用规范',
        body: [
          '禁止将服务用于任何违法目的',
          '禁止尝试逆向工程、爬取或滥用API',
          '禁止提交有害、冒犯性或误导性内容',
          '禁止与他人共享账户凭据',
          '禁止使用自动化工具发送过量请求',
        ],
      },
      {
        heading: '5. 账户终止',
        body: '我们保留暂停或终止违反条款、滥用服务或从事欺诈活动账户的权利。您可随时在个人资料设置中删除账户。',
      },
      {
        heading: '6. 知识产权',
        body: '本服务的设计、代码和内容归China AI Travel Helper所有，受版权保护。AI生成的回复仅供个人使用，未经许可不得商业转载。',
      },
      {
        heading: '7. 服务变更',
        body: '我们保留随时修改或终止服务的权利，将提前通知用户。',
      },
      {
        heading: '8. 联系我们',
        body: '如有关于条款的问题，请联系：support@travelerlocal.ai',
      },
    ],
  },

  'zh-TW': {
    title: '服務條款',
    lastUpdated: '最後更新：2025年1月',
    backToPrivacy: '隱私政策',
    backToHome: '← 返回首頁',
    sections: [
      {
        heading: '1. 服務說明',
        body: 'China Landing AI Helper是面向來華旅行者的AI旅遊助手，提供行程規劃、交通指南、美食推薦等服務。本服務僅供參考，按「現狀」提供。',
      },
      {
        heading: '2. 條款接受',
        body: '使用本服務即表示您同意這些條款。如不同意，請停止使用。我們可能隨時更新條款，繼續使用即視為接受更新後的條款。',
      },
      {
        heading: '3. 免責聲明',
        body: [
          'AI生成內容僅供參考，不構成專業建議',
          '餐廳、景點等資訊可能有變，請出行前透過官方管道確認',
          '請勿將AI建議作為安全關鍵決策的唯一依據',
          '請關注您所在國家/地區發布的旅遊警告',
        ],
      },
      {
        heading: '4. 使用規範',
        body: [
          '禁止將服務用於任何違法目的',
          '禁止嘗試逆向工程、爬取或濫用API',
          '禁止提交有害、冒犯性或誤導性內容',
          '禁止與他人共享帳戶憑據',
          '禁止使用自動化工具發送過量請求',
        ],
      },
      {
        heading: '5. 帳戶終止',
        body: '我們保留暫停或終止違反條款、濫用服務或從事詐欺活動帳戶的權利。您可隨時在個人資料設定中刪除帳戶。',
      },
      {
        heading: '6. 智慧財產權',
        body: '本服務的設計、程式碼和內容歸China AI Travel Helper所有，受版權保護。AI生成的回覆僅供個人使用，未經許可不得商業轉載。',
      },
      {
        heading: '7. 服務變更',
        body: '我們保留隨時修改或終止服務的權利，將提前通知用戶。',
      },
      {
        heading: '8. 聯絡我們',
        body: '如有關於條款的問題，請聯絡：support@travelerlocal.ai',
      },
    ],
  },

  'ko-KR': {
    title: '서비스 이용약관',
    lastUpdated: '최종 업데이트: 2025년 1월',
    backToPrivacy: '개인정보 처리방침',
    backToHome: '← 홈으로 돌아가기',
    sections: [
      {
        heading: '1. 서비스 설명',
        body: 'China Landing AI Helper는 중국을 방문하는 여행자를 위한 AI 여행 도우미로, 여행 일정 계획, 교통 안내, 맛집 추천 등의 서비스를 제공합니다. 본 서비스는 정보 제공 목적으로만 "있는 그대로" 제공됩니다.',
      },
      {
        heading: '2. 약관 동의',
        body: '본 서비스를 이용함으로써 이 약관에 동의하는 것으로 간주됩니다. 동의하지 않으시면 서비스를 이용하지 마십시오. 약관은 언제든지 업데이트될 수 있으며, 계속 이용하면 업데이트된 약관에 동의한 것으로 봅니다.',
      },
      {
        heading: '3. 면책 조항',
        body: [
          'AI가 생성한 여행 정보는 부정확하거나 오래되었을 수 있습니다',
          '여행 전 공식 출처에서 모든 정보(영업시간, 가격, 비자 요건)를 확인하세요',
          '안전에 중요한 결정을 AI 추천에만 의존하지 마세요',
          '정부에서 발행하는 최신 여행 경보를 확인하세요',
        ],
      },
      {
        heading: '4. 이용 규칙',
        body: [
          '불법적인 목적으로 서비스를 이용하는 행위 금지',
          'API를 역공학, 스크래핑 또는 남용하는 행위 금지',
          '유해하거나 공격적이거나 오해를 유발하는 콘텐츠 제출 금지',
          '계정 자격 증명을 타인과 공유하는 행위 금지',
          '자동화 도구를 사용한 과도한 요청 금지',
        ],
      },
      {
        heading: '5. 계정 해지',
        body: '약관을 위반하거나 서비스를 남용하거나 사기 행위를 하는 계정을 정지 또는 해지할 권리를 보유합니다. 언제든지 프로필 설정에서 계정을 삭제할 수 있습니다.',
      },
      {
        heading: '6. 지적재산권',
        body: '서비스의 디자인, 코드 및 콘텐츠는 China AI Travel Helper의 소유입니다. AI가 생성한 응답은 개인 사용 목적으로만 제공되며, 허가 없이 상업적으로 재게시할 수 없습니다.',
      },
      {
        heading: '7. 서비스 변경',
        body: '사전 통지 후 언제든지 서비스를 수정하거나 종료할 권리를 보유합니다.',
      },
      {
        heading: '8. 문의',
        body: '약관에 관한 문의사항: support@travelerlocal.ai',
      },
    ],
  },

  'ja-JP': {
    title: '利用規約',
    lastUpdated: '最終更新：2025年1月',
    backToPrivacy: 'プライバシーポリシー',
    backToHome: '← ホームに戻る',
    sections: [
      {
        heading: '1. サービス説明',
        body: 'China Landing AI Helperは、中国を訪れる旅行者向けのAIトラベルアシスタントで、旅程計画、交通案内、グルメ情報などのサービスを提供します。本サービスは情報提供のみを目的として「現状のまま」提供されます。',
      },
      {
        heading: '2. 利用規約への同意',
        body: '本サービスを利用することで、これらの規約に同意したものとみなされます。同意しない場合は、サービスをご利用にならないでください。規約はいつでも更新される場合があり、継続利用は更新された規約への同意とみなされます。',
      },
      {
        heading: '3. 免責事項',
        body: [
          'AIが生成した旅行情報は不正確または古い場合があります',
          '旅行前に公式情報源で全情報（営業時間、料金、ビザ要件）を確認してください',
          '安全に関わる重要な判断をAIの推奨のみに依存しないでください',
          '政府が発行する最新の旅行情報をご確認ください',
        ],
      },
      {
        heading: '4. 利用ルール',
        body: [
          '違法な目的でのサービス利用の禁止',
          'APIのリバースエンジニアリング、スクレイピング、または悪用の禁止',
          '有害、攻撃的、または誤解を招くコンテンツの送信禁止',
          'アカウント認証情報の他者との共有禁止',
          '自動化ツールによる過剰なリクエストの禁止',
        ],
      },
      {
        heading: '5. アカウント停止',
        body: '規約に違反したり、サービスを悪用したり、不正行為を行ったアカウントを停止または終了する権利を保有します。プロフィール設定からいつでもアカウントを削除できます。',
      },
      {
        heading: '6. 知的財産権',
        body: 'サービスのデザイン、コード、コンテンツはChina AI Travel Helperが所有しています。AIが生成した回答は個人利用のみを目的として提供され、許可なく商業的に再公開することはできません。',
      },
      {
        heading: '7. サービス変更',
        body: '事前通知の上、いつでもサービスを変更または終了する権利を保有します。',
      },
      {
        heading: '8. お問い合わせ',
        body: '規約に関するご質問：support@travelerlocal.ai',
      },
    ],
  },

  'es-ES': {
    title: 'Términos de Servicio',
    lastUpdated: 'Última actualización: enero de 2025',
    backToPrivacy: 'Política de Privacidad',
    backToHome: '← Volver al inicio',
    sections: [
      {
        heading: '1. Descripción del servicio',
        body: 'China Landing AI Helper es un asistente de viaje con IA para viajeros que visitan China, que ofrece planificación de itinerarios, guías de transporte y recomendaciones gastronómicas. El servicio se proporciona "tal cual" únicamente con fines informativos.',
      },
      {
        heading: '2. Aceptación de términos',
        body: 'Al usar este servicio, acepta estos términos. Si no está de acuerdo, no utilice el servicio. Podemos actualizar estos términos en cualquier momento; el uso continuado constituye la aceptación de los términos actualizados.',
      },
      {
        heading: '3. Exención de responsabilidad',
        body: [
          'La información de viaje generada por IA puede ser inexacta u obsoleta',
          'Verifique toda la información (horarios, precios, requisitos de visado) en fuentes oficiales antes de viajar',
          'No dependa únicamente de las recomendaciones de IA para decisiones críticas de seguridad',
          'Consulte los avisos de viaje actuales de su gobierno',
        ],
      },
      {
        heading: '4. Normas de uso',
        body: [
          'Usar el servicio para cualquier propósito ilegal',
          'Intentar realizar ingeniería inversa, scraping o abusar de la API',
          'Enviar contenido dañino, ofensivo o engañoso',
          'Compartir las credenciales de su cuenta con otros',
          'Usar herramientas automatizadas para generar solicitudes excesivas',
        ],
      },
      {
        heading: '5. Terminación de cuenta',
        body: 'Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos, abusen del servicio o realicen actividades fraudulentas. Puede eliminar su cuenta en cualquier momento desde la configuración de perfil.',
      },
      {
        heading: '6. Propiedad intelectual',
        body: 'El servicio, incluido su diseño, código y contenido, es propiedad de China AI Travel Helper. Las respuestas generadas por IA se proporcionan solo para uso personal y no pueden republicarse comercialmente sin permiso.',
      },
      {
        heading: '7. Cambios en el servicio',
        body: 'Nos reservamos el derecho de modificar o terminar el servicio en cualquier momento con previo aviso.',
      },
      {
        heading: '8. Contacto',
        body: 'Preguntas sobre estos términos: support@travelerlocal.ai',
      },
    ],
  },

  'pt-BR': {
    title: 'Termos de Serviço',
    lastUpdated: 'Última atualização: janeiro de 2025',
    backToPrivacy: 'Política de Privacidade',
    backToHome: '← Voltar ao início',
    sections: [
      {
        heading: '1. Descrição do serviço',
        body: 'China Landing AI Helper é um assistente de viagem com IA para viajantes que visitam a China, oferecendo planejamento de roteiros, guias de transporte e recomendações gastronômicas. O serviço é fornecido "como está" apenas para fins informativos.',
      },
      {
        heading: '2. Aceitação dos termos',
        body: 'Ao usar este serviço, você concorda com estes termos. Se não concordar, não use o serviço. Podemos atualizar estes termos a qualquer momento; o uso continuado constitui aceitação dos termos atualizados.',
      },
      {
        heading: '3. Isenção de responsabilidade',
        body: [
          'Informações de viagem geradas por IA podem ser imprecisas ou desatualizadas',
          'Verifique todas as informações (horários, preços, requisitos de visto) em fontes oficiais antes de viajar',
          'Não dependa apenas de recomendações de IA para decisões críticas de segurança',
          'Consulte os avisos de viagem atuais do seu governo',
        ],
      },
      {
        heading: '4. Regras de uso',
        body: [
          'Usar o serviço para qualquer finalidade ilegal',
          'Tentar fazer engenharia reversa, scraping ou abusar da API',
          'Enviar conteúdo prejudicial, ofensivo ou enganoso',
          'Compartilhar suas credenciais de conta com outros',
          'Usar ferramentas automatizadas para gerar solicitações excessivas',
        ],
      },
      {
        heading: '5. Encerramento de conta',
        body: 'Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos, abusem do serviço ou realizem atividades fraudulentas. Você pode excluir sua conta a qualquer momento nas configurações de perfil.',
      },
      {
        heading: '6. Propriedade intelectual',
        body: 'O serviço, incluindo seu design, código e conteúdo, é de propriedade da China AI Travel Helper. As respostas geradas por IA são fornecidas apenas para uso pessoal e não podem ser republicadas comercialmente sem permissão.',
      },
      {
        heading: '7. Alterações no serviço',
        body: 'Reservamo-nos o direito de modificar ou encerrar o serviço a qualquer momento com aviso prévio.',
      },
      {
        heading: '8. Contato',
        body: 'Dúvidas sobre estes termos: support@travelerlocal.ai',
      },
    ],
  },

  'ar-SA': {
    title: 'شروط الخدمة',
    lastUpdated: 'آخر تحديث: يناير 2025',
    backToPrivacy: 'سياسة الخصوصية',
    backToHome: '→ العودة إلى الرئيسية',
    sections: [
      {
        heading: '1. وصف الخدمة',
        body: 'China Landing AI Helper هو مساعد سفر ذكي للمسافرين إلى الصين، يوفر تخطيط الرحلات وأدلة المواصلات وتوصيات المطاعم. تُقدَّم الخدمة "كما هي" لأغراض إعلامية فقط.',
      },
      {
        heading: '2. قبول الشروط',
        body: 'باستخدام هذه الخدمة، فإنك توافق على هذه الشروط. إذا لم توافق، يرجى عدم استخدام الخدمة. قد نحدّث هذه الشروط في أي وقت؛ ويُعدّ الاستمرار في الاستخدام قبولاً للشروط المحدّثة.',
      },
      {
        heading: '3. إخلاء المسؤولية',
        body: [
          'قد تكون معلومات السفر التي يولّدها الذكاء الاصطناعي غير دقيقة أو قديمة',
          'تحقق من جميع المعلومات (أوقات العمل، الأسعار، متطلبات التأشيرة) من المصادر الرسمية قبل السفر',
          'لا تعتمد فقط على توصيات الذكاء الاصطناعي في القرارات الحرجة المتعلقة بالسلامة',
          'راجع تحذيرات السفر الحالية الصادرة عن حكومتك',
        ],
      },
      {
        heading: '4. قواعد الاستخدام',
        body: [
          'استخدام الخدمة لأي غرض غير قانوني',
          'محاولة الهندسة العكسية أو الاستخراج أو إساءة استخدام واجهة برمجة التطبيقات',
          'إرسال محتوى ضار أو مسيء أو مضلل',
          'مشاركة بيانات اعتماد حسابك مع الآخرين',
          'استخدام أدوات آلية لتوليد طلبات مفرطة',
        ],
      },
      {
        heading: '5. إنهاء الحساب',
        body: 'نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تنتهك هذه الشروط أو تسيء استخدام الخدمة أو تمارس نشاطاً احتيالياً. يمكنك حذف حسابك في أي وقت من إعدادات الملف الشخصي.',
      },
      {
        heading: '6. الملكية الفكرية',
        body: 'الخدمة بما تشمله من تصميم وكود ومحتوى مملوكة لـ China AI Travel Helper. تُقدَّم الردود التي يولّدها الذكاء الاصطناعي للاستخدام الشخصي فقط ولا يجوز إعادة نشرها تجارياً دون إذن.',
      },
      {
        heading: '7. تغييرات الخدمة',
        body: 'نحتفظ بالحق في تعديل الخدمة أو إنهائها في أي وقت مع إشعار مسبق.',
      },
      {
        heading: '8. التواصل معنا',
        body: 'استفسارات حول هذه الشروط: support@travelerlocal.ai',
      },
    ],
  },
};

function detectLocale(): string {
  if (typeof window === 'undefined') return 'en-US';
  const saved = localStorage.getItem('preferred-locale');
  if (saved && termsContent[saved]) return saved;
  const nav = navigator.language || 'en-US';
  if (termsContent[nav]) return nav;
  const prefix = nav.split('-')[0];
  const match = Object.keys(termsContent).find(k => k.startsWith(prefix));
  return match || 'en-US';
}

export default function TermsPage() {
  const [locale, setLocale] = useState('en-US');
  useEffect(() => { setLocale(detectLocale()); }, []);
  const content = termsContent[locale] || termsContent['en-US'];
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
          <Link href="/privacy" className="hover:text-[#ff5a5f]">{content.backToPrivacy}</Link>
          <Link href="/" className="hover:text-[#ff5a5f]">{content.backToHome}</Link>
        </div>
      </div>
    </div>
  );
}
