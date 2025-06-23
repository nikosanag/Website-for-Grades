import sys
import os
import socket
import subprocess
import re

# ✅ Hardcoded target string to search for
TARGET = 'localhost'

# ✅ Files you want to scan and modify
file_paths = [
    '../login-service/server.js',
    '../user-management-service/server.js',
    '../reviews/server.js',
    '../grade-service/server.js',
    '../database-syncing-service/server.js',
    '../microservice02-frontend-nextjs/src/app/lib/auth.ts',
    '../microservice02-frontend-nextjs/src/app/ui/nav/TopNav.tsx',
    '../microservice02-frontend-nextjs/src/app/dashboard/representative/page.tsx',
    '../microservice02-frontend-nextjs/src/app/dashboard/instructor/page.tsx',
    '../microservice02-frontend-nextjs/src/app/dashboard/instructor/stats/page.tsx',
    '../microservice02-frontend-nextjs/src/app/dashboard/instructor/review-requests/page.tsx',
    '../microservice02-frontend-nextjs/src/app/dashboard/instructor/reply-reviews/page.tsx',
    '../microservice02-frontend-nextjs/src/app/dashboard/instructor/post-initial/page.tsx',
    '../microservice02-frontend-nextjs/src/app/dashboard/instructor/post-final/page.tsx',
    '../microservice02-frontend-nextjs/src/app/dashboard/student/page.tsx',
    '../microservice02-frontend-nextjs/src/app/dashboard/student/courses/page.tsx',
    './utils/upload_users.py',
    './utils/upload_grades.py'
]



def get_local_ip():
    """Get a valid non-loopback, non-link-local IP from active interfaces."""
    try:
        result = subprocess.run(["ip", "a"], stdout=subprocess.PIPE, text=True)
        # Find all IPv4 addresses (skip 127.0.0.1 and 169.254.x.x)
        ips = re.findall(r"inet (\d+\.\d+\.\d+\.\d+)", result.stdout)
        for ip in ips:
            if not (ip.startswith("127.") or ip.startswith("169.254.")):
                return ip
    except Exception as e:
        print(f"Error retrieving IP: {e}")
        return "localhost"
    return "localhost"

def replace_in_file(file_path, replacement):
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    if TARGET not in content:
        print(f"ℹ️ No occurrences of '{TARGET}' in: {file_path}")
        return

    updated_content = content.replace(TARGET, replacement)

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(updated_content)

    print(f"✅ Replaced '{TARGET}' with '{replacement}' in: {file_path}")

if __name__ == '__main__':
    replacement_value = get_local_ip()

    for path in file_paths:
        replace_in_file(path, replacement_value)
