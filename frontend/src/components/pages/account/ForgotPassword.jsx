import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../../common/Config';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
    const { t, i18n } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': i18n.language
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.status === 200) {
                toast.success(result.message);
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
            <div className='container py-5 mt-5'>
                <div className='d-flex align-items-center justify-content-center'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='card border-0 shadow login'>
                            <div className='card-body p-4'>
                                <h3 className='border-bottom pb-3 mb-3'>{t('title.forgotPassword')}</h3>
                                <div className="mb-3">
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

                                <div>
                                    <button disabled={loading} className="btn btn-primary w-100" type="submit">
                                        {loading ? t('button.loading') : t('button.send_link')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
