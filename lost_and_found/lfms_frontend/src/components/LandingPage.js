import React, { useState } from 'react';
import ReportLostItem from './sections/ReportLostItem';
import ReportFoundItem from './sections/ReportFoundItem';
import ViewLostItems from './sections/ViewLostItems';
import ViewFoundItems from './sections/ViewFoundItems';
import SearchBar from './sections/SearchBar';
import Profile from './sections/Profile';
import AllFoundItems from './sections/AllFoundItems';  
import './LandingPage.css';

const LandingPage = () => {
    const [activeSection, setActiveSection] = useState('');
    const userId = localStorage.getItem('userId');

    return (
        <div className="landing-page">
            
            <nav className="vertical-nav">
                <h1 className="nav-title">Dashboard</h1>
                <ul className="nav-list">
                    <li onClick={() => setActiveSection('report-lost')}>Report Lost Item</li>
                    <li onClick={() => setActiveSection('report-found')}>Report Found Item</li>
                    <li onClick={() => setActiveSection('view-lost')}>My lost items</li>
                    <li onClick={() => setActiveSection('view-found')}>Items found by you</li>
                    <li onClick={() => setActiveSection('search')}>Search Items</li>
                    <li onClick={() => setActiveSection('all-found')}>All Found Items</li> 
                    <li onClick={() => setActiveSection('profile')}>Profile</li>
                   
                   
                </ul>
            </nav>

            
            <main className="main-content">
                {activeSection === 'report-lost' && <ReportLostItem />}
                {activeSection === 'report-found' && <ReportFoundItem />}
                {activeSection === 'view-lost' && <ViewLostItems userId={userId} />}
                {activeSection === 'view-found' && <ViewFoundItems userId={userId} />}
                {activeSection === 'search' && <SearchBar />}
                {activeSection === 'all-found' && <AllFoundItems />} 
                {activeSection === 'profile' && <Profile userId={userId} />}
                
                {activeSection === '' && (
                    <div>
                        <h2>Welcome</h2>
                        <p>Select an option from the sidebar to get started.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default LandingPage;
