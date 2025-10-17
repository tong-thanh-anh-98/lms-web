import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiUrl } from '../../common/Config';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [params] = useSearchParams();

    // Lưu token và email tạm thời từ URL (chỉ lần đầu tiên)
    useEffect(() => {
        const token = params.get('token');
        const email = params.get('email');

        if (token && email) {
            sessionStorage.setItem('reset_token', token);
            sessionStorage.setItem('reset_email', email);
            // Xóa token/email khỏi URL để bảo mật
            window.history.replaceState({}, document.title, '/reset-password');
        }
    }, [params]);

    const onSubmit = async (data) => {
        setLoading(true);
        const token = sessionStorage.getItem('reset_token');
        const email = sessionStorage.getItem('reset_email');

        if (!token || !email) {
            toast.error('Invalid or expired reset link.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'accept-language': i18n.language
                },
                body: JSON.stringify({
                    email,
                    token,
                    password: data.password,
                    password_confirmation: data.password_confirmation
                }),
            });
            const result = await res.json();

            if (result.status === 200) {
                toast.success(result.message);
                // Xóa token sau khi đổi xong
                sessionStorage.removeItem('reset_token');
                sessionStorage.removeItem('reset_email');
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
        <div className='container py-5 mt-5'>
            <div className='d-flex align-items-center justify-content-center'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='card border-0 shadow login'>
                        <div className='card-body p-4'>
                            <h3 className='border-bottom pb-3 mb-3'>{t('title.resetPassword')}</h3>

                            <div className='mb-3'>
                                <label className='form-label' htmlFor="password">{t('label.newPassword')}</label>
                                <input
                                    {...register("password", { required: t('required.password') })}
                                    type="password"
                                    className={`form-control ${errors.password && 'is-invalid'}`}
                                    placeholder={t('placeholder.password')}
                                />
                                {errors.password && <p className='invalid-feedback'>{errors.password?.message}</p>}
                            </div>

                            <div className='mb-3'>
                                <label className='form-label' htmlFor="password_confirmation">{t('label.confirmPassword')}</label>
                                <input
                                    {...register("password_confirmation", { required: t('required.password_confirmation') })}
                                    type="password"
                                    className={`form-control ${errors.password_confirmation && 'is-invalid'}`}
                                    placeholder={t('placeholder.password_confirmation')}
                                />
                                {errors.password_confirmation && <p className='invalid-feedback'>{errors.password_confirmation?.message}</p>}
                            </div>

                            <div className='d-flex justify-content-between align-items-center'>
                                <button disabled={loading} className="btn btn-success" type="submit">
                                    {loading ? t('button.loading') : t('button.resetPassword')}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
