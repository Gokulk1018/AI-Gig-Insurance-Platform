import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:4000')

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [logs, setLogs] = useState([])
  const [users, setUsers] = useState([])
  const [claims, setClaims] = useState([])
  const [shifts, setShifts] = useState([])
  const [zones, setZones] = useState([])
  const [stats, setStats] = useState({ users: 0, activeShifts: 0, claims: 0, zones: 0 })

  const [searchQuery, setSearchQuery] = useState('')
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({ phone: '', avgHourlyEarnings: 150, planTier: 'PLUS', trustScore: 100 })

  useEffect(() => {
    socket.on('connect', () => {
      addLog('Secure connection established with ShiftShield Cortex')
      socket.emit('join_zone', 'GLOBAL_ADMIN')
    })
    
    fetchData()
    const interval = setInterval(fetchData, 4000)

    socket.on('zone_alert', (data) => {
      addLog(`🚨 DISRUPTION DETECTED: ${data.message} | Claim ID: ${data.claimId}`)
      fetchData() 
    })

    return () => {
      socket.off()
      clearInterval(interval)
    }
  }, [activeTab])

  const fetchData = async () => {
    try {
      const p1 = fetch('http://localhost:4000/api/admin/stats').then(res => res.json())
      const p2 = fetch('http://localhost:4000/api/admin/claims').then(res => res.json())
      
      const promises = [p1, p2]
      if (activeTab === 'users') promises.push(fetch('http://localhost:4000/api/admin/users').then(res => res.json()))
      if (activeTab === 'shifts') promises.push(fetch('http://localhost:4000/api/admin/shifts').then(res => res.json()))
      if (activeTab === 'zones') promises.push(fetch('http://localhost:4000/api/admin/zones').then(res => res.json()))

      const results = await Promise.all(promises)
      
      setStats(results[0])
      setClaims(results[1])
      if (activeTab === 'users') setUsers(results[2] || [])
      if (activeTab === 'shifts') setShifts(results[2] || [])
      if (activeTab === 'zones') setZones(results[2] || [])

    } catch (e) { 
        console.error('Error fetching data', e) 
        // addLog('Connection to backend lost. Retrying...')
    }
  }

  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString()
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 50))
  }

  const handleSaveUser = async () => {
    try {
      const url = editingUser ? `http://localhost:4000/api/admin/users/${editingUser._id}` : 'http://localhost:4000/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          _id: editingUser?._id,
          subscription: { status: 'ACTIVE', planTier: newUser.planTier, weeklyCap: 2000, amountUsed: 0 }
        })
      })
      setShowUserModal(false)
      setEditingUser(null)
      fetchData()
    } catch (e) { alert('Failed to save rider profile') }
  }

  const handleUpdateClaim = async (id, status) => {
    await fetch(`http://localhost:4000/api/admin/claims/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetchData()
  }

  const handleToggleShift = async (phone, currentStatus) => {
    await fetch('http://localhost:4000/api/rider/shift/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, goOnline: !currentStatus })
    })
    fetchData()
  }

  const handleSeed = async () => {
      addLog('Seeding database with Bangalore Rider Data...')
      await fetch('http://localhost:4000/api/admin/demo/seed', { method: 'POST' })
      fetchData()
  }

  const handleTriggerRain = async () => {
      if (zones.length === 0) return alert('Seed data first!')
      addLog('🌩️ Triggering Parametric Rain Disruption...')
      await fetch('http://localhost:4000/api/admin/demo/trigger-rain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ zoneId: zones[0]._id })
      })
      fetchData()
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setNewUser({ phone: user.phone, avgHourlyEarnings: user.avgHourlyEarnings, planTier: user.subscription?.planTier || 'PLUS', trustScore: user.trustScore })
    setShowUserModal(true)
  }

  const filteredUsers = users.filter(u => u.phone.includes(searchQuery))

  const renderNav = (id, label, icon) => (
    <div className={`nav-item ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
      <span>{icon}</span> {label}
    </div>
  )

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">ShiftShield Hub</div>
        <div style={{ flex: 1 }}>
          {renderNav('dashboard', 'Executive Pulse', '📊')}
          {renderNav('live-ops', 'Live Telemetry', '🌩️')}
          {renderNav('users', 'Rider Management', '🛵')}
          {renderNav('shifts', 'Force Overrides', '⏱️')}
          {renderNav('zones', 'Protection Zones', '🌍')}
          {renderNav('claims', 'Financial Ledger', '🧾')}
        </div>
        <div className="system-status">
           <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <div className="pulse-dot"></div> Cortex Engine Active
           </div>
           <div style={{ marginTop: 20 }}>
               <button className="btn-primary" style={{ width: '100%', marginBottom: 10, fontSize: '0.8rem' }} onClick={handleSeed}>Seed Demo Data</button>
               <button className="btn-danger" style={{ width: '100%', fontSize: '0.8rem' }} onClick={handleTriggerRain}>Trigger Storm</button>
           </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="glow-text">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h1>
              <p>Autonomous sovereign governance for parametric protection.</p>
            </div>
            <div className="action-bar">
               {activeTab === 'users' && <button className="btn-primary" onClick={() => { setEditingUser(null); setShowUserModal(true); }}>+ Onboard Rider</button>}
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.activeShifts}</div>
            <div className="stat-label">Riders Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">₹{claims.reduce((acc, c) => acc + (c.payoutAmount || 0), 0)}</div>
            <div className="stat-label">Disbursement Volume</div>
          </div>
          <div className="stat-card"><div className="stat-value">{stats.users}</div><div className="stat-label">Total Workers</div></div>
          <div className="stat-card"><div className="stat-value">{stats.zones}</div><div className="stat-label">Secure Zones</div></div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="glass-panel">
            <h3>Disbursement Velocity (Parametric Pulse)</h3>
            <div className="velocity-chart">
              {claims.slice(0, 15).reverse().map((c, i) => (
                <div key={i} className="velocity-bar" title={`₹${c.payoutAmount}`} style={{ height: `${Math.min(100, (c.payoutAmount / 500) * 100)}%` }}></div>
              ))}
            </div>
            <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="sub-panel">
                    <h4>Trust Allocation</h4>
                    <div style={{ height: 10, background: '#1e293b', borderRadius: 5, marginTop: 10 }}>
                        <div style={{ width: '78%', height: '100%', background: '#3b82f6', borderRadius: 5 }}></div>
                    </div>
                </div>
                <div className="sub-panel">
                    <h4>Zone Saturation</h4>
                    <div style={{ height: 10, background: '#1e293b', borderRadius: 5, marginTop: 10 }}>
                        <div style={{ width: '42%', height: '100%', background: '#8b5cf6', borderRadius: 5 }}></div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-panel">
            <input className="search-input" placeholder="Search phone numbers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <table className="data-table">
              <thead><tr><th>Phone</th><th>Trust</th><th>Rate</th><th>Remaining cap</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u._id}>
                    <td style={{ color: '#fff' }}>{u.phone}</td>
                    <td style={{ color: u.trustScore > 90 ? '#10b981' : '#f59e0b' }}>{u.trustScore}%</td>
                    <td>₹{u.avgHourlyEarnings}/hr</td>
                    <td style={{ color: '#3b82f6' }}>₹{(u.subscription?.weeklyCap || 0) - (u.subscription?.amountUsed || 0)}</td>
                    <td><button className="btn-success" onClick={() => openEditModal(u)}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'shifts' && (
          <div className="glass-panel">
             <table className="data-table">
              <thead><tr><th>Driver</th><th>Zone</th><th>Status</th><th>Control Override</th></tr></thead>
              <tbody>
                {shifts.map(s => (
                  <tr key={s._id}>
                    <td>{s.userId?.phone}</td>
                    <td>{s.zoneId?.name}</td>
                    <td><span className={`claim-badge ${s.isActive ? 'badge-approved' : 'badge-pending'}`}>{s.isActive ? 'ONLINE' : 'OFFLINE'}</span></td>
                    <td>
                        <button className={s.isActive ? 'btn-danger' : 'btn-success'} onClick={() => handleToggleShift(s.userId?.phone, s.isActive)}>
                           {s.isActive ? 'Force Offline' : 'Force Online'}
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'live-ops' && (
           <div className="glass-panel">
             <div className="terminal">
               <h3 style={{ borderBottom: '1px solid #333', paddingBottom: 10 }}>&gt;_ Cortex Telemetry Stream</h3>
               <div style={{ maxHeight: 400, overflowY: 'auto', paddingTop: 10 }}>
                 {logs.map((log, i) => <div key={i} className="log-entry" style={{ color: log.includes('🚨') ? '#ef4444' : '#10b981' }}>&gt; {log}</div>)}
               </div>
             </div>
           </div>
        )}

        {activeTab === 'claims' && (
          <div className="glass-panel">
            <table className="data-table">
              <thead><tr><th>ID</th><th>Rider</th><th>Risk</th><th>Payout</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {claims.map(c => (
                  <tr key={c._id}>
                    <td>#{c._id.slice(-6).toUpperCase()}</td>
                    <td>{c.userId?.phone}</td>
                    <td style={{ color: c.fraudScore > 80 ? '#10b981' : '#f59e0b' }}>{c.fraudScore}</td>
                    <td style={{ fontWeight: 'bold' }}>₹{c.payoutAmount}</td>
                    <td><span className={`claim-badge ${c.status === 'APPROVED_AUTO' ? 'badge-approved' : c.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}`}>{c.status}</span></td>
                    <td>
                      <div className="action-bar">
                        <button className="btn-success" style={{ padding: '6px 12px' }} onClick={() => handleUpdateClaim(c._id, 'APPROVED_AUTO')}>Approve</button>
                        <button className="btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleUpdateClaim(c._id, 'REJECTED')}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: '#fff', marginBottom: 20 }}>{editingUser ? 'Update Profile' : 'Onboard Rider'}</h2>
            <div className="form-group"><label>Phone Identity</label><input value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} /></div>
            <div className="form-group"><label>Earnings Velocity (₹/hr)</label><input type="number" value={newUser.avgHourlyEarnings} onChange={e => setNewUser({...newUser, avgHourlyEarnings: e.target.value})} /></div>
            <div className="form-group"><label>Trust Score (%)</label><input type="number" value={newUser.trustScore} onChange={e => setNewUser({...newUser, trustScore: e.target.value})} /></div>
            <div className="action-bar" style={{ marginTop: 20 }}>
               <button className="btn-primary" onClick={handleSaveUser}>Process Changes</button>
               <button className="btn-danger" onClick={() => setShowUserModal(false)}>Discard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default App
