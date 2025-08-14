import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { apiUrl, token } from '../../../common/Config';
import { toast } from 'react-toastify';

const LessonSort = ({ showLessonSortModal, handleCloseLessonSortModal, lessonsData, setChapters }) => {
    const { t, i18n } = useTranslation();
    const [lessons, setLessons] = useState([]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(lessons);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setLessons(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updateLessons) => {
        try {
            const response = await fetch(`${apiUrl}/sort-lessons`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ lessons: updateLessons })
            });

            const result = await response.json();

            if (response.ok && result.status === 200) {
                setChapters({ type: "UPDATE_CHAPTER", payload: result.chapter });
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Sort failed:', error);
        }
    };

    useEffect(() => {
        if (lessonsData) {
            setLessons(lessonsData);
        }
    }, [lessonsData]);

    return (
        <>
            <Modal size='lg' show={showLessonSortModal} onHide={handleCloseLessonSortModal}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('lesson.sort')}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <DragDropContext onDragEnd={handleDragEnd} >
                            <Droppable droppableId="list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {
                                            lessons.map((lesson, index) => (
                                                <Draggable key={lesson.id} draggableId={`${lesson.id}`} index={index}>

                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="mt-2 border px-3 py-2 bg-white shadow-lg rounded"
                                                        >

                                                            {lesson.title}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>
                </form>
            </Modal >
        </>
    )
}

export default LessonSort