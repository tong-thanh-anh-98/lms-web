import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../common/Layout';
import { Link } from 'react-router-dom';
import UserSidebar from '../../common/UserSidebar';
import CourseEdit from '../../common/CourseEdit';
import { useTranslation } from 'react-i18next';
import { apiUrl, getToken } from '../../common/Config';
import { toast } from 'react-toastify';
import Loading from '../../common/Loading';
import NotFound from '../../common/NotFound';

const MyCourses = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/my-courses`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            const result = await response.json();

            if (response.ok && result.status === 200) {
                setCourses(result.data);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    }, [i18n.language]);

    const handleDeleteSuccess = () => {
        fetchCourses(); // gọi lại API để load danh sách mới
    };

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>{t('my_courses.title')}</h2>
                                <Link to="/account/courses/create" className='btn btn-primary'>{t('button.create')}</Link>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9 mt-2'>
                            <div className='row gy-4'>
                                {
                                    loading ? (
                                        <Loading />
                                    ) : courses.length === 0 ? (
                                        <NotFound />
                                    ) : (
                                        courses && courses.map(course => (
                                            <CourseEdit
                                                key={course.id}
                                                course={course}
                                                onDeleteSuccess={handleDeleteSuccess}
                                            />
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

export default MyCourses;