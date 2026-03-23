<div align="center">

<img src="assets/hero_banner.png" alt="ShiftShield Sovereign V2" width="100%" style="border-radius: 20px; box-shadow: 0 20px 80px rgba(59, 130, 246, 0.4); border: 1px solid rgba(255,255,255,0.15);">

<br/>

<div style="display: flex; justify-content: center; gap: 10px; margin-top: 20px;">
  <a href="https://flutter.dev"><img src="https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white"/></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/></a>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/></a>
  <a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101"/></a>
</div>

<br/>

<h1 style="font-family: 'Orbitron', sans-serif; letter-spacing: 5px; background: linear-gradient(90deg, #3b82f6, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SHIFT SHIELD CORE</h1>

**The World's First Parametric Sovereign for the Global Gig Fleet**

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=800&size=26&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&width=800&lines=High-Frequency+Governance;Autonomous+Parametric+Yield;Real-time+Disbursement+Engine;AI-Driven+Fraud+Heuristics" alt="Typing SVG" />
</p>

</div>

---

## 🔱 The Sovereign Philosophy

ShiftShield isn't just an application—it's a **Parametric Protocol**. We've eliminated the human friction from the insurance lifecycle. By fusing real-time weather telemetry with persistent GPS vectors, we achieve **Automated Trust**. 

> [!IMPORTANT]
> **Sub-600ms Velocity**: From disruption detection to bank-ready disbursement. No claims forms. No adjusters. No delays.

---

## 🏗️ Technical Architecture 2.0

```mermaid
graph TD
    classDef interface fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff,rx:12
    classDef core fill:#0f172a,stroke:#10b981,stroke-width:4px,color:#fff,rx:20
    classDef spatial fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff,rx:8

    subgraph "✨ Sovereign Interfaces"
        RiderClient[Rider App / Flutter]:::interface
        AdminCortex[Executive Hub / React]:::interface
    end

    subgraph "🧠 The ShiftShield Cortex"
        HFS[High-Frequency Server]:::core
        WPD[Weather Polling Daemon]:::core
        PHM[Parametric Heuristic Model]:::core
    end

    subgraph "🌍 Spatial Persistence"
        GeoDB[(MongoDB Geospacial Cluster)]:::spatial
    end
    
    RiderClient <-->|Bi-directional Socket| HFS
    AdminCortex <-->|Administrative Control| HFS
    WPD -->|Real-time Ingestion| HFS
    HFS --> PHM --> GeoDB
```

---

## 🛡️ Autonomous Fraud Guard

Our multi-layered heuristic stack ensures parametric integrity at scale.

| Layer | Technology | Function |
| :--- | :--- | :--- |
| **L1: Presence** | GPS / Geofencing | Verifies physical exposure to disruption zone |
| **L2: Velocity** | Subscription Tracking | Prevents cap-skimming and account farming |
| **L3: Pattern** | Disruption Match | Cross-references telemetry with rider shift status |

---

## 🚀 Rapid Deployment

```bash
# Clone the Core
git clone https://github.com/Gokulk1018/AI-Gig-Insurance-Platform.git

# Ignite the Cortex (Backend)
cd apps/api-server && npm i && npm run dev

# Launch Executive Hub (Frontend)
cd apps/admin-web && npm i && npm run dev

# Deploy Rider Edge (Mobile)
cd apps/rider_app && flutter run -d chrome
```

---

<div align="center">
  <br/>
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">
  <i>"Redefining protection for the digital worker." 🛡️</i>
</div>
