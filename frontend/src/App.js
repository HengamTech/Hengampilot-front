import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';
import LoginPage from './components/Login/loginForm';
import SignUpPage from './components/Signup/SignUpForm';
import ReviewSection from './components/Latest reviews/ReviewSection/ReviewSection';
import AllReviewsPage from './components/Latest reviews/AllReviewsPage/AllReviewsPage';
import ReviewDetailPage from './components/Latest reviews/ReviewDetailPage/ReviewDetailPage';
import PilotHeader from './components/hero/hero';
import Categories from './components/category/category';
import ReviewForm from './components/ReviewForm/ReviewForm';
import UserDashboard from './components/Dashboard/Dashboard'
import HomeAndGardenPage from './HomeCategory';
import AdminDashboard from "./components/Dashboard/Dashboard-Admin";
import UserManagement from "./components/UserManagement/UserManagement";
import UserCommentsPage from "./components/UserManagement/UserCommnetPage";
import EditUserForm from './components/EditUserForm/EditUserForm';
function App() {
  return (
    <Router>
      <Routes>
        {/* صفحه اصلی شامل نوبار، هیروسکشن، کتگوری و فوتر */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <PilotHeader/>
                    <Categories/>
              <ReviewSection/>
              <Footer />
            </>
          }
        />
        <Route
          path="Home"
          element={
            <>
            <HomeAndGardenPage/>
            </>
            }
          />
        <Route path='/Dashboard'
            element={
            <>
            <Navbar/>
            <UserDashboard/>
            <Footer />
            </>
          }
          />
          <Route path='/AdminDashboard'
          element={
            <>
            <Navbar/>
            <AdminDashboard/>
            <Footer/>
            </>
          }
          />
          <Route path="/submit/:id" element={
           <>
           <Navbar/>
            <ReviewForm/>
            <Footer/>
            </>
            } />


        <Route path="/UserManagement" element={
          <>
          <Navbar/>
          <UserManagement/>
          <Footer/>
          </>
        }
          />
        <Route path="/user-comments/:userId" element={
          <>          <Navbar/>
          <UserCommentsPage/>
          <Footer/>
          </>

          }/>
        <Route path="/edit-user/:userId"
        element={
        <>
        <Navbar/>
        <EditUserForm/>
        <Footer/>
        </>
        }

        />





        {/* سایر صفحات شامل نوبار و فوتر به همراه محتوای مخصوص همان صفحه */}
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <LoginPage />
              <Footer />
            </>
          }
        />
        
        <Route
          path="/signup"
          element={
            <>
              <Navbar />
              <SignUpPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/all-reviews"
          element={
            <>
              <Navbar />
              <AllReviewsPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/review/:id"
          element={
            <>
              <Navbar />
              <ReviewDetailPage />
              <Footer />
            </>
          }
        />

          <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <UserDashboard />
              <Footer />
            </>
          }
        />

        {/* سایر مسیرها */}
      </Routes>
    </Router>
  );
}

export default App;
