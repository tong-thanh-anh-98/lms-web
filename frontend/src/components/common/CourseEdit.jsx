import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { apiUrl, getToken } from './Config';
import { toast } from 'react-toastify';
import ModalDelete from './ModalDelete';
import { BsBriefcase } from "react-icons/bs";
import { MdOutlinePeople } from "react-icons/md";
import { FaStar } from "react-icons/fa";

const CourseEdit = ({ course, onDeleteSuccess }) => {
    const { t, i18n } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [courseId, setDeleteCourse] = useState(null);

    const deleteCourse = async () => {
        setIsDeleting(true);

        try {
            const res = await fetch(`${apiUrl}/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                }

            });
            const result = await res.json();

            if (result.status === 200) {
                toast.success(result.message);

                if (onDeleteSuccess) {
                    onDeleteSuccess(); // gọi hàm cha để refresh
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
    };

    return (
        <>
            <div className="col-md-4">
                <div className='card border-0'>
                    <div className="card-img-top">
                        <span className={`fw-bold badge position-absolute top-0 end-0 m-2 ${course.status === 1 ? 'bg-success text-white' : 'bg-light text-muted'}`}>
                            {course.status === 1 ? 'Published' : 'Draft'}
                        </span>

                        <img
                            src={course.image_url || `https://placehold.co/600x350?text=${course.title}`}
                            className="img-fluid"
                            alt={course.title}
                        />
                    </div>

                    <div className='card-body'>
                        <div className="card-title ">
                            {course.title}
                        </div>

                        <div className="meta d-flex py-2">
                            {
                                course.level &&
                                <div className="level">
                                    <div className="d-flex align-items-center">
                                        <div className="icon">
                                            <BsBriefcase />
                                        </div>
                                        <div className="text ps-2">{course.level.name}</div>
                                    </div>
                                </div>
                            }

                            <div className="student ps-4">
                                <div className="d-flex align-items-center">
                                    <div className="icon">
                                        <MdOutlinePeople />
                                    </div>
                                    <div className="text ps-2">0</div>
                                </div>
                            </div>

                            <div className="rating ps-4">
                                <div className="d-flex align-items-center">
                                    <div className="icon">
                                        <FaStar />
                                    </div>
                                    <div className="text ps-2">0.0</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer bg-white">
                        <div className="d-flex py-2 justify-content-between align-items-center">
                            <div className="add-to-cart">
                                <Link to={`/account/courses/edit/${course.id}`} className="btn btn-primary">{t('button.edit')}</Link>

                                <Link
                                    className="btn btn-danger ms-2"
                                    disabled={isDeleting}
                                    onClick={() => {
                                        setDeleteCourse(course.id);
                                        setShowModal(true);
                                    }}
                                >
                                    {t('button.delete')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalDelete
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={deleteCourse}
                isDeleting={isDeleting}
            />
        </>
    )
}

export default CourseEdit