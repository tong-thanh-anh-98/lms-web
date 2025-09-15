import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { apiUrl, getToken } from '../../../common/Config';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import ModalDelete from '../../../common/ModalDelete';
import UpdateRequirement from './UpdateRequirement';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


const ManageRequirement = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [requirements, setRequirements] = useState([]);
    const [requirementData, setRequirementData] = useState([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const params = useParams();

    const [showRequirement, setShowRequirement] = useState(false);
    const handleClose = () => setShowRequirement(false);
    const handleShow = (requirement) => {
        setShowRequirement(true);
        setRequirementData(requirement);
    };
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [requirementId, setDeleteRequirement] = useState(null);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(requirements);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setRequirements(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updateRequirements) => {
        try {
            const response = await fetch(`${apiUrl}/sort-requirements`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ requirements: updateRequirements })
            });

            const result = await response.json();

            if (response.ok && result.status === 200) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Create failed:', error);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = { ...data, course_id: params.id };

        try {
            const response = await fetch(`${apiUrl}/requirements`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log(result.data);
            if (response.ok && result.status === 201) {
                const newRequirements = [...requirements, result.data];
                setRequirements(newRequirements);
                toast.success(result.message);
                reset();
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Create failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequirements = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/requirements?course_id=${params.id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            const result = await response.json();
            const data = result.data;
            setRequirements(data);

            if (response.ok && result.status === 200) {
                reset({
                    requirement: data.requirement
                });
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error(error);
        }
    }, [params.id, i18n.language, reset]);

    const deleteRequirement = async () => {
        setIsDeleting(true);

        try {
            const res = await fetch(`${apiUrl}/requirements/${requirementId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                }

            });
            const result = await res.json();

            if (result.status === 200) {
                toast.success(result.message);
                await fetchRequirements(); // call back API to update data on UI.
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
        fetchRequirements();
    }, [fetchRequirements]);

    return (
        <>
            <div className="card shadow-lg border-0 mt-4">
                <div className="card-body p-4">
                    <div className="d-flex">
                        <h4 className="h5 mb-3">{t('course.requirement')}</h4>
                    </div>
                    <form className='mb-4' onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
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

                        <div className="mb-3">
                            <button disabled={loading} type="submit" className='btn btn-primary'>
                                {loading ? t('button.loading') : t('button.save')}
                            </button>
                        </div>
                    </form>

                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        requirements.map((requirement, index) => (
                                            <Draggable key={requirement.id} draggableId={`${requirement.id}`} index={index}>

                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mt-2 border px-3 bg-white shadow-lg rounded"
                                                    >
                                                        <div className="card-body p-2 d-flex">
                                                            <div className="d-flex justify-content-between w-100">
                                                                <div><MdDragIndicator /></div>
                                                                <div className='ps-2'>
                                                                    {requirement.requirement}
                                                                </div>

                                                                <div className="d-flex">
                                                                    <Link to={`#`} onClick={() => handleShow(requirement)} className='text-primary me-1'>
                                                                        <BsPencilSquare />
                                                                    </Link>

                                                                    <Link
                                                                        type="button"
                                                                        className="text-danger"
                                                                        disabled={isDeleting}
                                                                        onClick={() => {
                                                                            setDeleteRequirement(requirement.id);
                                                                            setShowModal(true);
                                                                        }}
                                                                    >
                                                                        <FaTrashAlt />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    {/* {
                        requirements && requirements.map(requirement => {
                            return (
                                <div key={`requirement-${requirement.id}`} className="card shadow mb-2">
                                    <div className="card-body p-2 d-flex">
                                        <div className="d-flex justify-content-between w-100">
                                            <div><MdDragIndicator /></div>
                                            <div className='ps-2'>
                                                {requirement.requirement}
                                            </div>

                                            <div className="d-flex">
                                                <Link to={`#`} onClick={() => handleShow(requirement)} className='text-primary me-1'>
                                                    <BsPencilSquare />
                                                </Link>

                                                <Link
                                                    type="button"
                                                    className="text-danger"
                                                    disabled={isDeleting}
                                                    onClick={() => {
                                                        setDeleteRequirement(requirement.id);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <FaTrashAlt />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    } */}
                </div>
            </div>

            <UpdateRequirement
                requirementData={requirementData}
                showRequirement={showRequirement}
                handleClose={handleClose}
                requirements={requirements}
                setRequirements={setRequirements}
            />

            <ModalDelete
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={deleteRequirement}
                isDeleting={isDeleting}
            />
        </>
    )
}

export default ManageRequirement