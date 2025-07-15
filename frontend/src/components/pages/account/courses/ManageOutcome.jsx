import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { apiUrl, token } from '../../../common/Config';
import { Link, useParams } from 'react-router-dom';
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import UpdateOutcome from './UpdateOutcome';
import ModalDelete from '../../../common/ModalDelete';

const ManageOutcome = () => {
    const { t, i18n } = useTranslation();
    const [disable, setDisable] = useState(false);
    const params = useParams();
    const [outcomes, setOutcomes] = useState([]);
    const [outcomeData, setOutcomeData] = useState([]);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const [showOutcome, setShowOutcome] = useState(false);
    const handleClose = () => setShowOutcome(false);
    const handleShow = (outcome) => {
        setShowOutcome(true);
        setOutcomeData(outcome);
    };

    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [outcomeId, setDeleteOutcome] = useState(null);

    const fetchOutcomes = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/outcomes?course_id=${params.id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'accept-language': i18n.language,
                    'authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            const data = result.data;
            setOutcomes(data);

            if (response.ok && result.status === 200) {
                reset({
                    outcome: data.outcome
                });
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error(error);
        }
    }, [params.id, i18n.language, reset]);

    const onSubmit = async (data) => {
        setDisable(true);
        const formData = { ...data, course_id: params.id };

        try {
            const response = await fetch(`${apiUrl}/outcomes`, {
                method: 'POST',
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
                const newOutcomes = [...outcomes, result.data];
                setOutcomes(newOutcomes);
                toast.success(result.message);
                reset();
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Create failed:', error);
        } finally {
            setDisable(false);
        }
    }

    const deleteOutcome = async () => {
        setIsDeleting(true);

        try {
            const res = await fetch(`${apiUrl}/outcomes/${outcomeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${token}`
                }

            });
            const result = await res.json();

            if (result.status === 200) {
                toast.success(result.message);
                await fetchOutcomes(); // gọi lại API để cập nhật data trên UI.
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setShowModal(false);
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchOutcomes();
    }, [fetchOutcomes]);

    return (
        <>
            <div className="card shadow-lg border-0">
                <div className="card-body p-4">
                    <div className="d-flex">
                        <h4 className="h5 mb-3">{t('course.outcome')}</h4>
                    </div>
                    <form className='mb-4' onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <input
                                {...register("outcome", { required: t('required.outcome') })}
                                type="text"
                                className={`form-control ${errors.text && 'is-invalid'}`}
                                placeholder={t('placeholder.outcome')}
                            />
                            {
                                errors.outcome && <p className='invalid-feedback'>{errors.outcome?.message}</p>
                            }
                        </div>

                        <div className="mb-3">
                            <button disabled={disable} type="submit" className='btn btn-primary'>
                                {disable ? t('button.loading') : t('button.save')}
                            </button>
                        </div>
                    </form>

                    {
                        outcomes && outcomes.map(outcome => {
                            return (
                                <div key={`outcome-${outcome.id}`} className="card shadow mb-2">
                                    <div className="card-body p-2 d-flex">
                                        <div className="d-flex justify-content-between w-100">
                                            <div><MdDragIndicator /></div>
                                            <div className='ps-2'>
                                                {outcome.outcome}
                                            </div>

                                            <div className="d-flex">
                                                <Link to={`#`} onClick={() => handleShow(outcome)} className='text-primary me-1'>
                                                    <BsPencilSquare />
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="text-danger"
                                                    disabled={isDeleting}
                                                    onClick={() => {
                                                        setDeleteOutcome(outcome.id);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <UpdateOutcome
                outcomeData={outcomeData}
                showOutcome={showOutcome}
                handleClose={handleClose}
                outcomes={outcomes}
                setOutcomes={setOutcomes}
            />

            <ModalDelete
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={deleteOutcome}
                isDeleting={isDeleting}
            />
        </>
    )
}

export default ManageOutcome