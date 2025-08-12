import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { apiUrl, token } from '../../../common/Config';
import ReactPlayer from 'react-player';

// Register FilePond plugins
registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
);

const LessonVideo = ({ lesson }) => {
    const { t, i18n } = useTranslation();
    const [files, setFiles] = useState([]);
    const [videoUrl, setVideoUrl] = useState();

    useEffect(() => {
        if (lesson) {
            setVideoUrl(lesson.video_url);
        }
    }, [lesson]);

    return (
        <>
            <div className="card shadow-lg border-0">
                <div className="card-body p-4">
                    <div className="d-flex">
                        <h4 className="h5 mb-3">{t('lesson.video')}</h4>
                    </div>

                    <FilePond
                        acceptedFileTypes={['video/mp4']}
                        credits={false}
                        files={files}
                        onupdatefiles={setFiles}
                        allowMultiple={false}
                        maxFiles={1}
                        server={{
                            process: {
                                url: `${apiUrl}/save-lesson-video/${lesson.id}`,
                                method: 'POST',
                                headers: {
                                    'Accept-Language': i18n.language,
                                    'Authorization': `Bearer ${token}`,
                                },
                                onload: (response) => {
                                    try {
                                        response = JSON.parse(response);
                                        toast.success(response.message);
                                        setVideoUrl(response.data.video_url);
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
                        name="video"
                        labelIdle={t('label.labelIdle')}
                    />

                    {videoUrl && (
                        <video
                            src={videoUrl}
                            width="100%"
                            height="100%"
                            controls
                            preload="metadata"
                            onLoadedMetadata={(e) => {
                                e.target.currentTime = 0;
                            }}
                        />
                    )}

                </div>
            </div>
        </>
    )
}

export default LessonVideo