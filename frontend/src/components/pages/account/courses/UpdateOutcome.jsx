import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { apiUrl, getToken } from '../../../common/Config';
import { toast } from 'react-toastify';

const UpdateOutcome = ({ outcomeData, showOutcome, handleClose, outcomes, setOutcomes }) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const formData = { ...data, course_id: outcomeData.course_id };
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/outcomes/${outcomeData.id}`, {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.status === 201) {
                const updatedOutcomes = outcomes.map(outcome => outcome.id === result.data.id
                    ? { ...outcome, outcome: result.data.outcome } : outcome);

                setOutcomes(updatedOutcomes);
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Create failed:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (outcomeData) {
            reset({
                outcome: outcomeData.outcome
            });
        }
    }, [outcomeData, reset]);

    return (
        <>
            <Modal size='lg' show={showOutcome} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('course.update_outcome')}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="mb-3">
                            <label htmlFor="outcome" className='form-label'>{t('label.outcome')}</label>
                            <input
                                {...register("outcome", { required: t('required.outcome') })}
                                type="text"
                                className={`form-control ${errors.outcome && 'is-invalid'}`}
                                placeholder={t('placeholder.outcome')}
                            />
                            {
                                errors.outcome && <p className='invalid-feedback'>{errors.outcome?.message}</p>
                            }
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <button disabled={loading} type="submit" className='btn btn-primary'>
                            {loading ? t('button.loading') : t('button.save')}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal >
        </>
    );
}

export default UpdateOutcome