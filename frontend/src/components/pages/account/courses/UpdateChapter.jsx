import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { apiUrl, token } from '../../../common/Config';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

const UpdateChapter = ({ chapterData, showChapter, handleClose, setChapters }) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const formData = { ...data, course_id: chapterData.course_id };
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/chapters/${chapterData.id}`, {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.status === 201) {
                setChapters({ type: "UPDATE_CHAPTER", payload: result.data });
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chapterData) {
            reset({
                title: chapterData.title
            });
        }
    }, [chapterData, reset]);
    return (
        <>
            <Modal size='lg' show={showChapter} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('course.update_chapter')}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="mb-3">
                            <label htmlFor="title" className='form-label'>{t('label.title')}</label>
                            <input
                                {...register("title", { required: t('required.title') })}
                                type="text"
                                className={`form-control ${errors.title && 'is-invalid'}`}
                                placeholder={t('placeholder.title')}
                            />
                            {
                                errors.title && <p className='invalid-feedback'>{errors.title?.message}</p>
                            }
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <button disabled={loading} type="submit" className='btn btn-primary'>
                            {loading ? t('button.loading') : t('button.save')}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal >
        </>
    )
}

export default UpdateChapter