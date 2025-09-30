import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../common/Layout';
import CourseEnrolled from '../../common/CourseEnrolled';
import UserSidebar from '../../common/UserSidebar';
import { useTranslation } from 'react-i18next';
import { apiUrl, getToken } from '../../common/Config';
import { toast } from 'react-toastify';
import Loading from '../../common/Loading';
import NotFound from '../../common/NotFound';

const MyLearning = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [enrollments, setEnrollments] = useState([]);

    const fetchEnrollments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/enrollments`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            const result = await response.json();

            if (response.status === 200) {
                setEnrollments(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchEnrollments();
    }, [fetchEnrollments]);

    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='d-flex justify-content-between mt-5 mb-3'>
                            <h2 className='h4 mb-0 pb-0'>{t('title.my_learning')}</h2>
                            <a href="#" className='btn btn-primary'>{t('button.create')}</a>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9 mt-2'>
                            <div className='row gy-4'>
                                {
                                    loading ? (
                                        <Loading />
                                    ) : enrollments.length === 0 ? (
                                        <NotFound />
                                    ) : (
                                        enrollments.map((enrollment) => (
                                            <CourseEnrolled key={enrollment.id} enrollment={enrollment} />
                                        ))
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default MyLearning;