import React, { useState } from 'react';
import Layout from '../../common/Layout';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import UserSidebar from '../../common/UserSidebar';
import { apiUrl, getToken } from '../../common/Config';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ChangePassword = ({ userEmail }) => {
    const { t, i18n } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = { ...data, email: userEmail };
            const res = await fetch(`${apiUrl}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (result.status === 200) {
                toast.success(result.message);
                navigate('/login');
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error('Something went wrong', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Layout>
                <section className='section-4'>
                    <div className='container pb-5 pt-3'>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/account/profile">{t('change_password.account')}</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    {t('change_password.change_password')}
                                </li>
                            </ol>
                        </nav>

                        <div className='row'>
                            <div className='col-md-12 mt-5 mb-3'>
                                <div className='d-flex justify-content-between'>
                                    <h2 className='h4 mb-0 pb-0'>{t('change_password.change_password')}</h2>
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
                                                    <label className='form-label' htmlFor="password">{t('label.current_password')}</label>
                                                    <input
                                                        {...register("current_password", { required: t('required.current_password') })}
                                                        type="password"
                                                        className={`form-control ${errors.current_password && 'is-invalid'}`}
                                                        placeholder={t('placeholder.current_password')}
                                                    />
                                                    {
                                                        errors.current_password && <p className='invalid-feedback'>{errors.current_password?.message}</p>
                                                    }
                                                </div>
                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="password">{t('label.new_password')}</label>
                                                    <input
                                                        {...register("password", { required: t('required.new_password') })}
                                                        type="password"
                                                        className={`form-control ${errors.password && 'is-invalid'}`}
                                                        placeholder={t('placeholder.new_password')}
                                                    />
                                                    {
                                                        errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>
                                                    }
                                                </div>
                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="password">{t('label.password_confirmation')}</label>
                                                    <input
                                                        {...register("password_confirmation", { required: t('required.password_confirmation') })}
                                                        type="password"
                                                        className={`form-control ${errors.password_confirmation && 'is-invalid'}`}
                                                        placeholder={t('placeholder.password_confirmation')}
                                                    />
                                                    {
                                                        errors.password_confirmation && <p className='invalid-feedback'>{errors.password_confirmation?.message}</p>
                                                    }
                                                </div>

                                                <button disabled={loading} className="btn btn-primary" type="submit">{loading ? t('button.loading') : t('button.change')}</button>
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

export default ChangePassword