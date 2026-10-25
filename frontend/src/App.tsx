import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { TabList, Tab } from '@fluentui/react-components';
import { TaskList } from './pages/TaskList';
import { FormSettings } from './pages/FormSettings';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "10px 20px", borderBottom: "1px solid #ddd" }}>
        <h2 style={{ margin: "0 0 10px 0" }}>TaskFlow</h2>
        <TabList 
          selectedValue={location.pathname}
          onTabSelect={(e, data) => navigate(data.value as string)}
        >
          <Tab value="/">Tasks</Tab>
          <Tab value="/settings">Form Settings</Tab>
        </TabList>
      </header>
      
      <main style={{ flex: 1, overflow: "auto" }}>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/settings" element={<FormSettings />} />
          </Routes>
        </ToastProvider>
      </main>
    </div>
  );
}

export default App;
