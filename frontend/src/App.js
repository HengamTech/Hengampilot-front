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
import UserDashboard from './components/Dashboard/Dashboard';

import Companylistbycategory from './components/Companylistbycategory/CompanylistbyCategory1';
import CompanyDetailPage from './components/CompaniesData/CompanyDetailPage';

import AdminDashboard from './components/Dashboard/Dashboard-Admin';
import UserManagement from './components/UserManagement/UserManagement';
import UserCommentsPage from './components/UserManagement/UserCommnetPage';
import EditUserForm from './components/EditUserForm/EditUserForm';

import SettingsPage from './components/Settings/Settings';


import ReviewManagementPage from './components/Dashboard/ReviewManagementPage';
import website_management from './components/Dashboard/WebsiteManagement/BusinessManager';
 
import NotFoundPage from './components/404 page/404'
import ReviewSubmit1 from './components/reviewsubmit/reviewsubmit'
import BusinessManager from './components/Dashboard/WebsiteManagement/BusinessManager';
import AboutUs from './components/AboutUs/AboutUs';
import UserReviews from './components/Dashboard/UserReviews/UserReviews';
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
          path='/UserReview/:id'
          element={
            <>
            <Navbar/>
            <UserReviews/>
            <Footer/>
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
          <Route path='/AboutUs'
            element={
            <>
            <Navbar/>   
            <AboutUs/>
            <Footer />
            </>
          }
          />
          <Route path="/categories/:id"element={
            <>
            <Navbar/>
            <Companylistbycategory/>  
            <Footer/>
            </>
          }
          
          />
           <Route path="/companies/:id" element={
                    <>
                    <Navbar/>
                    <CompanyDetailPage/>
                    <Footer/>
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
          <Route path="/reviewsubmit/:id"
          element={
            <>
            <Navbar/>
            <ReviewSubmit1/>
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
               <Route path="/edit-profile/:userId" element={<EditUserForm />} />


<Route path="/user-comments/:userId" element={
  <>          <Navbar/>
  <UserCommentsPage/>
  <Footer/>
  </>
} />

<Route path="/edit-user/:userId" element={
  <>
  <Navbar/>
  <EditUserForm/>
  <Footer/>
  </>
} />



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
          <Route
              path="*"
              element={
                  <>
                      <Navbar />
                      <NotFoundPage />
                      <Footer />
                  </>
              }
          />

      </Routes>
    </Router>
  );
}

export default App;
