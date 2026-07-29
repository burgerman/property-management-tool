import React, { useState, useMemo } from 'react';
import { ActiveTab, ExcelParseResult, Room, Suite, TenantRecord } from './types';
import { generateSampleTenants } from './services/sampleData';
import { buildBuildingState } from './utils/buildingLayout';
import { exportSampleExcel } from './services/excelParser';
import { Header } from './components/Header';
import { BuildingStatsBanner } from './components/BuildingStatsBanner';
import { BuildingView } from './components/BuildingView';
import { FloorNavigation } from './components/FloorNavigation';
import { StatisticsView } from './components/StatisticsView';
import { ExcelDataSourceView } from './components/ExcelDataSourceView';
import { SuiteDetailModal } from './components/SuiteDetailModal';
import { TenantDetailModal } from './components/TenantDetailModal';
import { ExcelUploadModal } from './components/ExcelUploadModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('layout');
  const [tenants, setTenants] = useState<TenantRecord[]>(() => generateSampleTenants());
  const [isCustomData, setIsCustomData] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal States
  const [selectedSuite, setSelectedSuite] = useState<Suite | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<TenantRecord | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Compute building floors and statistics
  const { floors, stats } = useMemo(() => {
    return buildBuildingState(tenants);
  }, [tenants]);

  // Refresh handler
  const handleRefresh = () => {
    setLastRefreshed(new Date());
  };

  // Excel Uploaded Handler
  const handleDataLoaded = (result: ExcelParseResult, uploadedFileName: string) => {
    setTenants(result.tenants);
    setIsCustomData(true);
    setFileName(uploadedFileName);
    setLastRefreshed(new Date());
  };

  // Export Sample Handler
  const handleDownloadSample = () => {
    exportSampleExcel(tenants);
  };

  // Open Suite details modal
  const handleSuiteClick = (suite: Suite) => {
    setSelectedSuite(suite);
  };

  // Open direct Room / Tenant modal
  const handleRoomClick = (suite: Suite, roomId: string) => {
    const room = suite.rooms.find((r) => r.roomId === roomId);
    if (room && room.tenant) {
      setSelectedTenant(room.tenant);
      setSelectedRoom(room);
    } else {
      setSelectedSuite(suite);
    }
  };

  const handleSelectTenantFromSuite = (tenant: TenantRecord, room: Room) => {
    setSelectedTenant(tenant);
    setSelectedRoom(room);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Bar with Single Responsibility Navigation Tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={handleRefresh}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onDownloadSample={handleDownloadSample}
        isCustomData={isCustomData}
        fileName={fileName}
        lastRefreshed={lastRefreshed}
      />

      {/* Metric summary banner shown across app views */}
      <BuildingStatsBanner stats={stats} />

      {/* Main Tab Content Views */}
      <main className="flex-1 pb-16">
        {activeTab === 'layout' && (
          <>
            <BuildingView
              floors={floors}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onSuiteClick={handleSuiteClick}
              onRoomClick={handleRoomClick}
            />
            <FloorNavigation floors={floors} />
          </>
        )}

        {activeTab === 'statistics' && (
          <StatisticsView stats={stats} floors={floors} />
        )}

        {activeTab === 'excel' && (
          <ExcelDataSourceView
            tenants={tenants}
            isCustomData={isCustomData}
            fileName={fileName}
            lastRefreshed={lastRefreshed}
            onDataLoaded={handleDataLoaded}
            onDownloadSample={handleDownloadSample}
            onRefresh={handleRefresh}
          />
        )}
      </main>

      {/* Suite Detail Modal */}
      <SuiteDetailModal
        suite={selectedSuite}
        onClose={() => setSelectedSuite(null)}
        onSelectTenant={handleSelectTenantFromSuite}
      />

      {/* Tenant Profile Modal */}
      <TenantDetailModal
        tenant={selectedTenant}
        room={selectedRoom}
        onClose={() => {
          setSelectedTenant(null);
          setSelectedRoom(null);
        }}
      />

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDataLoaded={handleDataLoaded}
        onDownloadSample={handleDownloadSample}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Property Management Building Visualization Tool • Single Responsibility Views
          </span>
          <span>
            Floors 3–21 • Read-Only Excel Source ({stats.totalSuites} Suites / {stats.totalRooms} Rooms)
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
