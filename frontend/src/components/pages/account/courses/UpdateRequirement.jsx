import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { apiUrl, token } from '../../../common/Config';
import { toast } from 'react-toastify';

const UpdateRequirement = ({ requirementData, showRequirement, handleClose, requirements, setRequirements }) => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        const formData = { ...data, course_id: requirementData.course_id };
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/requirements/${requirementData.id}`, {
                method: 'PUT',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.status === 201) {
                const updatedRequirements = requirements.map(requirement => requirement.id === result.data.id
                    ? { ...requirement, requirement: result.data.requirement } : requirement);

                setRequirements(updatedRequirements);
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
        if (requirementData) {
            reset({
                requirement: requirementData.requirement
            });
        }
    }, [requirementData, reset]);

    return (
        <>
            <Modal size='lg' show={showRequirement} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('course.update_requirement')}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="mb-3">
                            <label htmlFor="requirement" className='form-label'>{t('label.requirement')}</label>
                            <input
                                {...register("requirement", { required: t('required.requirement') })}
                                type="text"
                                className={`form-control ${errors.requirement && 'is-invalid'}`}
                                placeholder={t('placeholder.requirement')}
                            />
                            {
                                errors.requirement && <p className='invalid-feedback'>{errors.requirement?.message}</p>
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
    )
}

export default UpdateRequirement