# ShiftShield: Architectural & Implementation Blueprint

## 1. Executive Build Vision
ShiftShield is a real-time, parametric income protection platform for gig delivery workers in India. We do not sell insurance; we sell localized, time-bound income certainty. If a rider pays ₹29/week and their 4-hour shift in Koramangala is rained out, they get an instant UPI payout estimating their lost earnings. The product is powered by hyperlocal disruption geofencing, real-time live-ops telemetry, deterministic trigger logic, and algorithmic fraud detection—designed for trust, transparency, and operational scalability without manual claims processing.

## 2. Product Scope Layers
- **Hackathon MVP**: Mocked weather API input, manual claim approval by admin, 2 hardcoded zones, basic Flutter app with Socket.IO alerts, manual payout button.
- **Strong Beta**: Real-time integration with Tomorrow.io/OpenWeather for rain/heat triggers, automatic claim generation, automated trust scoring (basic heuristics), scheduled automated payouts for trusted riders.
- **Production Version**: AI-driven fraud anomaly detection, map-based dynamic hazard routing, realtime platform-outage tracking via API/scraping, instant UPI disbursements (RazorpayX), granular geohash mapping.

## 3. Product Requirements
- **Functional**: Seamless profile onboarding, select active zones, log regular shifts, purchase weekly subscription via UPI, view live hazard map, auto-generated claims, payout tracking.
- **Non-Functional**: Under 200ms API response time, support offline caching for zones/subscriptions, resilience to low network coverage (2G/3G fallbacks).
- **Realtime**: Live disruption overlapping with a rider's current shift must trigger a push notification and UI update within 5 seconds via Socket.IO.
- **Trust & Transparency**: All claims must clearly explain *exactly* what weather/outage triggered it, at what time, and the math behind the payout.

## 4. Core Modules
1. **Auth & User**: Purpose: Secure access & identity. Features: OTP login, profile. Inputs: Phone, OTP. Outputs: JWT. Dep: SMS Gateway (Twilio/Firebase).
2. **Rider Profile**: Purpose: Gig worker context. Features: Vehicle type, platform (Zomato/Swiggy), avg earnings/hr. Inputs: User data. Outputs: Rider ID mapping.
3. **Zone Management**: Purpose: Geo-bounding risks. Features: Polygon mapping of cities. Inputs: Geohashes. Outputs: Defined coverage zones.
4. **Shift Protection**: Purpose: Mapping user working hours. Features: Shift creation (e.g., 7PM-11PM Mon-Sat). Inputs: Time blocks. Outputs: Protected intervals.
5. **Subscription & Plans**: Purpose: Monetization & limits. Features: Lite/Standard/Plus plans. Inputs: Payment. Outputs: Active Sub status.
6. **Realtime Disruption**: Purpose: Ingest risks. Features: Listen to weather/AQI webhooks. Inputs: API polling. Outputs: Disruption Events in Redis.
7. **Trigger Engine**: Purpose: Overlap calculation. Features: Matches [Disruption Zone + Time] against [Rider Zone + Shift]. Inputs: Disruption, Shifts. Outputs: Trigger Match Event.
8. **Claims Automation**: Purpose: Removing paperwork. Features: Auto-drafts claims on Trigger Match. Inputs: Trigger Match. Outputs: Pending Claim.
9. **Earnings Loss Estimation**: Purpose: Payout sizing. Features: Calculates proportional lost time. Inputs: Disruption duration, Rider's avg hrly rate. Outputs: Payout ₹ value.
10. **Fraud Detection**: Purpose: Protecting capital. Features: Checks velocity, GPS spoofing, recent payout frequency. Inputs: Claim context. Outputs: Fraud Score (1-100).
11. **Payout Module**: Purpose: Money transfer. Features: UPI disbursal, retry queues. Inputs: Approved Claim. Outputs: Payment Reference.
12. **Notification & Comm**: Purpose: Rider trust. Features: FCM pushes, SMS. Inputs: Events. Outputs: Delivery receipts.
13. **Rider Home Dash**: Purpose: Core UI. Features: Live weather radar, active protection status, earning cap. Inputs: Socket streams. Outputs: Flutter UI.
14. **Admin Operations**: Purpose: Control center. Features: Override claims, view heatmaps. Inputs: DB aggregations. Outputs: React UI.
15. **Analytics**: Purpose: Business health. Features: Loss ratios, active subs, MRR. Inputs: Read replicas. Outputs: Charts.
16. **AI/Recommendation**: Purpose: Upselling. Features: "Heavy rain expected this week, upgrade to Plus". Inputs: Forecasts. Outputs: Push notifications.
17. **Rules Engine**: Purpose: Dynamic thresholds. Features: Set "Heavy Rain = >10mm/hr". Inputs: Admin config. Outputs: Active policies.
18. **Audit & Compliance**: Purpose: Traceability. Features: Immutable logs of all trigger changes and payouts. Inputs: System logs. Outputs: Audit trails.
19. **Support Module**: Purpose: Dispute handling. Features: Ticket creation for denied claims. Inputs: Rider messages. Outputs: Zendesk/Custom tickets.
20. **Partner Integration**: Purpose: Future B2B. Features: API for Swiggy to embed ShiftShield. Inputs: OAuth tokens. Outputs: White-label data.

