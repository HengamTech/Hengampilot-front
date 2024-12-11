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
/*
import HomeAndGardenPage from './components/Home/Home';
import AdminDashboard from './components/Dashboard/Dashboard_admin';
import UserManagement from './components/User Management/UserManagement';
import UserCommentsPage from './components/User Management/UserCommentsPage';
import EditUserForm from './components/EditUserForm/EditUserForm';
/*
import SettingsPage from './components/Settings/Settings';
import CompanyDetailPage from './components/CompaniesData/CompanyDetailPage';
import ReviewManagementPage from './components/Dashboard/managementreview';
import website_management from './components/Dashboard/WebsiteManagement/WebsiteManagement';
 */
import NotFoundPage from './components/404 page/404'

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
        {/*<Route*/}
        {/*  path="Home"*/}
        {/*  element={*/}
        {/*    <>*/}
        {/*    <HomeAndGardenPage/>*/}
        {/*    </>*/}
        {/*    }*/}
        {/*  />*/}
        <Route path='/Dashboard'
            element={
            <>
            <Navbar/>   
            <UserDashboard/>
            <Footer />
            </>
          }
          />
           {/*<Route path="/companies/:id" element={*/}
           {/*         <>*/}
           {/*         <CompanyDetailPage/>*/}
           {/*         </>*/}
           {/*         }*/}
           {/*  />*/}

          {/*<Route path='/AdminDashboard'*/}
          {/*element={*/}
          {/*  <>*/}
          {/*  <Navbar/>*/}
          {/*  <AdminDashboard/>*/}
          {/*  <Footer/>*/}
          {/*  </>*/}
          {/*}*/}
          {/*/>*/}
          <Route path="/submit/:id" element={
           <>
           <Navbar/>            
            <ReviewForm/>
            <Footer/>
            </>
            } />
                {/*<Route path="/edit-profile/:userId" element={<EditUserForm />} />*/}

          
        {/*<Route path="/UserManagement" element={*/}
        {/*  <>*/}
        {/*  <Navbar/>*/}
        {/*  <UserManagement/>*/}
        {/*  <Footer/>*/}
        {/*  </>*/}
        {/*}*/}
        {/*  />*/}
        {/*<Route path="/user-comments/:userId" element={*/}
        {/*  <>          <Navbar/>*/}
        {/*  <UserCommentsPage/>*/}
        {/*  <Footer/> */}
        {/*  </>*/}

        {/*  }/>*/}
        {/*<Route path="/edit-user/:userId"*/}
        {/*element={*/}
        {/*<>*/}
        {/*<Navbar/>*/}
        {/*<EditUserForm/>*/}
        {/*<Footer/>*/}
        {/*</>*/}
        {/*}*/}

        {/*/>*/}
        {/*<Route path='/ReviewManagement'*/}
        {/*element={*/}
        {/*  <>*/}
        {/*  <Navbar/>*/}
        {/*  <ReviewManagementPage/>*/}
        {/*  <Footer/>*/}
        {/*  </>*/}
        {/*}*/}
        {/*/>*/}
        {/*     <Route path='/Settings'*/}
        {/*     element={*/}
        {/*      <>*/}
        {/*      <Navbar/>*/}
        {/*      <SettingsPage/>*/}
        {/*      <Footer/>*/}

        {/*      </>*/}


        {/*     }*/}


        {/*     />*/}

       <Route path='WebsiteManagement'
        element={
          <>
          <website_management/>
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
