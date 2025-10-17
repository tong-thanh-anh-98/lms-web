import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import Layout from '../../../common/Layout';
import UserSidebar from '../../../common/UserSidebar';
import { Rating } from 'react-simple-star-rating';
import { apiUrl, getToken } from '../../../common/Config';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const LeaveRating = () => {
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const [rating, setRating] = useState(0);
    const handleRating = (rate) => { setRating(rate) };
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [course, setCourse] = useState([]);
    const params = useParams();

    const onSubmit = async (data) => {
        data.course_id = course.id;
        data.rating = rating;
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/leave-rating`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (result.status === 201) {
                toast.success(result.message);
                reset({
                    comment: result.data.comment,
                    rating: result.data.rating,
                });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Something went wrong!", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourse = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/courses/${params.id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            const result = await response.json();

            if (result.status === 200) {
                setCourse(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }, [i18n.language, params.id]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    return (
        <>
            <Layout>
                <section className='section-4'>
                    <div className='container pb-5 pt-3'>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/account/dashboard">{t('rating.account')}</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    {t('rating.rating')}
                                </li>
                            </ol>
                        </nav>

                        <div className='row'>
                            <div className='col-md-12 mt-5 mb-3'>
                                <div className='d-flex justify-content-between'>
                                    <h2 className='h4 mb-0 pb-0'>{t('rating.rating')} / {course.title}</h2>
                                </div>
                            </div>

                            <div className='col-lg-3 account-sidebar'>
                                <UserSidebar />
                            </div>

                            <div className='col-lg-9'>
                                <div className='row'>
                                    <div className="card p-3 border-0 shadow-lg">
                                        <div className="card-boy">
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <div className="mb-3">
                                                    <label htmlFor="comment" className="form-label">{t('label.comment')}</label>
                                                    <textarea
                                                        {...register('comment', { required: t('required.comment') })}
                                                        id='comment'
                                                        className={`form-control ${errors.comment && 'is-invalid'}`}
                                                        rows={5}
                                                        placeholder={t('placeholder.comment')}
                                                    >
                                                    </textarea>
                                                    {
                                                        errors.comment && <p className='invalid-feedback'>{errors.comment?.message}</p>
                                                    }
                                                </div>
                                                <div className="mb-3">
                                                    <Rating onClick={handleRating} ratingValue={rating} />
                                                </div>
                                                <button disabled={loading} type="submit" className='btn btn-primary'>
                                                    {loading ? t('button.loading') : t('button.submit')}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </Layout>
        </>
    )
}

export default LeaveRating