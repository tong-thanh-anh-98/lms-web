import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { apiUrl, token } from '../../../common/Config';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

const CreateLesson = ({ showLesson, handleCloseLesson, course }) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/lessons`, {
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

            if (response.ok && result.status === 201) {
                toast.success(result.message);

                reset({
                    'chapter_id': '',
                    'title': '',
                    'status': '',
                });

                handleCloseLesson();
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal size='lg' show={showLesson} onHide={handleCloseLesson}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('course.create_lesson')}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="mb-3">
                            <label htmlFor="chapter" className='form-label'>{t('label.chapter')}</label>
                            <select
                                {...register("chapter_id", { required: t('required.chapter') })}
                                className={`form-select ${errors.chapter_id && 'is-invalid'}`}
                            >
                                <option value="">{t('select.chapter')}</option>
                                {
                                    course.chapters && course.chapters.map(chapter => {
                                        return (
                                            <option key={`chapter-${chapter.id}`} value={chapter.id}>{chapter.title}</option>
                                        )
                                    })
                                }
                            </select>
                            {
                                errors.chapter_id && <p className='invalid-feedback'>{errors.chapter_id?.message}</p>
                            }
                        </div>

                        <div className="mb-3">
                            <label htmlFor="title" className='form-label'>{t('label.lesson')}</label>
                            <input
                                {...register("title", { required: t('required.lesson') })}
                                type="text"
                                className={`form-control ${errors.title && 'is-invalid'}`}
                                placeholder={t('placeholder.lesson')}
                            />
                            {
                                errors.title && <p className='invalid-feedback'>{errors.title?.message}</p>
                            }
                        </div>

                        <div className="mb-3">
                            <label htmlFor="status" className='form-label'>{t('label.status')}</label>
                            <select
                                {...register("status", { required: t('required.status') })}
                                className={`form-select ${errors.status && 'is-invalid'}`}
                            >
                                <option value="">{t('select.status')}</option>
                                <option value="1">{t('select.active')}</option>
                                <option value="0">{t('select.block')}</option>
                            </select>
                            {
                                errors.status && <p className='invalid-feedback'>{errors.status?.message}</p>
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

export default CreateLesson