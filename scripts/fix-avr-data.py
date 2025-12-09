#!/usr/bin/env python3
"""
Script to fix AVR template data:
1. Move text from DESCRIPTION to REQUIRED for all data rows (except headers)
2. Keep DESCRIPTION empty for data rows
3. Ensure proposedGuaranteed is "Harus diisi oleh vendor"
"""

import re

# Read the file
with open('prisma/avr-template-data.cjs', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match data rows (not headers)
# Headers have: { id: "X.X-0", description: "..." }
# Data rows have: { id: "X.X-N", description: "...", unit: "...", required: "...", ... }

# Find all lines with data rows (have unit, required, proposedGuaranteed, remarks)
lines = content.split('\n')
new_lines = []

for line in lines:
    # Skip if it's a comment or header row (ends with -0)
    if line.strip().startswith('//') or '-0"' in line:
        new_lines.append(line)
        continue
    
    # Check if it's a data row (has unit, required, proposedGuaranteed, remarks)
    if 'unit:' in line and 'required:' in line and 'proposedGuaranteed:' in line:
        # Extract the description value
        desc_match = re.search(r'description:\s*"([^"]*)"', line)
        req_match = re.search(r'required:\s*"([^"]*)"', line)
        
        if desc_match and req_match:
            desc_value = desc_match.group(1)
            req_value = req_match.group(1)
            
            # If description is not empty and required is simple (Yes, No, or number)
            # Move description to required
            if desc_value and req_value in ['Yes', 'No'] or req_value.isdigit():
                # Replace description with empty string
                line = line.replace(f'description: "{desc_value}"', 'description: ""')
                # Replace required with description value
                line = line.replace(f'required: "{req_value}"', f'required: "{desc_value}"')
        
        # Ensure proposedGuaranteed is "Harus diisi oleh vendor"
        line = re.sub(r'proposedGuaranteed:\s*""', 'proposedGuaranteed: "Harus diisi oleh vendor"', line)
    
    new_lines.append(line)

# Write back
with open('prisma/avr-template-data.cjs', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("✅ AVR template data fixed!")
print("- Moved text from DESCRIPTION to REQUIRED for data rows")
print("- Set proposedGuaranteed to 'Harus diisi oleh vendor'")