## 5. Enhancement Modules
- **Protection Intelligence**: Analyzes historical weather/traffic to price subscriptions dynamically. Makes it premium by ensuring pricing is fair and backed by data logic, not arbitrary.
- **Explainable Payouts**: Shows a visual receipt ("32 mins rain * ₹80/hr = ₹42 payout"). Builds ultimate trust; gig workers hate black-box deductions.
- **Trust Score**: Riders who haven't claimed frequently but maintain active subs get a 100/100 score, granting them instant automated payouts. Lower scores require admin approval. Gamifies good behavior.
- **City Risk Control**: Admin toggles to temporarily pause new policy purchases in a zone if a sudden cyclone hits, preventing adverse selection. Ensures startup survival.

## 6. End-to-End Product Flow
1. Rider downloads app, OTP verify.
2. Enters avg earnings (₹100/hr) and selects primary zone (HSR Layout).
3. Defines shifts (Fri-Sun 6PM-11PM).
4. Subscribes to ₹29/week Standard Plan via UPI.
5. Friday 8PM: Heavy rain hits HSR. Weather API pushes to Backend.
6. Trigger Engine detects HSR rain overlaps with active shift.
7. Socket.IO pushes "Rain Detected in HSR - Protection Active" to Rider's app.
8. Rain stops at 9PM. Loss Engine calculates 1 hr lost = ₹100.
9. Fraud Engine checks (Score 95 - Safe). Claim auto-approved.
10. Payout Engine fires Razorpay UPI payout. Notification sent.

## 7. Detailed User Stories
- **Rider**: "As a rider, I want to see my phone vibrate when a storm starts in my zone, so I know ShiftShield is securing my income while I take shelter."
- **Admin**: "As an admin, I want to see a live map of all triggered disruptions and the estimated total payout exposure, so I can monitor capital health."
- **Ops Reviewer**: "As an ops agent, I want a queue of 'flagged' claims (Fraud Score < 40) with the reasons highlighted, so I can manually approve or reject them fast."
- **Partner (Future)**: "As a delivery platform manager, I want to view my fleet's coverage ratio to understand how many workers are protected."

## 8. Screen-by-Screen UI Plan
**Flutter Mobile (Rider)**
- **Splash/Onboarding**: Value prop illustrations.
- **Phone Auth**: Standard OTP.
- **Profile/Setup**: Earnings input, zone selector map.
- **Home Dashboard**: Live map card, "Protection Status: Active/Inactive", Recent Activity list, Quick Subscribe CTA.
- **My Plan & Shifts**: Weekly calendar grid showing purple blocks (shifts), "Edit Shifts", "Upgrade Plan".
- **Claim Detail**: Expandable card, visual formula of payout, UPI status.
- **Wallet/History**: Total protected, total withdrawn.

**React Web (Admin)**
- **Global Overview**: Revenue, Loss Ratio, Active Triggers map (deck.gl/Leaflet).
- **Disruption Console**: Ingested weather/traffic events, manual trigger creation.
- **Claims Queue**: Kanban board (Auto-Paid, Manual Review, Rejected).
- **Rider CRM**: Detailed view of a Rider's trust score and history.
- **Rules Config**: Sliders for rain thresholds, AQI limits.

