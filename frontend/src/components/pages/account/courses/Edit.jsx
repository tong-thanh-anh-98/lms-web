import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../../common/Layout';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserSidebar from '../../../common/UserSidebar';
import { apiUrl, token } from '../../../common/Config';
import { toast } from 'react-toastify';

const Edit = () => {
    const { t, i18n } = useTranslation();
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const fetchCourses = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/courses/show/${params.id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            const data = result.data;
            setCourses(data);

            if (response.ok && result.status === 200) {
                reset({
                    title: data.title,
                    category: data.category_id,
                    level: data.level_id,
                    language: data.language_id,
                    description: data.description,
                    price: data.price,
                    cross_price: data.cross_price
                });
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Create failed:', error);
        }
    }, [i18n.language, params.id, reset]);

    const onSubmit = async (data) => {
        setDisable(true);

        try {
            const response = await fetch(`${apiUrl}/courses/${params.id}`, {
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
                navigate('/courses');
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Create failed:', error);
        } finally {
            setDisable(false);
        }
    }

    const fetchMetaData = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/courses/meta-data`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok && result.status === 200) {
                setCategories(result.categories);
                setLevels(result.levels);
                setLanguages(result.languages);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Create failed:', error);
        }
    }, [i18n.language, setCategories, setLevels, setLanguages]);

    useEffect(() => {
        fetchCourses();
        fetchMetaData();
    }, [fetchCourses, fetchMetaData]);

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
                                <div className="col-md-7">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="card border-0 shadow-lg">
                                            <div className="card-body p-4">
                                                <h4 className="h5 border-bottom pb-3 mb-3">{t('course.detail')}</h4>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="title">{t('label.title')}</label>
                                                    <input
                                                        {...register("title", { required: t('required.title') })}
                                                        type="text"
                                                        className={`form-control ${errors.name && 'is-invalid'}`}
                                                        placeholder={t('placeholder.title')}
                                                    />
                                                    {
                                                        errors.title && <p className='invalid-feedback'>{errors.title?.message}</p>
                                                    }
                                                </div>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="category">{t('label.category')}</label>

                                                    <select className='form-select' id='category' {...register('category')}>
                                                        <option value="">{t('select.category')}</option>

                                                        {
                                                            categories && categories.map(category => {
                                                                return (
                                                                    <option key={`category-${category.id}`} value={category.id}>{category.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="level">{t('label.level')}</label>

                                                    <select className='form-select' id='level' {...register('level')}>
                                                        <option value="">{t('select.level')}</option>

                                                        {
                                                            levels && levels.map(level => {
                                                                return (
                                                                    <option key={`level-${level.id}`} value={level.id}>{level.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="language">{t('label.language')}</label>

                                                    <select className='form-select' id='language' {...register('language')}>
                                                        <option value="">{t('select.language')}</option>

                                                        {
                                                            languages && languages.map(language => {
                                                                return (
                                                                    <option key={`language-${language.id}`} value={language.id}>{language.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="description">{t('label.description')}</label>

                                                    <textarea
                                                        className='form-control'
                                                        id='description'
                                                        rows={5}
                                                        placeholder={t('placeholder.description')}
                                                    >
                                                    </textarea>
                                                </div>

                                                <h4 className="h5 border-bottom pb-3 mb-3">{t('course.pricing')}</h4>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="sell-price">{t('label.sellPrice')}</label>
                                                    <input
                                                        {...register("price")}
                                                        type="text"
                                                        id='sell-price'
                                                        className={`form-control ${errors.name && 'is-invalid'}`}
                                                        placeholder={t('placeholder.sellPrice')}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="cross-price">{t('label.crossPrice')}</label>
                                                    <input
                                                        {...register("cross_price")}
                                                        type="text"
                                                        id='cross-price'
                                                        className={`form-control ${errors.name && 'is-invalid'}`}
                                                        placeholder={t('placeholder.crossPrice')}
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <button disabled={disable} type="submit" className='btn btn-primary'>
                                                        {disable ? t('button.loading') : t('button.update')}
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </form>
                                </div>

                                <div className="col-md-5">

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Edit