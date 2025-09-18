import React from 'react';
import { useTranslation } from 'react-i18next';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import { BsBriefcase } from "react-icons/bs";
import { MdOutlinePeople } from "react-icons/md";
import { FaStar } from "react-icons/fa";

const Course = ({ course, customClasses }) => {
    const { t } = useTranslation();

    return (
        <div className={customClasses}>
            <div className='card border-0'>
                <div className='card-img-top'>
                    <img
                        src={course.image_url || `https://placehold.co/600x350?text=${course.title}`}
                        className="img-fluid"
                        alt={course.title}
                    />
                </div>
                <div className='card-body'>
                    <div className="card-title">
                        {course.title}
                    </div>
                    <div className="meta d-flex py-2">
                        <div className="level">
                            <div className="d-flex align-items-center">
                                <div className="icon">
                                    <BsBriefcase />
                                </div>
                                <div className="text ps-2">{course.level.name}</div>
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
                                <div className="text ps-2">0.0</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-white">
                    <div className="d-flex py-2 justify-content-between align-items-center">
                        {
                            course.price && <div className="price">
                                <NumericFormat
                                    value={course.price}
                                    displayType="text"
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    suffix=" ₫"
                                />
                            </div>
                        }

                        <div className="add-to-cart">
                            <Link to={`/detail/${course.id}`} className="btn btn-primary">{t('button.read_more')}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Course