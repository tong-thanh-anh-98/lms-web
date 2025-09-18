import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../common/Layout';
import Accordion from 'react-bootstrap/Accordion';
import { MdSlowMotionVideo } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useTranslation } from 'react-i18next';
import { apiUrl, getToken } from '../../common/Config';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    MediaController,
    MediaControlBar,
    MediaTimeRange,
    MediaTimeDisplay,
    MediaVolumeRange,
    MediaPlaybackRateButton,
    MediaPlayButton,
    MediaSeekBackwardButton,
    MediaSeekForwardButton,
    MediaMuteButton,
    MediaFullscreenButton,
} from "media-chrome/react";
import Loading from '../../common/Loading';
import NotFound from '../../common/NotFound';

const WatchCourse = () => {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);

    const fetchCourse = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/enroll/${params.id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            const result = await response.json();

            if (response.status === 200) {
                setCourse(result.data);

                // Lấy bài học đầu tiên làm mặc định
                const firstLesson = result.data?.chapters?.[0]?.lessons?.[0] || null;
                setCurrentLesson(firstLesson);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    }, [i18n.language, params]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    return (
        <Layout>
            <section className='section-5 my-5'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-8'>
                            <div className='video'>
                                {loading ? (
                                    <Loading />
                                ) : !currentLesson ? (
                                    <NotFound />
                                ) : (
                                    <MediaController style={{ width: "100%", aspectRatio: "16/9" }}>
                                        <video
                                            slot="media"
                                            src={currentLesson.video_url}
                                            controls={false}
                                            style={{ width: "100%", height: "100%" }}
                                        >
                                            {t('watch.unsupported_browser')}
                                        </video>
                                        <MediaControlBar>
                                            <MediaPlayButton />
                                            <MediaSeekBackwardButton seekOffset={10} />
                                            <MediaSeekForwardButton seekOffset={10} />
                                            <MediaTimeRange />
                                            <MediaTimeDisplay showDuration />
                                            <MediaMuteButton />
                                            <MediaVolumeRange />
                                            <MediaPlaybackRateButton />
                                            <MediaFullscreenButton />
                                        </MediaControlBar>
                                    </MediaController>
                                )}
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