import React from 'react';
import { useTranslation } from 'react-i18next';
import { BsBriefcase } from "react-icons/bs";
import { MdOutlinePeople } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';

const CourseEnrolled = ({ enrollment }) => {
    const { t } = useTranslation();
    if (!enrollment) return null;

    return (
        <div className="col-md-4 mt-2">
            <div className='card border-0'>
                <div className='card-img-top'>
                    <img
                        src={enrollment.course.image_url || `https://placehold.co/600x350?text=${enrollment.course.title}`}
                        className="img-fluid"
                        alt={enrollment.course.title}
                    />
                </div>
                <div className='card-body'>
                    <div className="card-title">
                        {enrollment.course.title}
                    </div>
                    <div className="meta d-flex py-2">
                        <div className="level">
                            <div className="d-flex align-items-center">
                                <div className="icon">
                                    <BsBriefcase />
                                </div>
                                <div className="text ps-2">{enrollment.course.level.name}</div>
                            </div>
                        </div>
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
                                <div className="text ps-2">5.0</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-white">
                    <div className="d-flex py-2 justify-content-between align-items-center">
                        <div className="add-to-cart">
                            <Link to={`/account/watch-course/${enrollment.course.id}`} className="btn btn-primary" >{t('button.watch_now')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseEnrolled