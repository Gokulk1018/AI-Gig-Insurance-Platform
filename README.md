<div align="center">

<img src="assets/hero_banner.png" alt="ShiftShield Aesthetic V2" width="100%" style="border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1);">

<br/>

<a href="https://flutter.dev"><img src="https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white"/></a>
<a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"/></a>
<a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/></a>
<a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101"/></a>
<a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/></a>

<h1>🛡️ ShiftShield: The Parametric Sovereign</h1>

**World-Class Autonomous Protection for the Gig Economy**

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=24&duration=3500&pause=1000&color=3B82F6&center=true&vCenter=true&width=700&lines=High-Frequency+Governance;Autonomous+Weather+Poling;Real-time+Disbursement+Ledger+2.0;Intelligent+Fraud+Guard" alt="Typing SVG" />
</p>

</div>

---

## ⚡ The Sovereign Philosophy

ShiftShield is the world's first **Parametric Sovereign**. We don't just provide insurance; we provide **certainty**. When a storm hits, our Cortex Engine doesn't wait for a human to review a claim. It match-checks weather telemetry against rider GPS vectors and triggers a disbursement in **sub-600ms**.

---

## 🏗️ Technical Architecture: The Triad

```mermaid
graph TD
    classDef client fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#fff,rx:10,ry:10
    classDef cortex fill:#0f172a,stroke:#10b981,stroke-width:3px,color:#fff,rx:15,ry:15
    classDef storage fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#fff,rx:5,ry:5

    subgraph "🌐 Interfaces"
        RiderApp[Flutter Sovereign Client]:::client
        AdminHub[Executive React Hub]:::client
    end

    subgraph "🧠 The Cortex"
        API[Node.js Gateway]:::cortex
        Weather[Weather Polling Daemon]:::cortex
        Fraud[Parametric Heuristics]:::cortex
    end

    subgraph "🔐 Persistence"
        Mongo[(MongoDB Global Cluster)]:::storage
    end
    
    RiderApp <-->|Real-time Socket| API
    AdminHub <-->|Control Webhook| API
    Weather -->|Trigger Event| API
    API --> Fraud --> Mongo
```

---

## 🛡️ Fraud Guard Lifecycle

Ensuring integrity without sacrificing velocity.

```mermaid
sequenceDiagram
    participant R as 🛵 Rider Node
    participant C as 🛡️ ShiftShield Cortex
    participant W as 🌩️ Weather API
    participant P as 🏦 UPI Gateway

    W->>C: Emit Severe Weather Signal (HSR Layout)
    C->>C: Scan Online Shifts in Quadrant
    C->>R: Request Presence Telemetry
    R-->>C: Transmit Encrypted Location Hash
    Note right of C: Heuristic Matching: 0.2s
    alt Pattern Match Verified
        C->>P: Trigger Parametric Disbursement
        C->>R: Payout Confidence Score: 99.8%
    else Flagged
        C->>C: Route to Admin Review Queue
    end
```

---

## 🚀 Deployment Guide

```bash
# Clone and Initialize
git clone https://github.com/Gokulk1018/AI-Gig-Insurance-Platform.git
cd ShiftShield

# Start Server
cd apps/api-server && npm install && npm run dev

# Launch Executive Hub
cd apps/admin-web && npm install && npm run dev

# Deploy Rider Node
cd apps/rider_app && flutter run -d chrome
```

<div align="center">
  <br/>
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png" width="100%">
  <i>"Shielding the workers that power the future." 🛡️</i>
</div>