## 9. Navigation and UX Structure
**Mobile Bottom Tab**: Home | Shifts | Plans | Activity.
**UX Hierarchy**: Status context is always at the top (Green = Covered, Grey = Off-shift, Red = Disruption Guarding). Minimize clicks—all critical info is pushed to Home.

## 10. Rider Home Dashboard Design (Flutter)
- **Top Bar**: Profile Pic, Trust Score Badge (e.g., 🌟 98), Notification bell.
- **Hero Card (Glassmorphism)**: "Protection Active" with a shimmering radial gradient. Shows current plan cap (e.g., ₹250 / ₹900 used).
- **Live Disruption Radar**: Minimal Mapbox widget locked to their zone. If rain approaches, displays a warning banner inside the map.
- **Recent Claims Horizontal Scroll**: Small chips showing "+₹82 (Rain)" with a green checkbox for paid.

## 11. Admin Dashboard Design (React)
- **Sidebar**: Dashboard, Live Ops, Claims, Rules, Users.
- **Top Stat Row**: Live Active Shifts, Current Capital Exposure, Claims Today, Avg Payout Speed.
- **Main View (Live Ops)**: Split view. Left: Map with glowing red radius circles for active storm/heatwave. Right: Streaming feed of trigger matches generating claims.

## 12. Realtime Disruption Monitoring Design
A Node.js microservice (`ingestion-worker`) polls Tomorrow.io API every 5 mins for bound geohashes. If a metric (e.g., Rain Intensity) crosses the threshold (e.g., >8mm/hr), it publishes a `DISRUPTION_STARTED` event to Redis Pub/Sub, with poly-coords and severity.

## 13. Trigger Engine Design
A Redis listener picks up `DISRUPTION_STARTED`. It queries MongoDB: `find({ "shifts": { $elemMatch: { zoneId: payload.zoneId, startTime: { $lte: now }, endTime: { $gte: now }}}, "subscription.status": "ACTIVE" })`. For every matched rider, it publishes a `TRIGGER_MATCHED` event, initiating the claim lifecycle.

## 14. Claims Automation Design
Event-driven state machine:
`DRAFT` (match found) -> `CALCULATING` (waiting for disruption to end to assess duration) -> `SCORING` (running fraud heuristics) -> `APPROVED_AUTO` (Trust > 80) -> `PAYING` -> `SETTLED`.
State changes emit Socket.IO events directly to the rider's phone.

## 15. Earnings Loss Estimation Design
Formula: `Claim = min((Disruption_Duration_Mins / 60) * Avg_Hourly_Rate, Remaining_Weekly_Plan_Cap)`.
If a rider earns ₹100/hr, and rain lasts 45 mins, payout = `(45/60)*100 = ₹75`.

## 16. Fraud Detection Design
Rule-based scoring: Starts at 100.
- Claims in last 7 days > 3: -30 pts.
- Device ID associated with multiple accounts: -50 pts.
- GPS ping outside active zone during disruption: -40 pts.
*Thresholds*: < 60 = Manual Review, < 20 = Auto Reject.

## 17. Trust Score Design
Long-term metric tracking Rider behavior.
Positive actions: Renewing subscription (+5), No claims in a week (+10).
Negative actions: Rejected fraudulent claim (-50).
High Trust unlocks "Instant UPI Payouts" vs "24-hr Processing".

## 18. Payout Engine Design
Listens to `CLAIM_APPROVED` events. Calls RazorpayX / Paytm Payouts API.
- If Success: Update DB to `SETTLED`, send Push Notification.
- If Failure (e.g., invalid UPI): Mark `UPI_FAILED`, prompt user in app to update VPA, retry 3 times max.

## 19. AI/Recommendation Engine
Runs as a daily cron. Scans upcoming 3-day weather forecasts for rider zones. If > 80% chance of severe rain, sends a tailored push: "Heavy rain expected in HSR this Friday. Your Lite plan may not cover all losses. Upgrade to Plus for ₹20?"

## 20. Rules and Configuration Engine
A dedicated MongoDB collection `config_rules`. Cached in Redis. Defines `weather_thresholds` (e.g., `RAIN_HEAVY_MM: 10`). Trigger engine fetches from Redis to ensure we can hot-swap sensitivities during extreme events without deploying code.

