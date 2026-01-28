# WhatsNep - Private Chat Application

<p align="center">
  <img src="public/favicon.svg" alt="WhatsNep Logo" width="80" height="80">
</p>

<p align="center">
  <strong>Private messaging, simplified.</strong>
</p>

<p align="center">
  A modern, secure, and beautiful real-time chat application built with React and Supabase.
</p>

---

## ✨ Features

### 🎯 Three Core Pillars

1. **Ease of Use** - Simple sign-up with just username and password
2. **Security** - Auto-logout on browser close, encrypted passwords
3. **Beauty** - Modern dark UI with smooth animations

### 💬 Chat Features

- Real-time direct messaging
- User search to start conversations
- Typing indicators
- Online/offline status
- Message timestamps
- Chat history persistence
- Desktop notifications

### 🔐 Security Features

- Session-based authentication
- Auto-logout when browser closes (unless "Remember me" is enabled)
- Password hashing via Supabase Auth
- Input validation and sanitization
- XSS protection

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) account

### 1. Clone the Repository

```bash
git clone https://github.com/zhafran12382/whatsnepp4.git
cd whatsnepp4
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project on [Supabase](https://app.supabase.com)
2. Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  participant2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_conversations_participants ON conversations(participant1_id, participant2_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Conversations policies
CREATE POLICY "Users can view their conversations" ON conversations FOR SELECT TO authenticated 
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = participant1_id OR auth.uid() = participant2_id);
CREATE POLICY "Users can update their conversations" ON conversations FOR UPDATE TO authenticated 
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT TO authenticated 
  USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
  );
CREATE POLICY "Users can send messages to their conversations" ON messages FOR INSERT TO authenticated 
  WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
  );

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
```

3. Get your Supabase project URL and anon key from Settings > API

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
npm run preview
```

---

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Backend & Auth**: Supabase
- **State Management**: React Context API
- **Icons**: Lucide React
- **Routing**: React Router v7

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   └── ui.jsx        # Button, Input, Card, Avatar, etc.
├── contexts/         # React Context providers
│   ├── AuthContext.jsx   # Authentication state
│   └── ChatContext.jsx   # Chat & messaging state
├── lib/              # Utilities and configurations
│   └── supabase.js   # Supabase client setup
├── pages/            # Page components
│   ├── Landing.jsx   # Welcome page
│   ├── SignUp.jsx    # Registration page
│   ├── Login.jsx     # Login page
│   ├── Chat.jsx      # Main chat dashboard
│   └── Settings.jsx  # User settings
├── App.jsx           # Main app with routing
├── main.jsx          # Entry point
└── index.css         # Global styles
```

---

## 🎨 Design

- **Color Scheme**: Deep purple to cyan gradient on dark background
- **Typography**: Inter font family
- **Effects**: Glass morphism, smooth transitions, micro-interactions
- **Responsive**: Optimized for mobile, tablet, and desktop

---

## 🔒 Security Notes

- Passwords are hashed using Supabase Auth (bcrypt)
- Sessions are managed securely via Supabase
- By default, sessions expire when the browser is closed
- Enable "Remember me" to persist sessions
- All database operations use Row Level Security (RLS)

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
