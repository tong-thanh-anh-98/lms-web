import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import Course from './components/pages/Course';
import Detail from './components/pages/Detail';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import MyCourses from './components/pages/account/MyCourses';
import WatchCourse from './components/pages/account/WatchCourse';
import CourseEnrolled from './components/pages/account/CourseEnrolled';
import ChangePassword from './components/pages/account/ChangePassword';

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/courses' element={<Course />}/>
                    <Route path='/detail' element={<Detail />}/>
					<Route path='/account/login' element={<Login />}/>
					<Route path='/account/register' element={<Register />}/>
					<Route path='/account/my-courses' element={<MyCourses />}/>
					<Route path='/account/watch-course' element={<WatchCourse />}/>
					<Route path='/account/enrolled-course' element={<CourseEnrolled />}/>
					<Route path='/account/change-password' element={<ChangePassword />}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