## 21. Audit and Compliance Layer
All state mutations (Claim Approved, Payout Sent) are appended to a `ledger_events` collection with a timestamp, action, actor (system/admin user ID), and previous/new state. Immutable pattern.

## 22. Support and Dispute Resolution
If a claim is auto-rejected (e.g., Rider reported off-zone), they can press "Dispute". This changes state to `DISPUTED` and drops it into the Admin Operations React queue. Ops can override and push state to `APPROVED_MANUAL`.

## 23. Partner Integration Design
Exposed B2B REST APIs: `POST /api/v1/partners/coverages` allowing a company like Zomato to bulk-enroll thousands of riders by passing UUIDs and Zones using an API Key auth.

## 24. System Architecture
- **Clients**: Flutter (Rider), React (Admin).
- **Gateway**: Nginx / AWS ALB.
- **Backend Core**: Node.js + Express instances.
- **Realtime**: dedicated Socket.IO server nodes.
- **Queue/State**: Redis (Pub/Sub for internal services, real-time presence).
- **Persistence**: MongoDB Atlas (Replica set).
- **Async Workers**: BullMQ for processing payouts & polling weather.

## 25. Realtime Communication Design
- **REST**: Auth, Profile updates, Plan purchases, historical data fetching.
- **Socket.IO**: Live Disruption active/cleared, Live Claim state changes.
- **Background Jobs**: Weather polling, Fraud scoring, Bulk push pushes.
- **Push Notification**: "Payment received" or offline alerts.

## 26. Database Design (Collections)
- `users`: Profile, UPI ID, trust score.
- `zones`: GeoJSON polygons, active risks.
- `shifts`: Weekly recurring matrix per user.
- `subscriptions`: Plan tier, validity, amount remaining.
- `disruptions`: Weather events with start/end.
- `claims`: Core transaction record.

## 27. MongoDB Schema Draft
See Bonus A.

## 28. API Design
See Bonus B.

## 29. Realtime Event Payloads
**Socket.IO Outbound (Server -> Rider)**
```json
{
  "event": "disruption.alert",
  "data": {
    "zoneId": "blr_hsr_01",
    "type": "HEAVY_RAIN",
    "status": "ACTIVE",
    "message": "Rain detected in HSR. ShiftShield protection is active.",
    "startedAt": "2026-03-20T14:30:00Z"
  }
}
```

## 30. Recommended Tech Stack Justification
- **Flutter**: Single codebase, beautiful UI, riverpod handles realtime state streams effortlessly.
- **Node.js**: Asynchronous I/O perfect for massive webhook/socket traffic.
- **MongoDB**: GeoJSON spatial queries (`$geoIntersects`) make zone overlapping natively fast and easy.
- **Redis + Socket.IO**: Industry standard for horizontally scalable real-time state.

## 31. Monorepo Folder Structure
```text
/shiftshield-monorepo
  /apps
    /rider-app (Flutter)
    /admin-web (React + Vite)
    /api-server (Node + Express)
  /packages
    /shared-types (TS interfaces)
    /fraud-engine (Pure logic)
```

## 32. Flutter App Architecture
- `/lib`
  - `/core`: API client (Dio), theme, routing (GoRouter)
  - `/features`
    - `/auth`: presentation, providers, repository
    - `/home`: includes map widget, live status provider
    - `/claims`
  - `/services`: SocketService, PushNotificationService

## 33. Node.js Backend Architecture
- `/src`
  - `/api`: routes, controllers, middlewares
  - `/services`: PayoutService, WeatherService
  - `/engine`: TriggerMatcher, FraudScorer
  - `/models`: Mongoose schemas
  - `/sockets`: Socket handlers
  - `/workers`: BullMQ queues

## 34. React Admin Architecture
- `/src`
  - `/pages`: Dashboard, Claims, Users, Rules
  - `/components`: MapWidget, StatCard, ClaimRow
  - `/hooks`: useSocket, useApi
  - `/services`: Axios instance

