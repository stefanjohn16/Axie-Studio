# TWA Project Setup with Bubblewrap

## Instructions: Initialize and Build a TWA Project with Bubblewrap

### 1. Install Bubblewrap (if not already installed)
```bash
npm install -g @bubblewrap/cli
```

### 2. Initialize the TWA Project
Replace `https://YOUR_PWA_URL/manifest.json` with the URL to your PWA's manifest file:
```bash
bubblewrap init --manifest https://YOUR_PWA_URL/manifest.json
```
Follow the prompts to complete initialization.

### 3. Update Bubblewrap Version and App Name (Optional)
To update the version or name, use:
```bash
bubblewrap update --version <NEW_VERSION>
bubblewrap update --name "<NEW_APP_NAME>"
```

### 4. Build the TWA APK
```bash
bubblewrap build