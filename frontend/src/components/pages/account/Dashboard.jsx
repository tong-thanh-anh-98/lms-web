import React from 'react';
import Layout from '../../common/Layout';
import { Link } from 'react-router-dom';
import UserSidebar from '../../common/UserSidebar';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/account">{t('dashboard.account')}</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                {t('dashboard.title')}
                            </li>
                        </ol>
                    </nav>

                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>{t('dashboard.title')}</h2>
                            </div>
                        </div>

                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>

                        <div className='col-lg-9'>
                            <div className='row'>

                                <div className='col-md-4'>
                                    <div className='card shadow'>
                                        <div className='card-body p-3'>
                                            <h2>0</h2>
                                            <span>{t('dashboard.sales')}</span>
                                        </div>
                                        <div className='card-footer'>&nbsp;</div>
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className='card shadow'>
                                        <div className='card-body p-3'>
                                            <h2>0</h2>
                                            <span>{t('dashboard.enrolled_users')}</span>
                                        </div>
                                        <div className='card-footer'>&nbsp;</div>
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className='card shadow'>
                                        <div className='card-body p-3'>
                                            <h2>0</h2>
                                            <span>{t('dashboard.active_courses')}</span>
                                        </div>
                                        <div className='card-footer'>
                                            <Link to="/admin/orders">{t('dashboard.view_courses')}</Link>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Dashboard;