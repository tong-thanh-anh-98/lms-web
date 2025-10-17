import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../common/Layout';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import UserSidebar from '../../common/UserSidebar';
import { apiUrl, getToken } from '../../common/Config';
import { toast } from 'react-toastify';
import ProfileImage from './ProfileImage';

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm();
    const [user, setUser] = useState([]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/update-user`, {
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
            } else if (result.status === 400 && result.error) {
                Object.entries(result.error).forEach(([field, messages]) => {
                    setError(field, {
                        type: 'server',
                        message: messages[0]
                    });
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

    const fetchUser = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/fetch-user`, {
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
                reset({
                    name: result.data.name,
                    email: result.data.email,
                });
                setUser(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Failed to load user info!', error);
        }
    }, [i18n.language, reset]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <>
            <Layout>
                <section className='section-4'>
                    <div className='container pb-5 pt-3'>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/account/profile">{t('profile.account')}</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    {t('profile.profile')}
                                </li>
                            </ol>
                        </nav>

                        <div className='row'>
                            <div className='col-md-12 mt-5 mb-3'>
                                <div className='d-flex justify-content-between'>
                                    <h2 className='h4 mb-0 pb-0'>{t('profile.profile')}</h2>
                                </div>
                            </div>

                            <div className='col-lg-3 account-sidebar'>
                                <UserSidebar />
                            </div>

                            <div className='col-lg-9'>
                                <div className='row'>
                                    <div className="col-md-8">
                                        <div className="card p-3 border-0 shadow-lg">
                                            <div className="card-boy">
                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                    <div className="mb-3">
                                                        <label htmlFor="comment" className="form-label">{t('label.name')}</label>
                                                        <input
                                                            {...register("name", { required: t('required.name') })}
                                                            type="name"
                                                            className={`form-control ${errors.name && 'is-invalid'}`}
                                                            placeholder={t('placeholder.name')}
                                                        />
                                                        {
                                                            errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                                                        }
                                                    </div>
                                                    <div className='mb-3'>
                                                        <label className='form-label' htmlFor="email">{t('label.email')}</label>
                                                        <input
                                                            {...register("email", {
                                                                required: t('required.email'),
                                                                pattern: {
                                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                    message: t('message.email_invalid')
                                                                }
                                                            })}
                                                            type="text"
                                                            className={`form-control ${errors.email && 'is-invalid'}`}
                                                            placeholder={t('placeholder.email')}
                                                        />
                                                        {
                                                            errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                                                        }
                                                    </div>
                                                    <button disabled={loading} type="submit" className='btn btn-primary'>
                                                        {loading ? t('button.loading') : t('button.update')}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="card-boy">
                                            <ProfileImage user={user} setUser={setUser} />
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

export default Profile