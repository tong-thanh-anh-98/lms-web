import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiUrl } from './Config';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const FeaturedCategories = () => {
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState([]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/fetch-categories`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                }
            });
            const result = await response.json();

            if (response.ok && response.status === 200) {
                setCategories(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <section className='section-2'>
            <div className="container">
                <div className='section-title py-3  mt-4'>
                    <h2 className='h3'>{t('home.explore_categories')}</h2>
                    <p>{t('home.context_categories')}</p>
                </div>
                <div className='row gy-3'>
                    {
                        categories && categories.map(category => {
                            return (
                                <div className='col-6 col-md-6 col-lg-3' key={`${category.id}`}>
                                    <div className='card shadow border-0'>
                                        <div className='card-body'>
                                            <Link>{category.name}</Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default FeaturedCategories