## 35. Build Roadmap (48h Hackathon)
- **Hour 0-4**: DB Schemas, Node Express skeleton, Flutter setup.
- **Hour 4-12**: Auth, Rider profile, Shift selection, basic Subs UI.
- **Hour 12-24**: Weather polling (or mocked clicker), Trigger matcher logic.
- **Hour 24-32**: Claim automation, Fraud logic, Socket.IO wiring.
- **Hour 32-40**: Admin dashboard, Realtime UI updates in Flutter, Payout stubs.
- **Hour 40-48**: Polish UI, seed realistic data, record pitch video.

## 36. 4-Person Team Split
- **Hacker 1**: Backend (Express, Mongo, APIs, BullMQ).
- **Hacker 2**: Rule Engines (Trigger logic, Fraud math, Realtime Socket/Redis matching).
- **Hacker 3**: Mobile App (Flutter UI, state, socket integration).
- **Hacker 4**: Admin Dashboard (React) + UX/Pitch creation + Live Demo orchestration.

## 37. What to Build vs Stub
- **BUILD LIVE**: The Trigger overlap logic, Socket.IO push, UI reactivity, Admin Dashboard controls.
- **STUB/MOCK**: Actual UPI money transfer (use sandbox/logs), Real weather (build a button in admin to "Start Storm" for reliable demo timing), OTP (hardcode `123456`).

## 38. Realtime Fallback Strategy
If Socket.IO drops (rider enters dead zone), the app relies on REST polling when foregrounded. Claims process server-side regardless. Upon reconnect, app syncs missed notifications from `/api/v1/notifications/unread`.

## 39. Analytics and Reporting Design
Metrics: Total Coverage Sold (₹), Claim Rate (%), Auto-Payout Ratio.
Analytics generated via MongoDB Aggregation Pipelines run hourly and stored in `daily_stats` collection for fast Admin dashboard loading.

## 40. README Structure
- Catchy Header & Logo
- 1-Liner Pitch
- The Problem (Gig income volatility)
- The Solution (Realtime Parametric Protection)
- System Architecture Diagram
- Key Features (How the Engine works)
- Tech Stack
- How to Run Locally (Docker compose).

## 41. Judge-Focused Technical Narrative
"ShiftShield isn't just an app; it's a high-throughput event processing engine. While standard insurance takes 3 weeks of paperwork, our system uses GeoJSON overlapping and Redis pub/sub to automatically generate, score, and pay a claim over UPI in under 500 milliseconds the moment a weather hazard clears."

## 42. Known Limitations
- MVP relies on bounding box grids, real city topology might mean rain hits half a zone.
- Hyperlocal APIs can be inaccurate; requires multiple vendor consensus (Tomorrow.io + Accuweather) in production.
- Assumes rider remains in the zone. Spoofing GPS is a risk (mitigated by Fraud engine).

## 43. Final Build Recommendation
Build the **"Magic Trigger"** demo. Judges won't care about a login screen. They will be blown away if Hacker 4 clicks "Trigger Heavy Rain in Zone A" on the Admin panel, and instantly Hacker 3's phone screen turns red with "Protection Active", followed by a simulated ₹120 claim receipt. Focus *entirely* on perfecting that 10-second magic workflow.

---

## BONUS SECTION

### BONUS A: Exact Mongoose schema drafts
```javascript
const userSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  role: { type: String, enum: ['RIDER', 'ADMIN'], default: 'RIDER' },
  trustScore: { type: Number, default: 100 },
  avgHourlyEarnings: { type: Number },
  primaryZoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  upiId: String
});

const shiftSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  dayOfWeek: Number, // 0-6
  startHour: Number, // 0-23
  endHour: Number,
  isActive: Boolean
});

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  disruptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Disruption' },
  status: { type: String, enum: ['DRAFT', 'SCORING', 'APPROVED', 'REJECTED', 'SETTLED'] },
  fraudScore: Number,
  lossDurationMins: Number,
  payoutAmount: Number,
  createdAt: { type: Date, default: Date.now }
});
```

### BONUS B: Exact REST API list
- `POST /auth/request-otp`
- `POST /auth/verify-otp`
- `GET /rider/profile`
- `PUT /rider/shifts` // Update weekly shifts matrix
- `POST /subscriptions/purchase`
- `GET /claims` // History
- `GET /admin/stats`
- `POST /admin/disruptions/trigger` // Demo mock tool

