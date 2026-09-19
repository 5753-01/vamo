import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TestingView } from './components/TestingView';
import { RandomSelectorView } from './components/RandomSelectorView';
import { DriversAndFleetView } from './components/DriversAndFleetView';
import { LaboratoryPortalView } from './components/LaboratoryPortalView';
import { IntegralServiceView } from './components/IntegralServiceView';
import { SpecificationsView } from './components/SpecificationsView';
import { ComplianceMatrixView } from './components/ComplianceMatrixView';
import { RiskManagementView } from './components/RiskManagementView';
import { AuditsAndCAPAView } from './components/AuditsAndCAPAView';
import { DocumentManagerView } from './components/DocumentManagerView';
import { EquipmentView } from './components/EquipmentView';
import { ExecutiveReportsView } from './components/ExecutiveReportsView';
import { AuditLogsView } from './components/AuditLogsView';
import { SusesoVerificationLog } from './components/SusesoVerificationLog';
import { SystemArchitectureView } from './components/SystemArchitectureView';
import { ImageStudioView } from './components/ImageStudioView';
import { MapsGroundingView } from './components/MapsGroundingView';
import { InstitutionalWebsiteView } from './components/institutional/InstitutionalWebsiteView';
import { NewTestModal } from './components/NewTestModal';
import { TestDetailModal } from './components/TestDetailModal';
import { SusesoManualModal } from './components/SusesoManualModal';
import { DriverQRScannerModal } from './components/DriverQRScannerModal';
import { DriverLicenseValidator } from './components/DriverLicenseValidator';
import { PreventionProtocolsManager } from './components/prevention/PreventionProtocolsManager';
import { ChecklistTemplatesView } from './components/checklists/ChecklistTemplatesView';
import { OfflineStatusBanner } from './components/OfflineStatusBanner';
import { SupervisorHeadsUpAlert } from './components/notifications/SupervisorHeadsUpAlert';
import { NavView, TestRecord } from './types';

const MainLayout: React.FC = () => {
  const {
    activeHeadsUpAlert,
    dismissHeadsUpAlert,
    acknowledgePushNotification,
    currentUser,
    currentCompany,
    vehicles,
    drivers
  } = useApp();
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);
  const [selectedTestForDetail, setSelectedTestForDetail] = useState<TestRecord | null>(null);
  const [isSusesoManualOpen, setIsSusesoManualOpen] = useState(false);
  const [isDriverQRScannerOpen, setIsDriverQRScannerOpen] = useState(false);
  const [initialDriverIdForNewTest, setInitialDriverIdForNewTest] = useState<string | undefined>(undefined);

  const handleOpenNewTestForDriver = (driverId: string) => {
    setInitialDriverIdForNewTest(driverId);
    setIsDriverQRScannerOpen(false);
    setIsNewTestModalOpen(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'institutional_web':
        return <InstitutionalWebsiteView onNavigate={(view) => setCurrentView(view as NavView)} />;
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={(view) => setCurrentView(view as NavView)}
            onOpenNewTest={() => {
              setInitialDriverIdForNewTest(undefined);
              setIsNewTestModalOpen(true);
            }}
          />
        );
      case 'integral_service':
        return <IntegralServiceView onNavigate={(view) => setCurrentView(view as NavView)} />;
      case 'image_studio':
        return <ImageStudioView />;
      case 'maps_locator':
        return <MapsGroundingView />;
      case 'specifications':
        return <SpecificationsView />;
      case 'driver_qr_scanner':
        return (
          <div className="p-4 sm:p-8 max-w-5xl mx-auto">
            <DriverQRScannerModal
              isOpen={true}
              onClose={() => setCurrentView('dashboard')}
              onOpenNewTestForDriver={handleOpenNewTestForDriver}
            />
          </div>
        );
      case 'tests':
        return (
          <TestingView
            onOpenNewTestModal={() => {
              setInitialDriverIdForNewTest(undefined);
              setIsNewTestModalOpen(true);
            }}
            onViewTestDetails={(test) => setSelectedTestForDetail(test)}
            onOpenQRScanner={() => setIsDriverQRScannerOpen(true)}
          />
        );
      case 'random_selection':
        return <RandomSelectorView />;
      case 'drivers_fleet':
        return <DriversAndFleetView />;
      case 'license_validator':
        return (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <DriverLicenseValidator />
          </div>
        );
      case 'checklists':
        return (
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <ChecklistTemplatesView
              company={currentCompany}
              vehicles={vehicles}
              drivers={drivers}
              currentUserName={currentUser.name}
            />
          </div>
        );
      case 'prevention_protocols':
        return (
          <PreventionProtocolsManager
            onNavigateToNotifications={() => setCurrentView('tests')}
            onNavigateToTests={() => setCurrentView('tests')}
          />
        );
      case 'lab_portal':
        return <LaboratoryPortalView />;
      case 'compliance_matrix':
        return <ComplianceMatrixView />;
      case 'risks':
        return <RiskManagementView />;
      case 'audits':
        return <AuditsAndCAPAView />;
      case 'documents':
        return <DocumentManagerView />;
      case 'equipment':
        return <EquipmentView />;
      case 'reports':
        return <ExecutiveReportsView />;
      case 'audit_logs':
        return <AuditLogsView />;
      case 'suseso_verification_log':
        return <SusesoVerificationLog />;
      case 'architecture':
      case 'api':
        return <SystemArchitectureView />;
      default:
        return (
          <DashboardView
            onNavigate={(view) => setCurrentView(view as NavView)}
            onOpenNewTest={() => setIsNewTestModalOpen(true)}
          />
        );
    }
  };

  if (currentView === 'institutional_web') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
        <InstitutionalWebsiteView onNavigate={(view) => setCurrentView(view as NavView)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <Navbar
        onNavigate={(view) => setCurrentView(view as NavView)}
        onOpenDriverQRScanner={() => setIsDriverQRScannerOpen(true)}
      />

      {/* Real-time Emergency Heads-Up Alert for Supervisors */}
      <SupervisorHeadsUpAlert
        notification={activeHeadsUpAlert}
        onDismiss={dismissHeadsUpAlert}
        onNavigate={(view) => setCurrentView(view)}
        onAcknowledge={(id) => acknowledgePushNotification(id, currentUser.name)}
      />

      {/* Field Connectivity and Offline Status Banner */}
      <OfflineStatusBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          onOpenSusesoManual={() => setIsSusesoManualOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-950 pb-16">
          {renderView()}
        </main>
      </div>

      {/* Global Modals */}
      <NewTestModal
        isOpen={isNewTestModalOpen}
        onClose={() => {
          setIsNewTestModalOpen(false);
          setInitialDriverIdForNewTest(undefined);
        }}
        initialDriverId={initialDriverIdForNewTest}
      />

      <TestDetailModal
        test={selectedTestForDetail}
        onClose={() => setSelectedTestForDetail(null)}
      />

      <SusesoManualModal
        isOpen={isSusesoManualOpen}
        onClose={() => setIsSusesoManualOpen(false)}
      />

      {/* Standalone Driver QR Scanner Modal */}
      {isDriverQRScannerOpen && (
        <DriverQRScannerModal
          isOpen={isDriverQRScannerOpen}
          onClose={() => setIsDriverQRScannerOpen(false)}
          onOpenNewTestForDriver={handleOpenNewTestForDriver}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
