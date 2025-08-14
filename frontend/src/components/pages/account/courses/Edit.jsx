import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../../common/Layout';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import UserSidebar from '../../../common/UserSidebar';
import { apiUrl, token } from '../../../common/Config';
import { toast } from 'react-toastify';
import ManageOutcome from './ManageOutcome';
import ManageRequirement from './ManageRequirement';
import EditCover from './EditCover';
import { NumericFormat } from 'react-number-format';
import ManageChapter from './ManageChapter';

const Edit = () => {
    const { t, i18n } = useTranslation();
    const [disable, setDisable] = useState(false);
    const params = useParams();
    const [course, setCourse] = useState([]);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const { register, reset, setError, handleSubmit, setValue, formState: { errors }, control } = useForm();

    // format price
    const price = useWatch({ control, name: "price" });
    const crossPrice = useWatch({ control, name: "cross_price" });

    const fetchCourses = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/courses/${params.id}`, {
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

            if (response.ok && result.status === 200) {
                reset({
                    title: data.title,
                    category_id: data.category_id,
                    level_id: data.level_id,
                    language_id: data.language_id,
                    description: data.description,
                    price: data.price,
                    cross_price: data.cross_price,
                });
                setCourse(data);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }, [i18n.language, params.id, reset]);

    const fetchMetaData = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/get-courses/meta-data`, {
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
            console.error('Fetch failed:', error);
        }
    }, [i18n.language, setCategories, setLevels, setLanguages]);

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

            if (response.ok && result.status === 200) {
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
            setDisable(false);
        }
    }

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
                                                        className={`form-control ${errors.title && 'is-invalid'}`}
                                                        placeholder={t('placeholder.title')}
                                                    />
                                                    {
                                                        errors.title && <p className='invalid-feedback'>{errors.title?.message}</p>
                                                    }
                                                </div>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="category">{t('label.category')}</label>

                                                    <select
                                                        {...register('category_id', { required: t('required.category') })}
                                                        id='category'
                                                        className={`form-select ${errors.category_id && 'is-invalid'}`}
                                                    >
                                                        <option value="">{t('select.category')}</option>

                                                        {
                                                            categories && categories.map(category => {
                                                                return (
                                                                    <option key={`category-${category.id}`} value={category.id}>{category.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {
                                                        errors.category_id && <p className='invalid-feedback'>{errors.category_id?.message}</p>
                                                    }
                                                </div>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="level">{t('label.level')}</label>

                                                    <select
                                                        {...register('level_id', { required: t('required.level') })}
                                                        id='level'
                                                        className={`form-select ${errors.level_id && 'is-invalid'}`}
                                                    >
                                                        <option value="">{t('select.level')}</option>

                                                        {
                                                            levels && levels.map(level => {
                                                                return (
                                                                    <option key={`level-${level.id}`} value={level.id}>{level.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {
                                                        errors.level_id && <p className='invalid-feedback'>{errors.level_id?.message}</p>
                                                    }
                                                </div>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="language">{t('label.language')}</label>

                                                    <select
                                                        {...register('language_id', { required: t('required.language') })}
                                                        id='language'
                                                        className={`form-select ${errors.language_id && 'is-invalid'}`}
                                                    >
                                                        <option value="">{t('select.language')}</option>

                                                        {
                                                            languages && languages.map(language => {
                                                                return (
                                                                    <option key={`language-${language.id}`} value={language.id}>{language.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {
                                                        errors.language_id && <p className='invalid-feedback'>{errors.language_id?.message}</p>
                                                    }
                                                </div>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="description">{t('label.description')}</label>

                                                    <textarea
                                                        {...register("description")}
                                                        id='description'
                                                        className={`form-control`}
                                                        rows={5}
                                                        placeholder={t('placeholder.description')}
                                                    >
                                                    </textarea>
                                                </div>

                                                <h4 className="h5 border-bottom pb-3 mb-3">{t('course.pricing')}</h4>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="sell-price">{t('label.sellPrice')}</label>
                                                    {/* <input
                                                        {...register("price", { required: t('required.sellPrice') })}
                                                        type="text"
                                                        id='sell-price'
                                                        className={`form-control ${errors.price && 'is-invalid'}`}
                                                        placeholder={t('placeholder.sellPrice')}
                                                    /> */}
                                                    <NumericFormat
                                                        value={price}
                                                        thousandSeparator="."
                                                        decimalSeparator=","
                                                        suffix=" ₫"
                                                        allowNegative={false}
                                                        className={`form-control ${errors.price && 'is-invalid'}`}
                                                        placeholder={t('placeholder.sellPrice')}
                                                        onValueChange={(values) => {
                                                            setValue("price", values.value); // Lưu giá trị dạng số
                                                        }}
                                                    />
                                                    {
                                                        errors.price && <p className='invalid-feedback'>{errors.price?.message}</p>
                                                    }
                                                </div>

                                                <div className="mb-3">
                                                    <label className='form-label' htmlFor="cross-price">{t('label.crossPrice')}</label>
                                                    {/* <input
                                                        {...register("cross_price")}
                                                        type="text"
                                                        id='cross-price'
                                                        className={`form-control`}
                                                        placeholder={t('placeholder.crossPrice')}
                                                    /> */}
                                                    <NumericFormat
                                                        value={crossPrice}
                                                        thousandSeparator="."
                                                        decimalSeparator=","
                                                        suffix=" ₫"
                                                        allowNegative={false}
                                                        className="form-control"
                                                        placeholder={t('placeholder.crossPrice')}
                                                        onValueChange={(values) => {
                                                            setValue("cross_price", values.value);
                                                        }}
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

                                    <ManageChapter
                                        course={course}
                                        params={params}
                                        refreshCourse={fetchCourses}
                                    />
                                </div>

                                <div className="col-md-5">
                                    <ManageOutcome />

                                    <ManageRequirement />

                                    <EditCover
                                        course={course}
                                        setCourse={setCourse}
                                    />
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