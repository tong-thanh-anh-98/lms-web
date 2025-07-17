import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { apiUrl, token } from '../../../common/Config';

// Register FilePond plugins
registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
);

const EditCover = ({ course, setCourse }) => {
    const { t, i18n } = useTranslation();
    const [files, setFiles] = useState([]);

    return (
        <>
            <div className="card shadow-lg border-0 mt-4">
                <div className="card-body p-4">
                    <div className="d-flex">
                        <h4 className="h5 mb-3">{t('course.editCover')}</h4>
                    </div>

                    <FilePond
                        acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png']}
                        credits={false}
                        files={files}
                        onupdatefiles={setFiles}
                        allowMultiple={false}
                        maxFiles={1}
                        server={{
                            process: {
                                url: `${apiUrl}/save-course-image/${course.id}`,
                                method: 'POST',
                                headers: {
                                    'Accept-Language': i18n.language,
                                    'Authorization': `Bearer ${token}`,
                                },
                                onload: (response) => {
                                    try {
                                        response = JSON.parse(response);
                                        toast.success(response.message);

                                        // Update course data with new image URL
                                        const updateCourseData = { ...course, image_url: response.data.image_url };
                                        setCourse(updateCourseData);

                                        // Clear the files
                                        setFiles([]);
                                    } catch (error) {
                                        console.error(error);
                                    }
                                },
                                onerror: (error) => {
                                    console.log(error);
                                },
                            },
                        }}
                        name="image"
                        labelIdle={t('label.labelIdle')}
                    />
                    {
                        course.image_url && <img src={course.image_url} className='w-100 rounded' alt={course.title} />
                    }
                </div>
            </div>
        </>
    );
};

export default EditCover;
