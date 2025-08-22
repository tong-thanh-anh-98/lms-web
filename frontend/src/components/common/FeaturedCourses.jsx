import { useCallback, useEffect, useState } from "react";
import Course from "./Course";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { apiUrl } from "./Config";

const FeaturedCourses = () => {
    const { t, i18n } = useTranslation();
    const [courses, setCourses] = useState([]);

    const fetchFeatureCourses = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/fetch-feature-courses`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                }
            });
            const result = await response.json();

            if (response.ok && response.status === 200) {
                console.log(result.data);
                setCourses(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchFeatureCourses();
    }, [fetchFeatureCourses]);

    return (
        <section className='section-3 my-5'>
            <div className="container">
                <div className='section-title py-3  mt-4'>
                    <h2 className='h3'>{t('home.featured_courses')}</h2>
                    <p>{t('home.context_courses')}</p>
                </div>
                <div className="row gy-4">
                    {
                        courses && courses.map(course => {
                            return (
                                <Course
                                    key={`${course.id}`}
                                    customClasses="col-lg-3 col-md-6"
                                    course={course}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default FeaturedCourses