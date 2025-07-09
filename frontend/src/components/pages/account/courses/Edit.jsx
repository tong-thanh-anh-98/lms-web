import React, { useState } from 'react';
import Layout from '../../../common/Layout';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import UserSidebar from '../../../common/UserSidebar';
import { apiUrl, token } from '../../../common/Config';
import { toast } from 'react-toastify';

const Edit = () => {
    const { t, i18n } = useTranslation();
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setDisable(true);

        try {
            const response = await fetch(`${apiUrl}/courses`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log(result.data);

            if (response.ok && result.status === 201) {
                toast.success(result.message);
                navigate('/account/courses');
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Create failed:', error);
        } finally {
            setDisable(false);
        }
    }

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/account">{t('common.account')}</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                {t('course.course')}
                            </li>
                        </ol>
                    </nav>

                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>{t('course.edit')}</h2>
                            </div>
                        </div>

                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>

                        <div className='col-lg-9'>
                            <div className='row'>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="card border-0 shadow-lg">
                                        <div className="card-body p-4">
                                            <div className="mb-3">
                                                <label htmlFor="title">{t('label.title')}</label>
                                                <input
                                                    {...register("title", { required: t('required.title') })}
                                                    type="text"
                                                    className={`form-control ${errors.name && 'is-invalid'}`}
                                                    placeholder={t('placeholder.title')}
                                                />
                                                {
                                                    errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                                                }
                                            </div>
                                            <div className="mb-3">
                                                <button disabled={disable} type="submit" className='btn btn-primary'>
                                                    {disable ? t('button.loading') : t('button.continue')}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Edit