import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { apiUrl, token } from '../../../common/Config';

const ManageOutcome = () => {
    const { t, i18n } = useTranslation();
    const [disable, setDisable] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setDisable(true);

        try {
            const response = await fetch(`${apiUrl}/outcomes`, {
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
        <div className="card shadow-lg border-0">
            <div className="card-body p-4">
                <div className="d-flex">
                    <h4 className="h5 mb-3">{t('course.outcome')}</h4>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <input
                            {...register("text", { required: t('required.text') })}
                            type="text"
                            className={`form-control ${errors.text && 'is-invalid'}`}
                            placeholder={t('placeholder.text')}
                        />
                        {
                            errors.text && <p className='invalid-feedback'>{errors.text?.message}</p>
                        }
                    </div>

                    <div className="mb-3">
                        <button disabled={disable} type="submit" className='btn btn-primary'>
                            {disable ? t('button.loading') : t('button.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ManageOutcome