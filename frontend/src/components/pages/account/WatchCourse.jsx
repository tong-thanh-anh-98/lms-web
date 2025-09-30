import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../../common/Layout';
import Accordion from 'react-bootstrap/Accordion';
import { MdSlowMotionVideo } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useTranslation } from 'react-i18next';
import { apiUrl, getToken } from '../../common/Config';
import { Link, useParams } from 'react-router-dom';
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
import { stripHtml } from '../../../utils/string';

const WatchCourse = () => {
    const { t, i18n } = useTranslation();
    const params = useParams();
    const [course, setCourse] = useState();
    const [activityLesson, setActivityLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [progress, setProgress] = useState(0);

    const fetchCourse = useCallback(async () => {
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
                setActivityLesson(result.activityLesson);
                setCompletedLessons(result.completedLessons);
                setProgress(result.progress);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }, [i18n.language, params]);

    const showLesson = async (lesson) => {
        setActivityLesson(lesson);

        const data = {
            lesson: lesson.id,
            chapter_id: lesson.chapter_id,
            course_id: params.id
        }

        try {
            const response = await fetch(`${apiUrl}/save-activity`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.status === 200) {
                toast.success(result.message);
                setProgress(result.progress);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }

    const markAsCompleted = async (activityLesson) => {
        const data = {
            lesson: activityLesson.id,
            chapter_id: activityLesson.chapter_id,
            course_id: params.id
        }

        try {
            const response = await fetch(`${apiUrl}/mark-as-completed`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.status === 200) {
                toast.success(result.message);

                // update cục bộ ngay
                setCompletedLessons((prev) => {
                    const newCompleted = prev.includes(activityLesson.id)
                        ? prev
                        : [...prev, activityLesson.id];

                    // Tính lại progress ngay tại đây
                    if (course && course.chapters) {
                        const totalLessons = course.chapters.reduce(
                            (sum, chap) => sum + (chap.lessons ? chap.lessons.length : 0),
                            0
                        );
                        const newProgress = totalLessons > 0
                            ? Math.round((newCompleted.length / totalLessons) * 100)
                            : 0;
                        setProgress(newProgress);
                    }

                    return newCompleted;
                });

                // nếu backend trả completedLessons thì đồng bộ lại
                if (result.completedLessons) {
                    setCompletedLessons(result.completedLessons);

                    if (course && course.chapters) {
                        const totalLessons = course.chapters.reduce(
                            (sum, chap) => sum + (chap.lessons ? chap.lessons.length : 0),
                            0
                        );
                        const newProgress = totalLessons > 0
                            ? Math.round((result.completedLessons.length / totalLessons) * 100)
                            : 0;
                        setProgress(newProgress);
                    }
                }
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    return (
        <Layout>
            {
                course &&
                <section className='section-5 my-5'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-8'>
                                {
                                    activityLesson &&
                                    <>
                                        <div className='video'>
                                            <MediaController style={{ width: "100%", aspectRatio: "16/9" }}>
                                                <video
                                                    slot="media"
                                                    src={activityLesson.video_url}
                                                    controls={false}
                                                    style={{ width: "100%", height: "100%" }}
                                                >
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
                                        </div>

                                        <div className='meta-content'>
                                            <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 pt-1'>
                                                <h3 className='pt-2'>{activityLesson.title}</h3>
                                                <div>
                                                    <button
                                                        onClick={() => markAsCompleted(activityLesson)}
                                                        className={`${completedLessons && completedLessons.includes(activityLesson.id) ? 'disabled' : ''} btn btn-primary px-3`}
                                                    >
                                                        {t('button.complete')}<IoMdCheckmarkCircleOutline size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <p>{stripHtml(activityLesson.description)}</p>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className='col-md-4'>
                                <div className='card rounded-0'>
                                    <div className='card-body'>
                                        <div className='h6'>
                                            <strong>{course.title}</strong>
                                        </div>
                                        <div className='py-2'>
                                            <ProgressBar now={progress} />
                                            <div className='pt-2'>
                                                {t('title.progress')} {progress}%
                                            </div>
                                        </div>
                                        <Accordion flush>
                                            {
                                                course.chapters && course.chapters.map(chapter => {
                                                    return (
                                                        <Accordion.Item eventKey={chapter.id} key={chapter.id}>
                                                            <Accordion.Header>{chapter.title}</Accordion.Header>

                                                            <Accordion.Body className='pt-2 pb-0 ps-0'>
                                                                <ul className='lessons mb-0'>
                                                                    {
                                                                        chapter.lessons && chapter.lessons.map(lesson => {
                                                                            return (
                                                                                <li key={lesson.id} className='pb-2'>
                                                                                    <Link
                                                                                        onClick={() => showLesson(lesson)}
                                                                                        className={`${completedLessons && completedLessons.includes(lesson.id) ? 'text-success' : ''}`}
                                                                                    >
                                                                                        <MdSlowMotionVideo size={20} />
                                                                                        {lesson.title}
                                                                                    </Link>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    )
                                                })
                                            }
                                        </Accordion>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </Layout>
    );
};

export default WatchCourse;