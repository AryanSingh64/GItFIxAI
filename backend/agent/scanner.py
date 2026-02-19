import os
import subprocess

def scan_repository(repo_path: str):
    """
    Runs static analysis tools (flake8 for Python) and parses output.
    Returns standard issue format.
    """
    issues = []
    
    # 1. Run Flake8 (Python Linting)
    try:
        result = subprocess.run(
            ['flake8', '.', '--format=default'], 
            capture_output=True, text=True, cwd=repo_path
        )
        
        # Parse Flake8 Output: path/to/file:line:col: error_code message
        for line in result.stdout.splitlines():
            if not line.strip(): continue
            parts = line.split(':')
            if len(parts) >= 4:
                file_path = parts[0]
                line_num = int(parts[1])
                message = ':'.join(parts[3:]).strip()
                
                # Categorize
                issue_type = "LINTING"
                if "E999" in message or "SyntaxError" in message:
                    issue_type = "SYNTAX"
                elif "F401" in message: # Unused import
                     issue_type = "LINTING"
                elif "F821" in message: # Undefined name
                     issue_type = "LOGIC" # Interpreted as logic error
                
                issues.append({
                    "file": file_path,
                    "type": issue_type,
                    "line": line_num,
                    "message": message,
                    "raw": line
                })

    except Exception as e:
        print(f"Scanner Error: {e}")
        
    # TODO: Add Node.js Scanner here (ESLint)
    
    return issues
