import React from 'react';
import Layout from '../../common/Layout';
import { Link } from 'react-router-dom';
import UserSidebar from '../../common/UserSidebar';
import CourseEdit from '../../common/CourseEdit';
import { useTranslation } from 'react-i18next';

const MyCourses = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>{t('my_courses.title')}</h2>
                                <Link to="/account/my-courses/create" className='btn btn-primary'>
                                    {t('button.create')}
                                </Link>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className='row gy-4'>
                                <CourseEdit />
                                <CourseEdit />
                                <CourseEdit />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default MyCourses;