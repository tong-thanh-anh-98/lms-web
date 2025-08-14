import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Accordion from 'react-bootstrap/Accordion';
import { apiUrl, token } from '../../../common/Config';
import UpdateChapter from './UpdateChapter';
import ModalDelete from '../../../common/ModalDelete';
import CreateLesson from './CreateLesson';
import { Link } from 'react-router-dom';
import { FaPlusCircle } from "react-icons/fa";
import { HiPencilSquare } from "react-icons/hi2";
import { FaTrash } from "react-icons/fa";
import LessonSort from './LessonSort';
import SortChapters from './SortChapters';
import { AiOutlineDrag } from "react-icons/ai";

const ManageChapter = ({ course, params, refreshCourse }) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // update chapter modal
    const [chapterData, setChapterData] = useState([]);
    const [showChapter, setShowChapter] = useState(false);
    const [lessonsData, setLessonsData] = useState([]);
    const handleClose = () => setShowChapter(false);
    const handleShow = (chapter) => {
        setShowChapter(true);
        setChapterData(chapter);
    };

    // create lesson modal 
    const [showLesson, setShowLesson] = useState(false);
    const handleCloseLesson = () => setShowLesson(false);
    const handleShowLesson = () => { setShowLesson(true); };

    // sort lesson modal 
    const [showLessonSortModal, setShowLessonSortModal] = useState(false);
    const handleCloseLessonSortModal = () => setShowLessonSortModal(false);
    const handleShowLessonSortModal = (lessons) => {
        setLessonsData(lessons);
        setShowLessonSortModal(true);
    };

    // sort chapter modal 
    const [showChapterSortModal, setShowChapterSortModal] = useState(false);
    const handleCloseChapterSortModal = () => setShowChapterSortModal(false);
    const handleShowChapterSortModal = () => {
        setShowChapterSortModal(true);
    };

    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [chapterId, setDeleteChapter] = useState(null);
    const [lessonId, setDeleteLesson] = useState(null);
    const [deleteType, setDeleteType] = useState(null); // 'chapter' | 'lesson' | null

    const chaptersReducer = (state, action) => {
        switch (action.type) {
            case "SET_CHAPTERS":
                return action.payload;

            case "ADD_CHAPTER":
                return [...state, action.payload];

            // case "UPDATE_CHAPTER":
            //     return state.map(chapter => {
            //         if (chapter.id === action.payload.id) {
            //             return action.payload;
            //         }
            //         return chapter;
            //     });

            // case "DELETE_CHAPTER":
            //     return state.filter(chapter => chapter.id !== action.payload.id);

            case "UPDATE_CHAPTER":
                if (!action.payload || !action.payload.id) return state;
                return state.map(chapter =>
                    chapter.id === action.payload.id ? action.payload : chapter
                );

            case "DELETE_CHAPTER":
                if (!action.payload || !action.payload.id) return state;
                return state.filter(chapter => chapter.id !== action.payload.id);

            default:
                return state;
        }
    };

    const [chapters, setChapters] = useReducer(chaptersReducer, []);

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = { ...data, course_id: params.id };

        try {
            const response = await fetch(`${apiUrl}/chapters`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.status === 201) {
                setChapters({ type: "ADD_CHAPTER", payload: result.data });
                toast.success(result.message);
                reset();
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Create failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteChapter = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${apiUrl}/chapters/${chapterId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${token}`
                }

            });
            const result = await res.json();

            // if (result.status === 200) {
            //     setChapters({ type: "DELETE_CHAPTER", payload: result.data });
            //     toast.success(result.message);
            // } 
            if (result.status === 200) {
                setChapters({ type: "DELETE_CHAPTER", payload: { id: chapterId } });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setShowModal(false);
            setIsDeleting(false);
        }

    };

    const deleteLesson = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${apiUrl}/lessons/${lessonId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${token}`
                }

            });
            const result = await res.json();

            // if (result.status === 200) {
            //     setChapters({ type: "UPDATE_CHAPTER", payload: result.chapter });
            //     toast.success(result.message);
            // }
            if (result.status === 200) {
                if (result.chapter && result.chapter.id) {
                    setChapters({ type: "UPDATE_CHAPTER", payload: result.chapter });
                }
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setShowModal(false);
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        if (course.chapters) {
            setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
        }
    }, [course]);

    return (
        <>
            <div className="card shadow-lg border-0 mt-4">
                <div className="card-body p-4">
                    <div className="d-flex">
                        <div className="d-flex justify-content-between w-100">
                            <h4 className="h5 mb-3">{t('course.chapter')}</h4>
                            <div>
                                <Link onClick={() => handleShowLesson()}><FaPlusCircle size={12} /> <strong>{t('course.add_lesson')}</strong></Link>
                                <Link className='ms-2' onClick={() => handleShowChapterSortModal()}><AiOutlineDrag size={12} /> <strong>{t('course.reorder_chapter')}</strong></Link>
                            </div>
                        </div>
                    </div>
                    <form className='mb-4' onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
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
                            <button disabled={loading} type="submit" className='btn btn-primary'>
                                {loading ? t('button.loading') : t('button.save')}
                            </button>
                        </div>
                    </form>

                    <Accordion>
                        {
                            chapters.map((chapter, index) => {
                                return (
                                    <Accordion.Item key={chapter.id} eventKey={index}>
                                        <Accordion.Header>{chapter.title}</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="d-flex justify-content-between mb-2 mt-4">
                                                        <h4 className="h5">{t("lesson.lesson")}</h4>

                                                        <Link onClick={() => handleShowLessonSortModal(chapter.lessons)} href="#" className='h6' data-discover='true'>
                                                            <strong>{t('lesson.reorder')}</strong>
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    {
                                                        chapter.lessons && chapter.lessons.map(lesson => {
                                                            return (
                                                                <div key={lesson.id} className='card shadow px-3 py-2 mb-2'>
                                                                    <div className="row">
                                                                        <div className="col-md-7">
                                                                            {lesson.title}
                                                                        </div>

                                                                        <div className="col-md-5 text-end">
                                                                            {
                                                                                lesson.duration > 0 && <small className='fw-bold text-muted me-2'>{lesson.duration} Mins</small>
                                                                            }

                                                                            {
                                                                                lesson.is_free_preview === "yes" && <span className='badge bg-success'>Preview</span>
                                                                            }

                                                                            <Link to={`/account/courses/edit-lesson/${lesson.id}/${course.id}`} className='ms-2'>
                                                                                <HiPencilSquare />
                                                                            </Link>

                                                                            <Link
                                                                                className='ms-2 text-danger'
                                                                                disabled={isDeleting}
                                                                                onClick={() => {
                                                                                    setDeleteType('lesson');
                                                                                    setDeleteLesson(lesson.id);
                                                                                    setShowModal(true);
                                                                                }}
                                                                            >
                                                                                <FaTrash />
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="d-flex">
                                                        <button
                                                            type="button"
                                                            className='btn btn-danger btn-sm'
                                                            disabled={isDeleting}
                                                            onClick={() => {
                                                                setDeleteType('chapter');
                                                                setDeleteChapter(chapter.id);
                                                                setShowModal(true);
                                                            }}
                                                        >
                                                            {t('course.delete_chapter')}
                                                        </button>

                                                        <button
                                                            className='btn btn-primary btn-sm ms-2'
                                                            onClick={() => handleShow(chapter)}
                                                        >
                                                            {t('course.update_chapter')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })
                        }
                    </Accordion>
                </div>
            </div>

            <UpdateChapter
                chapterData={chapterData}
                showChapter={showChapter}
                handleClose={handleClose}
                setChapters={setChapters}
            />

            <ModalDelete
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={deleteType === 'chapter' ? deleteChapter : deleteLesson}
                isDeleting={isDeleting}
            />

            <CreateLesson
                showLesson={showLesson}
                handleCloseLesson={handleCloseLesson}
                course={course}
                refreshCourse={refreshCourse}
            />

            <LessonSort
                showLessonSortModal={showLessonSortModal}
                handleCloseLessonSortModal={handleCloseLessonSortModal}
                lessonsData={lessonsData}
                setChapters={setChapters}
            />

            <SortChapters
                showChapterSortModal={showChapterSortModal}
                handleCloseChapterSortModal={handleCloseChapterSortModal}
                course={course}
                setChapters={setChapters}
            />
        </>
    )
}

export default ManageChapter