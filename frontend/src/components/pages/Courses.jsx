import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../common/Layout';
import Course from '../common/Course';
import { useTranslation } from 'react-i18next';
import { apiUrl } from '../common/Config';
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';

const Courses = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [courses, setCourses] = useState([]);

    // đọc từ URL để khởi tạo từ state
    const [categoryChecked, setCategoryChecked] = useState(() => {
        const category = searchParams.get('category');
        return category ? category.split(',') : [];
    });

    const [levelChecked, setLevelChecked] = useState(() => {
        const level = searchParams.get('level');
        return level ? level.split(',') : [];
    });

    const [languageChecked, setLanguageChecked] = useState(() => {
        const language = searchParams.get('language');
        return language ? language.split(',') : [];
    });

    // hàm dùng chung cho checkbox
    const handleFilterChange = (e, type) => {
        const { checked, value } = e.target;

        if (type === 'category') {
            setCategoryChecked(prev => checked ? [...prev, value] : prev.filter(id => id !== value));
        }

        if (type === 'level') {
            setLevelChecked(prev => checked ? [...prev, value] : prev.filter(id => id !== value));
        }

        if (type === 'language') {
            setLanguageChecked(prev => checked ? [...prev, value] : prev.filter(id => id !== value));
        }
    };

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/fetch-categories`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                }
            });
            const result = await response.json();

            if (response.ok && response.status === 200) {
                setCategories(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }, [i18n.language]);

    const fetchLevels = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/fetch-levels`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                }
            });
            const result = await response.json();

            if (response.ok && response.status === 200) {
                setLevels(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }, [i18n.language]);

    const fetchLanguages = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/fetch-languages`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                }
            });
            const result = await response.json();

            if (response.ok && response.status === 200) {
                setLanguages(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }, [i18n.language]);

    const fetchCourses = useCallback(async () => {
        setLoading(true);

        let params = new URLSearchParams();

        if (categoryChecked.length > 0) {
            params.append('category', categoryChecked.join(','));
        }

        if (levelChecked.length > 0) {
            params.append('level', levelChecked.join(','));
        }

        if (languageChecked.length > 0) {
            params.append('language', languageChecked.join(','));
        }

        // cập nhật query string trên URL
        setSearchParams(params);

        try {
            const response = await fetch(`${apiUrl}/fetch-courses?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language
                }
            });

            const result = await response.json();

            if (response.ok && response.status === 200) {
                setCourses(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed: ', error);
        } finally {
            setLoading(false);
        }
    }, [i18n.language, categoryChecked, levelChecked, languageChecked, setSearchParams]);

    const clearFilters = () => {
        setCategoryChecked([]);
        setLevelChecked([]);
        setLanguageChecked([]);
        setSearchParams({}); // clear URL query string
        // gọi lại API để fetch toàn bộ courses
        fetchCourses();
    };

    useEffect(() => {
        fetchCategories();
        fetchLevels();
        fetchLanguages();
        fetchCourses();
    }, [fetchCategories, fetchLevels, fetchLanguages, fetchCourses]);

    return (
        <Layout>
            <div className='container pb-5 pt-3'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">{t('courses.home')}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{t('courses.courses')}</li>
                    </ol>
                </nav>
                <div className='row'>
                    <div className='col-lg-3'>
                        <div className='sidebar mb-5 card border-0'>
                            <div className='card-body shadow'>
                                <input type="text" className='form-control' placeholder={t('courses.search_placeholder')} />
                                <div className='pt-3'>
                                    <h3>{t('courses.category')}</h3>
                                    <ul>
                                        {
                                            categories && categories.map(category => {
                                                return (
                                                    <li key={category.id}>
                                                        <div className="form-check">
                                                            <input
                                                                // onClick={(e) => handCategory(e)}
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value={category.id}
                                                                id={`category-${category.id}`}
                                                                checked={categoryChecked.includes(String(category.id))}
                                                                onChange={(e) => handleFilterChange(e, 'category')}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`category-${category.id}`}
                                                            >
                                                                {category.name}
                                                            </label>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className='mb-3'>
                                    <h3 className='h5  mb-2'>{t('courses.level')}</h3>
                                    <ul>
                                        {
                                            levels && levels.map(level => {
                                                return (
                                                    <li key={level.id}>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value={level.id}
                                                                id={`level-${level.id}`}
                                                                checked={levelChecked.includes(String(level.id))}
                                                                onChange={(e) => handleFilterChange(e, 'level')}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`level-${level.id}`}
                                                            >
                                                                {level.name}
                                                            </label>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className='mb-3'>
                                    <h3 className='h5 mb-2'>{t('courses.language')}</h3>
                                    <ul>
                                        {
                                            languages && languages.map(language => {
                                                return (
                                                    <li key={language.id}>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                value={language.id}
                                                                id={`language-${language.id}`}
                                                                checked={languageChecked.includes(String(language.id))}
                                                                onChange={(e) => handleFilterChange(e, 'language')}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`language-${language.id}`}
                                                            >
                                                                {language.name}
                                                            </label>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                <Link
                                    className='clear-filter'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        clearFilters();
                                    }}
                                >
                                    {t('courses.clear_filters')}
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-9'>
                        <section className='section-3'>
                            <div className='d-flex justify-content-between mb-3 align-items-center'>
                                <div className='h5 mb-0'>

                                </div>

                                <div>
                                    <select name="" id="" className='form-select'>
                                        <option value="0">{t('courses.newest_first')}</option>
                                        <option value="1">{t('courses.oldest_first')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row gy-4">
                                {/* {
                                    courses && courses.map(course => {
                                        return (
                                            <Course
                                                key={course.id}
                                                customClasses="col-lg-4 col-md-6"
                                                course={course}
                                            />
                                        )
                                    })
                                } */}

                                {loading ? (
                                    <p>{t('button.loading')}</p>
                                ) : (
                                    courses.map(course => (
                                        <Course key={course.id} course={course} customClasses="col-lg-4 col-md-6" />
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Courses