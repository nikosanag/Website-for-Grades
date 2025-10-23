import os
import sys
import subprocess
import re

# This script reverts changes made by `move_to_local_network.py`.
# It finds occurrences of the current machine's local IP address in specified files
# and replaces them back to 'localhost'.


def get_local_ip():
    """Get a valid non-loopback, non-link-local IPv4 address from active interfaces.
    Fallback to 'localhost' if nothing appropriate is found."""
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


def replace_in_file(file_path: str, target: str, replacement: str) -> None:
    """Replace all occurrences of `target` with `replacement` in a file.

    - Prints a message if the file doesn't exist or if there are no occurrences.
    - Overwrites the file in-place when replacements are made.
    """
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if target not in content:
        print(f"ℹ️ No occurrences of '{target}' in: {file_path}")
        return

    updated_content = content.replace(target, replacement)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print(f"✅ Replaced '{target}' with '{replacement}' in: {file_path}")


# Files to scan and modify (mirrors move_to_local_network.py)
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
    './utils/upload_grades.py',
]


if __name__ == '__main__':
    # Allow overriding the detected IP via CLI arg or env var
    # Usage: python move_to_localhost.py 192.168.1.10
    # Or set REVERT_IP=192.168.1.10
    if len(sys.argv) > 1 and sys.argv[1] not in ("-h", "--help"):
        target_ip = sys.argv[1]
    elif os.getenv("REVERT_IP"):
        target_ip = os.environ["REVERT_IP"]
    else:
        target_ip = get_local_ip()

    if len(sys.argv) > 1 and sys.argv[1] in ("-h", "--help"):
        print("Usage: python move_to_localhost.py [IP]\n\n"
              "If IP is omitted, the script will try to detect the local IP automatically.\n"
              "You can also set REVERT_IP environment variable.")
        sys.exit(0)

    target = target_ip
    replacement = 'localhost'

    print(f"🔄 Reverting references from '{target}' back to '{replacement}'...")
    for path in file_paths:
        replace_in_file(path, target, replacement)
