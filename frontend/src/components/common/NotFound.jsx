import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
   const { t } = useTranslation();

    return (
        <div className="col-12">
            <div className="card shadow border-0 py-2 text-center">
                <h4 className="mb-0">{t('courses.no_results')}</h4>
            </div>
        </div>
    )
}

export default NotFound