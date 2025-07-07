import FeaturedCategories from '../common/FeaturedCategories';
import FeaturedCourses from '../common/FeaturedCourses';
import Layout from '../common/Layout';
import SectionHeader from '../common/SectionHeader';

const Home = () => {
    return (
        <Layout>
            <SectionHeader />
            <FeaturedCategories />
            <FeaturedCourses />
        </Layout>
    )
}

export default Home