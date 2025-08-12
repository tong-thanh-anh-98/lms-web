import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Layout from '../../../common/Layout';
import { Link, useParams } from 'react-router-dom';
import UserSidebar from '../../../common/UserSidebar';
import { apiUrl, token } from '../../../common/Config';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import LessonVideo from './LessonVideo';

const EditLesson = ({ placeholder }) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [lesson, setLesson] = useState([]);
    const [chapters, setChapters] = useState([]);
    const { register, setError, handleSubmit, reset, formState: { errors } } = useForm();

    const [courseId, setCourseId] = useState(null);

    const editor = useRef(null);
    const [description, setDescription] = useState('');
    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || ''
    }),
        [placeholder]
    );

    const fetchLessons = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/lessons/${params.id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            const data = result.data;

            if (response.ok && result.status === 200) {
                setLesson(data);
                setCourseId(data.course_id); // lưu course_id
                reset({
                    title: data.title,
                    chapter_id: data.chapter_id,
                    is_free_preview: data.is_free_preview === 'yes' || data.is_free_preview === 1 || data.is_free_preview === true,
                    duration: data.duration,
                    status: data.status,
                });
                setDescription(data.description);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }, [i18n.language, params.id, reset]);

    const onSubmit = async (formData) => {
        setLoading(true);

        const data = {
            ...formData,
            is_free_preview: formData.is_free_preview ? 'yes' : 'no',
            description: description,
        };

        try {
            const response = await fetch(`${apiUrl}/lessons/${params.id}`, {
                method: 'PUT',
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
            } else {
                const formErrors = result.errors;
                Object.keys(formErrors).forEach((field) => {
                    setError(field, { type: 'server', message: formErrors[field][0] });
                });
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchChapters = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/chapters?course_id=${params.courseId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok && result.status === 200) {
                setChapters(result.data);
            } else {
                toast.error(result.message);
            }

        } catch (err) {
            console.error("Chapters fetch failed", err);
        }
    }, [i18n.language, params.courseId]);

    useEffect(() => {
        fetchLessons();
        fetchChapters();
    }, [fetchLessons, fetchChapters]);

    return (
        <>
            <Layout>
                <section className='section-4'>
                    <div className='container pb-5 pt-3'>
                        <div className='row'>
                            <div className='col-md-12 mt-5 mb-3'>
                                <div className='d-flex justify-content-between'>
                                    <h2 className='h4 mb-0 pb-0'>{t('lesson.edit')}</h2>
                                    <Link className='btn btn-primary' to={`/account/courses/edit/${courseId || params.courseId}`}>Back</Link>
                                </div>
                            </div>

                            <div className='col-lg-3 account-sidebar'>
                                <UserSidebar />
                            </div>

                            <div className='col-lg-9'>
                                <div className='row'>
                                    <div className="col-md-8">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="card border-0 shadow-lg">
                                                <div className="card-body p-4">
                                                    <h4 className="h5 border-bottom pb-3 mb-3">{t('lesson.detail')}</h4>

                                                    <div className="mb-3">
                                                        <label className='form-label' htmlFor="title">{t('label.title')}</label>
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

                                                    <div className="mb-3">
                                                        <label className='form-label' htmlFor="chapter">{t('label.chapter')}</label>
                                                        <select
                                                            {...register("chapter_id", { required: t('required.chapter') })}
                                                            className={`form-select ${errors.chapter_id && 'is-invalid'}`}
                                                        >
                                                            <option value="">{t('select.chapter')}</option>
                                                            {
                                                                chapters && chapters.map(chapter => {
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
                                                        <label className='form-label' htmlFor="duration">{t('label.duration')}</label>
                                                        <input
                                                            {...register("duration")}
                                                            type="number"
                                                            className={`form-control ${errors.duration && 'is-invalid'}`}
                                                            placeholder={t('placeholder.duration')}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className='form-label' htmlFor="description">{t('label.description')}</label>
                                                        <JoditEditor
                                                            ref={editor}
                                                            value={description}
                                                            config={config}
                                                            tabIndex={1}
                                                            onBlur={newDescription => setDescription(newDescription)}
                                                            onChange={newDescription => setDescription(newDescription)}
                                                        />
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

                                                    <div className="d-flex">
                                                        <input
                                                            {...register("is_free_preview")}
                                                            className='form-check-input'
                                                            type="checkbox"
                                                            id='freeLesson'
                                                        />
                                                        <label htmlFor='freeLesson' className='form-check-label ms-2'>{t('label.preview')}</label>
                                                    </div>

                                                    <div className="mb-3">
                                                        <button disabled={loading} type="submit" className='btn btn-primary mt-4'>
                                                            {loading ? t('button.loading') : t('button.update')}
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </form>
                                    </div>

                                    <div className="col-md-4">
                                        <LessonVideo lesson={lesson} />
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

export default EditLesson