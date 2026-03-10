from main import app

# Vercel needs "app" exposed as "app" in index.py
# This assumes main.py is in the parent directory "backend"
# You might need to adjust imports if main.py is in backend/ and this file is backend/api/
# Actually, relative imports are tricky on Vercel sometimes.
# It's safer to move main.py logic here or ensure sys.path is correct.

import sys
import os

# Add parent directory to path so we can import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

# This is all that's needed for Vercel
# Vercel automatically detects the 'app' variable.
