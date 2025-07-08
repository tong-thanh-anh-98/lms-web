import HeaderImg from '../../assets/images/header-1.png';
import { useTranslation } from 'react-i18next';

const SectionHeader = () => {
    const { t } = useTranslation();

    return (
        <section className='section-1'>
            <div className='container'>
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h1 className="display-3 fw-bold">{t('section_header.title')}</h1>
                        <p className="lead">{t('section_header.description')}</p>
                        <a href="#courses" className="btn btn-white">{t('section_header.button')}</a>
                    </div>
                    <div className="col-md-6 text-center">
                        <img src={HeaderImg} alt={t('section_header.image_alt')} className="img-fluid" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SectionHeader