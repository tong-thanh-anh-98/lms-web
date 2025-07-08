import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer >
            <div className='pt-5 container mt-5'>
                <div className='row pb-3 gy-4 justify-content-center'>

                    <div className='col-lg-3 col-12'>
                        <div className='col-lg-12 col-md-6 col-12 pe-lg-5'>
                            <h2>{t('footer.brand')}</h2>
                            <p>{t('footer.description')}</p>
                        </div>
                    </div>

                    <div className='col-lg-3 col-md-6 col-12'>
                        <h2>{t('footer.popular_categories')}</h2>
                        <ul>
                            <li><a href="#">{t('footer.categories.digital_marketing')}</a></li>
                            <li><a href="#">{t('footer.categories.web_development')}</a></li>
                            <li><a href="#">{t('footer.categories.machine_learning')}</a></li>
                            <li><a href="#">{t('footer.categories.web_design')}</a></li>
                            <li><a href="#">{t('footer.categories.logo_design')}</a></li>
                            <li><a href="#">{t('footer.categories.graphic_design')}</a></li>
                        </ul>
                    </div>

                    <div className='col-lg-3 col-md-6 col-12'>
                        <h2>{t('footer.quick_links')}</h2>
                        <ul>
                            <li><a href="#">{t('footer.links.login')}</a></li>
                            <li><a href="#">{t('footer.links.register')}</a></li>
                            <li><a href="#">{t('footer.links.my_account')}</a></li>
                            <li><a href="#">{t('footer.links.courses')}</a></li>
                        </ul>
                    </div>

                </div>
                <div className='row copyright'>
                    <div className='col-md-12 text-center py-4'>
                        &copy; 2025 {t('footer.copyright')}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer