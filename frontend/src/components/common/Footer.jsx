import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { apiUrl } from './Config';
import { toast } from 'react-toastify';

const Footer = () => {
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState([]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/fetch-categories`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language
                }
            });

            const result = await response.json();

            if (response.status === 200) {
                setCategories(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories])

    return (
        <footer >
            <div className='pt-5 container mt-5'>
                <div className='row pb-3 gy-4 justify-content-center'>

                    <div className='col-lg-3 col-12'>
                        <div className='col-lg-12 col-md-6 col-12 pe-lg-5'>
                            <h2>{t('footer.content')}</h2>
                            <p>{t('footer.description')}</p>
                        </div>
                    </div>

                    <div className='col-lg-3 col-md-6 col-12'>
                        <h2>{t('footer.categories')}</h2>
                        <ul>
                            {
                                categories && categories.map(category => {
                                    return (
                                        <li key={category.id}><Link to={`#`}>{category.name}</Link></li>
                                    )
                                })
                            }
                        </ul>
                    </div>

                    <div className='col-lg-3 col-md-6 col-12'>
                        <h2>{t('footer.links')}</h2>
                        <ul>
                            <li><Link to={`/account/login`}>{t('footer.login')}</Link></li>
                            <li><Link to={`/account/register`}>{t('footer.register')}</Link></li>
                        </ul>
                    </div>

                </div>
                <div className='row copyright'>
                    <div className='col-md-12 text-center py-4'>
                        &copy; 2025 {t('footer.copyright')}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer