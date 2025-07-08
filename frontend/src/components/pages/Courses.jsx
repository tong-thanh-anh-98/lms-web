import React, { useState } from 'react';
import Layout from '../common/Layout';
import Course from '../common/Course';
import { useTranslation } from 'react-i18next';

const Courses = () => {
    const { t } = useTranslation();
    const [rating, setRating] = useState(4.0);

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
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                    <label>{t('courses.web_development')}</label>
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault2" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault2">
                                                    {t('courses.mobile_development')}
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault3" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault3">
                                                    {t('courses.digital_marketing')}
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault4" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault4">
                                                    {t('courses.graphic_design')}
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault5" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault5">
                                                   {t('courses.software_design')}
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className='mb-3'>
                                    <h3 className='h5  mb-2'>{t('courses.level')}</h3>
                                    <ul>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault11" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault11">
                                                    {t('courses.beginner')}
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault12" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault12">
                                                    {t('courses.intermediate')}
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault13" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault13">
                                                    {t('courses.advance')}
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className='mb-3'>
                                    <h3 className='h5 mb-2'>{t('courses.language')}</h3>
                                    <ul>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault31" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault31">
                                                    {t('courses.english')}
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault32" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault32">
                                                    {t('courses.hindi')}
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault33" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault33">
                                                    {t('courses.spanish')}
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault33" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault33">
                                                    {t('courses.german')}
                                                </label>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault34" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault34">
                                                    {t('courses.italian')}
                                                </label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <a href="" className='clear-filter'>{t('courses.clear_filters')}</a>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-9'>
                        <section className='section-3'>
                            <div className='d-flex justify-content-between mb-3 align-items-center'>
                                <div className='h5 mb-0'>
                                    {/* 10 courses found */}
                                </div>
                                <div>
                                    <select name="" id="" className='form-select'>
                                        <option value="0">{t('courses.newest_first')}</option>
                                        <option value="1">{t('courses.oldest_first')}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row gy-4">

                                <Course
                                    title='The complete 2025 Web Development Bootcamp'
                                    level='Advance'
                                    enrolled='10'
                                    customClasses="col-lg-4 col-md-6"
                                />
                                <Course
                                    title='The complete 2025 Web Development Bootcamp'
                                    level='Advance'
                                    enrolled='10'
                                    customClasses="col-lg-4 col-md-6"
                                />
                                <Course
                                    title='The complete 2025 Web Development Bootcamp'
                                    level='Advance'
                                    enrolled='10'
                                    customClasses="col-lg-4 col-md-6"
                                />
                                <Course
                                    title='The complete 2025 Web Development Bootcamp'
                                    level='Advance'
                                    enrolled='10'
                                    customClasses="col-lg-4 col-md-6"
                                />
                                <Course
                                    title='The complete 2025 Web Development Bootcamp'
                                    level='Advance'
                                    enrolled='10'
                                    customClasses="col-lg-4 col-md-6"
                                />
                                <Course
                                    title='The complete 2025 Web Development Bootcamp'
                                    level='Advance'
                                    enrolled='10'
                                    customClasses="col-lg-4 col-md-6"
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Courses