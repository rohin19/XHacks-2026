# Mapping of neighborhood names to Supabase UUIDs
$neighborhoodMap = @{
    "Arbutus Ridge" = "70d56dcd-bea0-49ee-8199-fd0dfc1a175a"
    "Grandview-Woodland" = "cc721002-78c8-4df3-a694-74ea97a00025"
    "Killarney" = "8f00e00b-c49c-41c2-ac5d-ab605b2e0867"
    "Strathcona" = "d6e274c8-f29a-4b67-8327-5b491da8a0c4"
    "Sunset" = "cfdda5d6-7f9f-48c8-9ed2-1378033edd8b"
    "Hastings-Sunrise" = "3e901128-0faf-41ac-8b31-7118f27a0755"
    "Kerrisdale" = "35129819-4750-47c4-8877-d69205c0353d"
    "Downtown" = "31425b0d-4af7-4440-9b09-f818ff7f9ea9"
    "South Cambie" = "9ade8fec-191d-4ec9-b078-b06f57ded6e5"
    "Riley Park" = "52e5217c-b7a3-4820-9b58-a2584a23e59e"
    "Shaughnessy" = "a3d75376-827c-475e-b10b-f58798cc5fc8"
    "Victoria-Fraserview" = "e8316132-daf8-432f-9913-9930ff471467"
    "West Point Grey" = "e6bd8b6a-3f2a-4655-b78a-8029f50afc35"
    "Mount Pleasant" = "65aa5f51-0a3d-4e88-be8c-b16657a12cb7"
    "Renfrew-Collingwood" = "8d2ce78f-6db8-4eaa-8bc8-d338bc587d88"
    "West End" = "c1ef21a7-0703-4972-961b-3143cf9850c1"
    "Marpole" = "c6aaaf9d-5850-41bb-b41b-e296e483b818"
    "Oakridge" = "1ec15be7-1ea0-4967-b593-48ebe92ede5e"
    "Dunbar-Southlands" = "6e9bca91-96be-4901-af15-6d27ed823ae4"
    "Fairview" = "e8dff65e-7ac4-4fc5-8f31-fe1b85fe7bf0"
    "Kensington-Cedar Cottage" = "53fb5817-04d2-4d8c-b582-110f56bc7022"
    "Kitsilano" = "973668ef-b530-4019-a000-b9940b2e72b2"
}

# Read the file
$file = "app\lib\neighborhoods.ts"
$content = Get-Content $file -Raw

# Replace each ID
foreach ($name in $neighborhoodMap.Keys) {
    $uuid = $neighborhoodMap[$name]
    # Match pattern: name: "NeighborhoodName",
    # Look for the line before it with id:
    $content = $content -replace "name: `"$name`",", "name: `"$name`","
}

Write-Host "Neighborhood UUIDs from Supabase:"
$neighborhoodMap | ConvertTo-Json
