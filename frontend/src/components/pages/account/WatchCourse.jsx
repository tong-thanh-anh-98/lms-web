import React from 'react';
import Layout from '../../common/Layout';
import Accordion from 'react-bootstrap/Accordion';
import { MdSlowMotionVideo } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useTranslation } from 'react-i18next';

const WatchCourse = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <section className='section-5 my-5'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-8'>
                            <div className='video'>
                                <video width="100%" height="500" controls>
                                    <source src="movie.mp4" type="video/mp4" />
                                    <source src="movie.ogg" type="video/ogg" />
                                    {t('watch.unsupported_browser')}
                                </video>
                            </div>
                            <div className='meta-content'>
                                <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 pt-1'>
                                    <h3 className='pt-2'>{t('watch.lesson_title')}</h3>
                                    <div>
                                        <a href="#" className='btn btn-primary px-3'>
                                            {t('button.mark_complete')} <IoMdCheckmarkCircleOutline size={20} />
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <p>{t('watch.lesson_description')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-4'>
                            <div className='card rounded-0'>
                                <div className='card-body'>
                                    <div className='h6'>
                                        <strong>{t('watch.course_title')}</strong>
                                    </div>
                                    <div className='py-2'>
                                        <ProgressBar now={50} />
                                        <div className='pt-2'>
                                            {t('watch.progress', { percent: 50 })}
                                        </div>
                                    </div>
                                    <Accordion defaultActiveKey="0" flush>
                                        <Accordion.Item eventKey="0">
                                            <Accordion.Header>{t('watch.section_1')}</Accordion.Header>
                                            <Accordion.Body className='pt-2 pb-0 ps-0'>
                                                <ul className='lessons mb-0'>
                                                    <li className='pb-2'>
                                                        <a href="#"><MdSlowMotionVideo size={20} /> {t('watch.intro')}</a>
                                                    </li>
                                                    <li className='pb-2'>
                                                        <a href="#"><MdSlowMotionVideo size={20} /> {t('watch.what_is_html')}</a>
                                                    </li>
                                                    <li className='pb-2'>
                                                        <a href="#"><MdSlowMotionVideo size={20} /> {t('watch.html_elements')}</a>
                                                    </li>
                                                </ul>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1">
                                            <Accordion.Header>{t('watch.section_2')}</Accordion.Header>
                                            <Accordion.Body className='pt-2 pb-0 ps-0'>
                                                <ul className='lessons mb-0'>
                                                    <li className='pb-2'>
                                                        <a href="#"><MdSlowMotionVideo size={20} /> {t('watch.intro')}</a>
                                                    </li>
                                                    <li className='pb-2'>
                                                        <a href="#"><MdSlowMotionVideo size={20} /> {t('watch.what_is_html')}</a>
                                                    </li>
                                                    <li className='pb-2'>
                                                        <a href="#"><MdSlowMotionVideo size={20} /> {t('watch.html_elements')}</a>
                                                    </li>
                                                </ul>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default WatchCourse;