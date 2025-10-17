import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { apiUrl, getToken } from '../../common/Config';

// Register FilePond plugins
registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
);

const ProfileImage = ({user, setUser}) => {
    const { t, i18n } = useTranslation();
    const [files, setFiles] = useState([]);

    return (
        <>
            <div className="card p-3 shadow-lg border-0">
                <div className="card-body p-4">
                    <div className="d-flex">
                        <h4 className="h5 mb-3">{t('profile.title')}</h4>
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
                                url: `${apiUrl}/save-profile-image/${user.id}`,
                                method: 'POST',
                                headers: {
                                    'Accept-Language': i18n.language,
                                    'Authorization': `Bearer ${getToken()}`
                                },
                                onload: (response) => {
                                    try {
                                        response = JSON.parse(response);
                                        toast.success(response.message);

                                        // Update course data with new image URL
                                        const updateUserImage = { ...user, image_url: response.data.image_url };
                                        setUser(updateUserImage);

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
                        user.image_url && <img src={user.image_url} className='w-100 rounded' alt={user.name} />
                    }
                </div>
            </div>
        </>
    )
}

export default ProfileImage