import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Accordion from 'react-bootstrap/Accordion';
import { apiUrl, token } from '../../../common/Config';
import UpdateChapter from './UpdateChapter';
import ModalDelete from '../../../common/ModalDelete';
import CreateLesson from './CreateLesson';
import {Link} from 'react-router-dom';
import { FaPlusCircle } from "react-icons/fa";

const ManageChapter = ({ course, params }) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // update chapter modal
    const [chapterData, setChapterData] = useState([]);
    const [showChapter, setShowChapter] = useState(false);
    const handleClose = () => setShowChapter(false);
    const handleShow = (chapter) => {
        setShowChapter(true);
        setChapterData(chapter);
    };

    // create lesson modal 
    const [showLesson, setShowLesson] = useState(false);
    const handleCloseLesson = () => setShowLesson(false);
    const handleShowLesson = () => {
        setShowLesson(true);
    };

    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [chapterId, setDeleteChapter] = useState(null);

    const chaptersReducer = (state, action) => {
        switch (action.type) {
            case "SET_CHAPTERS":
                return action.payload;
            case "ADD_CHAPTER":
                return [...state, action.payload];
            case "UPDATE_CHAPTER":
                return state.map(chapter => {
                    if (chapter.id === action.payload.id) {
                        return action.payload;
                    }
                    return chapter;
                });
            case "DELETE_CHAPTER":
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

            if (result.status === 200) {
                setChapters({ type: "DELETE_CHAPTER", payload: result.data });
                toast.success(result.message);
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
                            <Link onClick={() => handleShowLesson()}><FaPlusCircle size={12} /> <strong>{t('course.add_lesson')}</strong></Link>
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
                                    <Accordion.Item key={`chapter-${chapter.id}`} eventKey={index}>
                                        <Accordion.Header>{chapter.title}</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="d-flex">
                                                <button
                                                    type="button"
                                                    className='btn btn-danger btn-sm'
                                                    disabled={isDeleting}
                                                    onClick={() => {
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
                onConfirm={deleteChapter}
                isDeleting={isDeleting}
            />

            <CreateLesson
                showLesson={showLesson}
                handleCloseLesson={handleCloseLesson}
                course={course}
            />
        </>
    )
}

export default ManageChapter