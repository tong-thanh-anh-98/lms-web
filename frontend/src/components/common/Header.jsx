import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t, i18n } = useTranslation();

    return (
        <>
            <Navbar expand="md" className="bg-white shadow-lg header py-3">
                <Container >
                    <Navbar.Brand href="/"><strong>{t('header.brand')}</strong></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            navbarScroll
                        >
                            <Nav.Link href="/courses" className=''>{t('header.all_courses')}</Nav.Link>
                        </Nav>

                        <div className="d-flex align-items-center gap-2">
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" className="nav-link p-3">
                                    🌐 {t('header.language')}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => i18n.changeLanguage('vi')}>{t('header.vi')}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => i18n.changeLanguage('en')}>{t('header.en')}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            <a href='/account/dashboard' className="btn btn-primary">{t('header.my_account')}</a>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default Header