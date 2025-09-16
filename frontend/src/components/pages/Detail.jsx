import Layout from '../common/Layout';
// import { Rating } from 'react-simple-star-rating';
import { useTranslation } from 'react-i18next';
import { Accordion, Badge, ListGroup, Card } from "react-bootstrap";
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiUrl, convertMinutesToHours } from '../common/Config';
import { toast } from 'react-toastify';
import { LuMonitorPlay } from "react-icons/lu";
import { NumericFormat } from 'react-number-format';
import Loading from '../common/Loading';

const Detail = () => {
    const { t, i18n } = useTranslation();
    // const [rating, setRating] = useState(4.0);
    const params = useParams();
    const [course, setCourse] = useState(null);

    const fetchCourse = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/fetch-course/${params.id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language
                }
            });
            const result = await response.json();

            if (response.ok && response.status === 200) {
                setCourse(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }, [i18n.language, params]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    return (
        <Layout>
            <div className='container pb-5 pt-3'>
                {!course ? (
                    <div className="text-center py-5">
                        <Loading />
                    </div>
                ) : (
                    <>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/">{t('courses.home')}</a></li>
                                <li className="breadcrumb-item"><a href="/courses">{t('courses.courses')}</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{course.title}</li>
                            </ol>
                        </nav>
                        <div className='row my-5'>
                            <div className='col-lg-8'>
                                <h2>{course?.title}</h2>
                                <div className='d-flex'>
                                    <div className='mt-1'>
                                        <span className="badge bg-green">{course.category.name}</span>
                                    </div>
                                    <div className='d-flex ps-3'>
                                        <div className="text pe-2 pt-1">5.0</div>
                                        {/* <Rating initialValue={rating} size={20} /> */}
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col">
                                        <span className="text-muted d-block">{t('courses.level')}</span>
                                        <span className="fw-bold">{course.level.name}</span>
                                    </div>
                                    <div className="col">
                                        <span className="text-muted d-block">{t('courses.students')}</span>
                                        <span className="fw-bold">0</span>
                                    </div>
                                    <div className="col">
                                        <span className="text-muted d-block">{t('courses.language')}</span>
                                        <span className="fw-bold">{course.language.name}</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12 mt-4'>
                                        <div className='border bg-white rounded-3 p-4'>
                                            <h3 className='mb-3  h4'>{t('courses.overview')}</h3>
                                            {course.description}
                                        </div>
                                    </div>
                                    <div className='col-md-12 mt-4'>
                                        <div className='border bg-white rounded-3 p-4'>
                                            <h3 className='mb-3 h4'>{t('courses.what_you_will_learn')}</h3>
                                            <ul className="list-unstyled mt-3">
                                                {
                                                    course.outcomes && course.outcomes.map(outcome => {
                                                        return (
                                                            <li className="d-flex align-items-center mb-2" key={outcome.id}>
                                                                <span className="text-success me-2">&#10003;</span>
                                                                <span>{outcome.outcome}</span>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    <div className='col-md-12 mt-4'>
                                        <div className='border bg-white rounded-3 p-4'>
                                            <h3 className='mb-3 h4'>{t('courses.requirements')}</h3>
                                            <ul className="list-unstyled mt-3">
                                                {
                                                    course.requirements && course.requirements.map(requirement => {
                                                        return (
                                                            <li className="d-flex align-items-center mb-2" key={requirement.id}>
                                                                <span className="text-success me-2">&#10003;</span>
                                                                <span>{requirement.requirement}</span>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    <div className='col-md-12 mt-4'>
                                        <div className='border bg-white rounded-3 p-4'>
                                            <h3 className="h4 mb-3">{t('courses.course_structure')}</h3>
                                            {
                                                course.chapters && course.chapters.map((chapter, index) => {
                                                    return (
                                                        <Accordion defaultActiveKey="0" id="courseAccordion" key={chapter.id}>
                                                            <Accordion.Item eventKey={index}>
                                                                <Accordion.Header>
                                                                    {chapter.title} <span className="ms-3 text-muted">{chapter.lessons_count} lectures - {convertMinutesToHours(chapter.lessons_sum_duration)}</span>
                                                                </Accordion.Header>
                                                                <Accordion.Body>
                                                                    <ListGroup>
                                                                        {
                                                                            chapter.lessons && chapter.lessons.map(lesson => {
                                                                                return (
                                                                                    <ListGroup.Item key={lesson.id}>
                                                                                        <div className="row">
                                                                                            <div className="col-md-9">
                                                                                                <LuMonitorPlay className='me-2' />
                                                                                                {lesson.title}
                                                                                            </div>

                                                                                            <div className="col-md-3">
                                                                                                <div className="d-flex justify-content-end">
                                                                                                    {
                                                                                                        lesson.is_free_preview === 'yes' &&
                                                                                                        <Badge bg="primary">
                                                                                                            <Link className="text-white text-decoration-none">{t('courses.preview')}</Link>
                                                                                                        </Badge>
                                                                                                    }
                                                                                                    <span className="text-muted ms-2">{convertMinutesToHours(lesson.duration)}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </ListGroup.Item>
                                                                                )
                                                                            })
                                                                        }
                                                                    </ListGroup>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                    <div className='col-md-12 mt-4'>
                                        <div className='border bg-white rounded-3 p-4'>
                                            <h3 className='mb-3 h4'>{t('courses.reviews')}</h3>
                                            <p>{t('courses.review_title')}</p>

                                            <div className='mt-4'>
                                                <div className="d-flex align-items-start mb-4 border-bottom pb-3">
                                                    <img src="https://placehold.co/50" alt="User" className="rounded-circle me-3" />
                                                    <div>
                                                        <h6 className="mb-0">Mohit Singh <span className="text-muted fs-6">Jan 2, 2025</span></h6>
                                                        <div className="text-warning mb-2">
                                                            {/* <Rating initialValue={rating} size={20} /> */}
                                                        </div>
                                                        <p className="mb-0">Quisque et quam lacus amet. Tincidunt auctor phasellus purus faucibus lectus mattis.</p>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-start mb-4  pb-3">
                                                    <img src="https://placehold.co/50" alt="User" className="rounded-circle me-3" />
                                                    <div>
                                                        <h6 className="mb-0">mark Doe <span className="text-muted fs-6">Jan 10, 2025</span></h6>
                                                        <div className="text-warning mb-2">
                                                            {/* <Rating initialValue={rating} size={20} /> */}
                                                        </div>
                                                        <p className="mb-0">Quisque et quam lacus amet. Tincidunt auctor phasellus purus faucibus lectus mattis.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className='border rounded-3 bg-white p-4 shadow-sm'>
                                    <Card.Img src={course.image_url} />
                                    <Card.Body className='mt-3'>
                                        <h3 className="fw-bold">
                                            <NumericFormat
                                                value={course.price}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                suffix=" ₫"
                                                displayType="text"
                                            />
                                        </h3>
                                        <div className="text-muted text-decoration-line-through">
                                            <NumericFormat
                                                value={course.cross_price}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                suffix=" ₫"
                                                displayType="text"
                                            />
                                        </div>
                                        {/* Buttons */}
                                        <div className="mt-4">
                                            <button className="btn btn-primary w-100">
                                                <i className="bi bi-ticket"></i> {t('courses.buy_now')}
                                            </button>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer className='mt-4'>
                                        <h6 className="fw-bold">This course includes</h6>
                                        <ListGroup variant="flush">

                                            <ListGroup.Item className='ps-0'>
                                                <i className="bi bi-infinity text-primary me-2"></i>
                                                Full lifetime access
                                            </ListGroup.Item>
                                            <ListGroup.Item className='ps-0'>
                                                <i className="bi bi-tv text-primary me-2"></i>
                                                Access on mobile and TV
                                            </ListGroup.Item>
                                            <ListGroup.Item className='ps-0'>
                                                <i className="bi bi-award-fill text-primary me-2"></i>
                                                Certificate of completion
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card.Footer>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    )
}

export default Detail