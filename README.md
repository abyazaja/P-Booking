# P-Booking - Sistem Booking Lapangan Futsal

Sistem booking lapangan futsal yang lengkap dengan fitur user management, court management, booking system, dan notifikasi real-time menggunakan React, TailwindCSS, dan Supabase.

## 🚀 Fitur Utama

### 👥 User Management
- ✅ Registrasi user dengan status "inactive" default
- ✅ Admin dapat approve/reject user baru
- ✅ Hanya user aktif yang bisa login dan booking
- ✅ Pesan notifikasi untuk user yang belum di-approve

### 🏟️ Court Management (Admin)
- ✅ CRUD operasi untuk lapangan (court)
- ✅ Status court: Active, Inactive, Maintenance
- ✅ Hanya court Active yang bisa dibooking
- ✅ Upload gambar court
- ✅ Tampilan tabel dan card view

### 📅 Booking System
- ✅ User aktif dapat melakukan booking
- ✅ Form booking dengan pilihan court, tanggal, waktu
- ✅ Validasi ketersediaan waktu
- ✅ Status booking: pending, approved, rejected, cancelled
- ✅ Admin dapat approve/reject booking

### 🔔 Notifikasi System
- ✅ Notifikasi real-time menggunakan Supabase Realtime
- ✅ Toast notifications
- ✅ Notifikasi untuk status booking berubah
- ✅ Mark as read functionality

## 🛠️ Tech Stack

- **Frontend**: React 19, TailwindCSS, React Router DOM
- **Backend**: Supabase (Auth, Database, Realtime)
- **UI Components**: Lucide React Icons
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Form Handling**: React Hook Form

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

## 🚀 Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd P-Booking
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase

#### 3.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down your project URL and anon key

#### 3.2 Setup Database
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `database_schema.sql`
3. Run the SQL script

#### 3.3 Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Create Admin User
1. Register a new user through the app
2. Go to Supabase Dashboard > Authentication > Users
3. Find your user and copy the UUID
4. Go to SQL Editor and run:
```sql
UPDATE public.users 
SET role = 'admin', status = 'active' 
WHERE id = 'your-user-uuid';
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
├── context/            # React Context providers
├── data/               # Static data files
├── layouts/            # Layout components
├── pages/              # Page components
├── routes/             # Route guards
├── services/           # API service functions
└── style/              # CSS files
```

## 🔧 API Services

### Auth API (`src/services/authAPI.js`)
- User management functions
- Approve/reject users
- Get user profiles

### Court API (`src/services/courtAPI.js`)
- CRUD operations for courts
- Upload court images
- Get active courts

### Booking API (`src/services/bookingAPI.js`)
- Create and manage bookings
- Check availability
- Update booking status

### Notification API (`src/services/notificationAPI.js`)
- Create notifications
- Mark as read
- Get user notifications

## 🔐 Authentication Flow

1. **Registration**: User registers → Status: "inactive"
2. **Admin Approval**: Admin approves user → Status: "active"
3. **Login**: Only active users can login
4. **Booking**: Only active users can make bookings

## 📊 Database Schema

### Tables
- `users`: User profiles and status
- `courts`: Court information and status
- `bookings`: Booking records
- `notifications`: User notifications

### Key Relationships
- Users can have multiple bookings
- Courts can have multiple bookings
- Notifications are linked to users and bookings

## 🎨 UI Components

### Admin Pages
- `/admin/users` - Manage user approvals
- `/admin/courts` - Manage courts
- `/admin/bookings` - Review and approve bookings

### User Pages
- `/booking` - Make new bookings
- `/dashboard` - User dashboard
- `/booking-history` - View booking history

## 🔔 Notifications

The system uses Supabase Realtime to provide instant notifications:
- Booking status changes
- User approval notifications
- System announcements

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Set environment variables
3. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Updates

Stay updated with the latest changes:
- Watch the repository
- Check the releases page
- Follow the changelog

---

**Happy Coding! 🎉**
