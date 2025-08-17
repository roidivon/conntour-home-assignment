# Conntour Space Explorer – Home Assignment

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate virtual environment using uv:
   ```bash
   uv venv
   source .venv/bin/activate  # On Unix/MacOS
   # OR
   .venv\Scripts\activate     # On Windows
   ```
3. Install dependencies using uv:
   ```bash
   uv pip install -r requirements.txt
   ```
4. Run the FastAPI server with Uvicorn:
   ```bash
   uvicorn app:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run preview
   ```
   The frontend will run on http://localhost:5173
