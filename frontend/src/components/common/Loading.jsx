import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
    const { t } = useTranslation();
    return (
        <div className='w-full d-flex justify-content-center'>
            <Button variant="primary" disabled>
                <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
                {t('button.loading')}
            </Button>
        </div>
    )
}

export default Loading