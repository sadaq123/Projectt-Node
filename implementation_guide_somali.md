# Tilmaamaha Farsamo ee 8-da Qof (Technical Implementation Guide)

Halkan waa sida farsamo ahaan (implementation) loola dhaqmayo dhismaha nidaamkan iyadoo la raacayo 8-da qof ee kooxda ah.

## 1. Deegaanka Wada Shaqaynta (Shared Environment)
Si 8-da qof ay u wada shaqeeyaan, waa in la sameeyaa:
- **Git Repository:** Hubi in qof walba uu leeyahay `branch` u gaar ah (tusaale: `git checkout -b feature-cashier`).
- **Shared Database:** Midkood waa in la isticmaalaa MongoDB Atlas (Cloud) ama in qof walba uu leeyahay Database maxali ah (`localhost`) oo isku xog ah.
- **Environment Variables (.env):** Waa in la wadaagaa faylka `.env` si SECRET_KEY iyo URLs ay isku mid u noqdaan.

---

## 2. Qaab-dhismeedka Galka (Folder Structure Strategy)

### Backend (Node.js/Express)
Shaqaalaha Backend-ka (4 qof) waxay u kala qeybsanayaan sidan:
- `models/`: Meesha lagu qeexo schema-ga (User.js, Room.js, Booking.js).
- `routes/`: Meesha Endpoint-yada la dhigo (auth.js, rooms.js, reports.js).
- `middleware/`: Meesha amniga iyo xaqiijinta la dhigo (authMiddleware.js, validate.js).

### Frontend (React/Vite)
Shaqaalaha Frontend-ka (4 qof) waxay u kala qeybsanayaan sidan:
- `src/components/`: Meesha Dashboard-yada gaarka ah (CashierDashboard.jsx, StaffDashboard.jsx).
- `src/context/`: Meesha xogta laga wadaago (AuthContext.jsx, ThemeContext.jsx).
- `src/pages/`: Meesha bogaga guud (Home.jsx, Login.jsx).

---

## 3. Habka Hirgelinta Amniga (RBAC Implementation)
Tani waa qaybta ugu muhiimsan ee kala xadeynaysa 8-da qof iyo dadka nidaamka isticmaalaya.

### Backend Side (Middleware):
```javascript
// middleware/roleAuth.js
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Loo ma ogola qaybtan!' });
    }
    next();
  };
};

// Isticmaalka (Usage in routes):
router.get('/reports', auth, authorize(['accountant', 'admin']), (req, res) => { ... });
```

### Frontend Side (ProtectedRoute):
```javascript
// components/ProtectedRoute.jsx
<Route path="/cashier" element={
  <ProtectedRoute roles={['cashier', 'admin']}>
    <CashierDashboard />
  </ProtectedRoute>
} />
```

---

## 4. Xiriirka u dhexeeya Kooxaha (API Communication)
Si kooxda dhisaysa Frontend-ka ay ula xiriiraan Backend-ka:
1. **Endpoint Agreement:** Waa in la isku raacaa URL-ka (tusaale: `/api/bookings`).
2. **JSON Structure:** Waa in la isku raacaa xogta la isu dirayo (tusaale: `{ "name": "...", "room": "..." }`).
3. **Axios Setup:** Hal meel laga maamulo API calls-ka si looga fogaado khaladka.

---

## 5. Qorshaha 8-da Qof (Task Assignments)
| Qofka | Meesha uu ka shaqaynayo | Qalabka uu isticmaalayo |
| :--- | :--- | :--- |
| **P1** | Core API & DB Setup | Express, Mongoose, MongoDB |
| **P2** | Auth & JWT Security | JWT, Bcrypt, Middleware |
| **P3** | UI Design & CSS | Vanilla CSS (Glassmorphism), Layouts |
| **P4** | Booking & Room Logic | Full-stack (React + Node) |
| **P5** | Food Ordering System | Full-stack (React + Node) |
| **P6** | Payments & Receipts | Frontend (Printing) + Backend |
| **P7** | Financial Reports | Data processing, CSV/Excel export |
| **P8** | User & Role Management| Super Admin Access & Control |

---

**Fiiro gaar ah:** Si hirgelintan (implementation) ay u guuleysato, kooxda Frontend-ka waa in ay isticmaalaan xogta uu Backend-ka u soo diyaariyay oo kaliya, iyadoo la ilaalinayo quruxda muraayada ah (**Glassmorphism**).
