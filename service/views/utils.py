import requests
import base64

def get_changes(commit_info):
    files_changes = []
    if len(commit_info["files"]) > 0:
        for file_info in commit_info["files"]:
            changed_blocks = []
            current_block = []
            file_blocks = []
            if (file_info["status"] == "modified" or file_info["status"] == "added") and file_info["additions"] > 2:
                file_content = get_full_file(file_info["contents_url"])
                file_blocks.append(file_content)
                patch = file_info["patch"]
                lines = patch.split("\n")
                for line in lines:
                    if line.startswith("@@") and current_block:
                        changed_blocks.append(current_block)
                        current_block = []
                    elif line.startswith("+"):
                        current_block.append(line[1:])
                if current_block:
                    changed_blocks.append(current_block)

                for change_block in changed_blocks:
                    changed_part = "\n".join(change_block)
                    file_blocks.append(changed_part)
                files_changes.append({file_info["filename"]: file_blocks})
    return files_changes

def get_full_file(contents_url):
    headers = {}
    r = requests.get(contents_url, headers=headers)
    r.raise_for_status()
    data = r.json()
    file_content = data['content']
    file_content_encoding = data.get('encoding')
    if file_content_encoding == 'base64':
        file_content = base64.b64decode(file_content).decode()
    return file_content