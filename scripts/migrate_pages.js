const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function migrateLanding() {
  const target = 'app/page.jsx';
  ensureDir(target);
  let content = fs.readFileSync('frontend/src/pages/Landing.jsx', 'utf8');
  content = `'use client';\n` + content;
  content = content.replace(/import\s*\{\s*useNavigate\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import { useRouter } from 'next/navigation';");
  content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);/g, "const router = useRouter();");
  content = content.replace(/navigate\(/g, "router.push(");
  content = content.replace(/\.\.\/components\/AnimatedIcons/g, '@/components/AnimatedIcons');
  fs.writeFileSync(target, content);
  console.log('Migrated Landing -> app/page.jsx');
}

function migrateDocs() {
  const target = 'app/docs/page.jsx';
  ensureDir(target);
  let content = fs.readFileSync('frontend/src/pages/Docs.jsx', 'utf8');
  content = `'use client';\n` + content;
  content = content.replace(/import\s*\{\s*useNavigate\s*\}\s*from\s*['"]react-router-dom['"];?/g, "import { useRouter } from 'next/navigation';\nimport Navbar from '@/components/Navbar';");
  content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);/g, "const router = useRouter();");
  content = content.replace(/navigate\(/g, "router.push(");
  content = content.replace(/VITE_SUPABASE_URL/g, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  content = content.replace(/VITE_SUPABASE_ANON_KEY/g, 'NEXT_PUBLIC_FIREBASE_API_KEY');
  fs.writeFileSync(target, content);
  console.log('Migrated Docs -> app/docs/page.jsx');
}

migrateLanding();
migrateDocs();