### BONUS C: Exact Socket.IO event list
- **Client Emits**: `join_zone`, `leave_zone`, `ping_location`
- **Server Emits**: 
  - `zone_alert` (disruption started/ended)
  - `claim_status` (payload: claim ID, new state)
  - `wallet_update` (balance changes)

### BONUS D: Sample Trigger pseudocode
```javascript
async function handleDisruption(disruptionEvent) {
  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay();
  
  // Find all riders overlapping this time and place with an active sub
  const affectedShifts = await Shift.find({
    zoneId: disruptionEvent.zoneId,
    dayOfWeek: currentDay,
    startHour: { $lte: currentHour },
    endHour: { $gte: currentHour }
  }).populate('userId');

  for(let shift of affectedShifts) {
    if(await hasActiveSubscription(shift.userId)) {
      await ClaimService.createDraftClaim(shift.userId, disruptionEvent);
      SocketService.notifyUser(shift.userId, 'zone_alert');
    }
  }
}
```

### BONUS E: Sample Fraud Scoring Logic
```javascript
function calculateFraudScore(user, recentClaims, locationPing) {
  let score = user.trustScore; // Base: 100
  if (recentClaims.length > 2) score -= 30; // Velocity check
  if (!locationPing.inZone) score -= 50; // Spoof check
  
  if (score >= 80) return { score, action: 'AUTO_APPROVE' };
  if (score >= 40) return { score, action: 'MANUAL_REVIEW' };
  return { score, action: 'AUTO_REJECT' };
}
```

### BONUS F: Sample Payout logic
```javascript
const maxPlanLimit = subscription.plan.weeklyMaxPayout; // e.g. 900
const usedLimit = subscription.usedAmount; // e.g. 800
const calculatedLoss = (disruption.durationMins / 60) * user.avgHourlyEarnings; // e.g. 200

// They only have 100 left on their limit.
const finalPayout = Math.min(calculatedLoss, maxPlanLimit - usedLimit); // Final = 100
```

### BONUS I: 48-hour Execution Checklist
- [ ] Initialize Turborepo (Node/React) and Flutter project.
- [ ] Connect Atlas DB to Node.
- [ ] Create Admin Dashboard with Map Widget.
- [ ] Create simple Node script to generate mock Weather events.
- [ ] Build Trigger matching logic function.
- [ ] Wire Flutter to Socket.IO.
- [ ] Make the Flutter Home screen react when Admin triggers weather.
- [ ] Record pitch.

### BONUS J & K: Judge Explanations
**AI (Bonus J):** "We don't use AI just for buzzwords. We use it offline via cron jobs to analyze historical weather patterns and recommend specific plan tiers to riders. If our model sees a high-rain week coming, it proactively suggests the 'Plus' plan."
**Realtime (Bonus K):** "Our core engine bypasses slow database polling. Disruption webhooks immediately publish to Redis, which triggers our matching engine to calculate spatial overlap, and emits Socket.IO packets to the Flutter app in sub-50ms."

---

### End-of-Blueprint Generation (1-10 Tasks)

1. **Flutter app page list**: Login, Onboarding, HomeDash, MyShifts, UpgradePlan, ClaimDetails.
2. **Express route skeleton**: `/api/auth`, `/api/rider`, `/api/coverage`, `/api/claims`, `/api/admin`.
3. **Mongoose schema draft**: (See Bonus A) - Users, Zones, Shifts, Claims, Disruptions.
4. **Sample seed data**: `Zone (HSR_Layout)`, `User (Suresh_Rider, 100/hr)`, `Shift (Fri 6PM-10PM)`.
5. **Socket.IO event defs**: (See Bonus C) - `zone_alert`, `claim_status`.
6. **Fraud scoring logic**: (See Bonus E) - Volume penalties, location heuristics.
7. **Payout calculation logic**: (See Bonus F) - min(estimatedLoss, remainingLimit).
8. **Admin dashboard widget list**: GlobalStats Row, Live Map View, Disruption Emitters, Claims Queue Table.
9. **Rider dashboard component list**: ProtectionStatusCard (Gradient), ActiveMapRadar, RecentPayoutsList.
10. **Build Order**: DB -> Node Core -> Flutter Static UI -> Admin Mock Triggers -> Socket/Redis Wiring -> Demo Polish.
