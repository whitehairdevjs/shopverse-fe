'use client';

import { useTranslation } from '../../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
                               <h4 className="text-lg font-semibold mb-4 text-orange-400">ShopVerse</h4>
            <p className="text-gray-400">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">{t('footer.customerSupport.title')}</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.customerSupport.center')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.customerSupport.shipping')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.customerSupport.returns')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.customerSupport.faq')}</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">{t('footer.companyInfo.title')}</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.companyInfo.about')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.companyInfo.terms')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.companyInfo.privacy')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.companyInfo.careers')}</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">{t('footer.newsletter.title')}</h5>
            <p className="text-gray-400 mb-4">{t('footer.newsletter.description')}</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder={t('footer.newsletter.emailPlaceholder')} 
                className="flex-1 px-3 py-2 rounded-l-lg border-0 text-gray-900"
              />
                                   <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-r-lg transition-colors">
                {t('footer.newsletter.subscribe')}
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
} 