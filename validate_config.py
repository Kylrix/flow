import json
import sys

try:
    with open('/home/nathfavour/code/whisperrnote/whisperrtask/appwrite.config.json', 'r') as f:
        data = json.load(f)
except json.JSONDecodeError as e:
    print(f"JSON Decode Error: {e}")
    sys.exit(1)

def check_arrays(collection, name):
    for i, item in enumerate(collection):
        table_name = item.get('name', 'Unknown')
        table_id = item.get('$id', 'Unknown')
        
        for prop in ['columns', 'indexes', '$permissions']:
            if prop not in item:
                 print(f"Warning: Table '{table_name}' ({table_id}) is missing '{prop}'.")

print("Checking tables for missing array properties...")
check_arrays(data.get('tables', []), 'tables')
print("Done.")
