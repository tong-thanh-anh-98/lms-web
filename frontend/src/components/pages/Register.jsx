import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import Layout from '../common/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../common/Config';
import { toast } from 'react-toastify';

const Register = () => {
    const { t, i18n} = useTranslation();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm();
    const navigate = useNavigate();
    const [disable, setDisable] = useState(false);

    const onSubmit = async (data) => {
        setDisable(true);

        try {
            const response = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            // console.log(result.data);

            if (response.ok && result.status === 201) {
                toast.success(result.message);
                navigate('/account/login');
            } else {
                const formErrors = result.errors;
                Object.keys(formErrors).forEach((field) => {
                    setError(field, { type: 'server', message: formErrors[field][0] });
                });
            }

        } catch (error) {
            console.error('Register failed:', error);
        } finally {
            setDisable(false);
        }
    }

    return (
        <Layout>
            <div className='container py-5 mt-5'>
                <div className='d-flex align-items-center justify-content-center'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='card border-0 shadow register'>
                            <div className='card-body p-4'>
                                <h3 className='border-bottom pb-3 mb-3'>{t('title.register')}</h3>

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="name">{t('label.name')}</label>
                                    <input
                                        {...register("name", { required: t('required.name') })}
                                        type="text"
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

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="password">{t('label.password')}</label>
                                    <input
                                        {...register("password", { required: t('required.password') })}
                                        type="password"
                                        className={`form-control ${errors.password && 'is-invalid'}`}
                                        placeholder={t('placeholder.password')}
                                    />
                                    {
                                        errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>
                                    }
                                </div>

                                <div>
                                    <button disabled={disable} type="submit" className="btn btn-primary w-100">
                                        {disable ? t('button.loading') : t('button.register')}
                                    </button>
                                </div>

                                <div className='d-flex justify-content-center py-3'>
                                    {t('message.have_account')} &nbsp;<Link className='text-secondary' to={`/account/login`}> {t('link.login')}</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Register