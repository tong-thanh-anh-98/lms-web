import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { apiUrl, getToken } from '../../../common/Config';
import { toast } from 'react-toastify';

const SortChapters = ({ showChapterSortModal, handleCloseChapterSortModal, setChapters, chapters }) => {
    const { t, i18n } = useTranslation();
    const [chaptersData, setChaptersData] = useState([]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(chaptersData);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setChaptersData(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updateChapters) => {
        try {
            const response = await fetch(`${apiUrl}/sort-chapters`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-Type': 'application/json',
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ chapters: updateChapters })
            });

            const result = await response.json();

            if (response.ok && result.status === 200) {
                setChapters({ type: "SET_CHAPTERS", payload: result.chapters });
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Sort failed:', error);
        }
    };

    useEffect(() => {
        if (chapters) {
            setChaptersData(chapters);
        }
    }, [chapters]);
    return (
        <>
            <Modal size='lg' show={showChapterSortModal} onHide={handleCloseChapterSortModal}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('lesson.sort_chapter')}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <DragDropContext onDragEnd={handleDragEnd} >
                            <Droppable droppableId="list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {
                                            chaptersData.map((chapter, index) => (
                                                <Draggable key={chapter.id} draggableId={`${chapter.id}`} index={index}>

                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="mt-2 border px-3 py-2 bg-white shadow-lg rounded"
                                                        >

                                                            {chapter.title}
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

export default SortChapters