import React from 'react';
import { useTranslation } from 'react-i18next';


const ModalDelete = ({ show, onClose, onConfirm, isDeleting }) => {
    const { t } = useTranslation();
    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">{t('modal.title')}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <p>{t('modal.confirm')}</p>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            disabled={isDeleting}
                            onClick={onClose}
                        >
                            {t('button.cancel')}
                        </button>

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={onConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? t('button.loading') : t('button.delete')}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ModalDelete