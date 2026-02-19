import os

def fix_issue(repo_path: str, issue: dict):
    """
    Simple Heuristic Fixer (for Demo).
    In a real agent, this would call an LLM.
    """
    file_full_path = os.path.join(repo_path, issue['file'])
    
    try:
        with open(file_full_path, 'r') as f:
            lines = f.readlines()
            
        line_idx = issue['line'] - 1  # 0-indexed
        
        # HEURISTIC 1: Unused Import (F401)
        if "F401" in issue['raw'] or "unused import" in issue['message'].lower():
            # Comment out the line
            lines[line_idx] = f"# {lines[line_idx]}"
            
        # HEURISTIC 2: Missing Colon (E999 / Syntax)
        elif "syntax" in issue['message'].lower() and ":" not in lines[line_idx]:
             lines[line_idx] = lines[line_idx].rstrip() + ":\n"

        # Write Back
        with open(file_full_path, 'w') as f:
            f.writelines(lines)
            
        return {"status": "fixed"}
        
    except Exception as e:
        return {"status": "failed", "error": str(e)}
