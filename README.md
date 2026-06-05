# Laundrify
# 1. Clone repository
git clone https://github.com/yourusername/laundry-system.git
cd laundry-system

# 2. Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Environment variables (.env file)
cat > .env << EOF
SECRET_KEY=your-super-secret-key-change-this
DEBUG=True
DB_NAME=laundry_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
REDIS_URL=redis://localhost:6379
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
EOF

# 4. Database setup
python manage.py migrate
python manage.py createsuperuser

# 5. Run backend
python manage.py runserver  # API on :8000
# In another terminal: celery -A config worker -l info
# In another: celery -A config beat -l info

# 6. Frontend setup (Customer App)
cd ../frontend-customer
npm install
npm run dev  # Runs on :3000

# 7. Driver App (in another terminal)
cd ../frontend-driver
npm install
npm run dev  # Runs on :3001

# 8. Admin Dashboard
cd ../frontend-admin
npm install
npm run dev  # Runs on :3002
