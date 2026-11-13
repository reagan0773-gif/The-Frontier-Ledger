# The Frontier Ledger: iPhone app

This folder is a complete app project. Codemagic turns it into an iPhone app and sends it to TestFlight; from there you submit it to the App Store.

**How it works:** the app is the same ledger page you already use, packed inside an iPhone app with a copy of your records (`www/data.json`). It works offline, and nobody needs a claude.ai account to use it. It's read-only: you keep editing in your working ledger on claude.ai, then send a fresh `data.json` when you want to update the app.

---

## Step 1: Get your data file

1. Open your **working ledger** on claude.ai.
2. Scroll to the very bottom and click **Download data file (for the app)**.
3. Save `data.json` somewhere you can find it.

## Step 2: Put the project on GitHub

1. On github.com, click **New repository**. Name it `frontier-ledger-app`. **Private** is fine. Don't add a README (this folder has one).
2. On the new repo's page, click **uploading an existing file**.
3. Drag in **everything inside this folder** (`assets`, `scripts`, `www`, `codemagic.yaml`, `capacitor.config.json`, `package.json`, `README.md`, `.gitignore`). Keep the folders as they are.
4. Open the `www` folder in the repo, click **Add file → Upload files**, and upload your `data.json`.
5. Commit to the `main` branch.

> `.gitignore` starts with a dot and can be hidden on a Mac. Press Cmd+Shift+. in Finder to show it. If it doesn't upload, that's okay.

## Step 3: Set up the app with Apple

**A. Register the app's ID**
1. Go to developer.apple.com → **Certificates, IDs & Profiles** → **Identifiers** → **+**.
2. Choose **App IDs → App**. Description: `Frontier Ledger`. Bundle ID (Explicit): something like `com.yourname.frontierledger`. **Write this down. It must match exactly in Step 4.**
3. No extra capabilities are needed. Click **Register**.

**B. Create the App Store listing**
1. Go to appstoreconnect.apple.com → **Apps** → **+** → **New App**.
2. Platform: iOS. Name: `Frontier Ledger` (if it's taken, try `The Frontier Ledger` or `Frontier Ledger: Old West`). Language: English. Bundle ID: pick the one from A. SKU: `frontierledger1`.
3. When it's created, open **App Information** and copy the **Apple ID** number (about 10 digits).

**C. Make an App Store Connect API key (this lets Codemagic sign and upload)**
1. App Store Connect → **Users and Access** → **Integrations** → **App Store Connect API** → **Team Keys** → **+**.
2. Name: `Codemagic`. Access: **App Manager**. Generate.
3. Note the **Issuer ID** and **Key ID**, and **download the .p8 file**. Apple only lets you download it once.

## Step 4: Fill in the CHANGEME values (on GitHub)

Click a file on GitHub, then the pencil icon to edit it:

| File | Change | To |
|---|---|---|
| `capacitor.config.json` | `com.CHANGEME.frontierledger` | your bundle ID from 3A |
| `codemagic.yaml` | `com.CHANGEME.frontierledger` | the same bundle ID |
| `codemagic.yaml` | `0000000000` | the Apple ID number from 3B |
| `codemagic.yaml` | `CHANGEME_API_KEY_NAME` | the name you give the key in Codemagic (Step 5A), e.g. `Frontier Ledger key` |

Commit each change to `main`.

## Step 5: Set up Codemagic

**A. Add the API key**
1. codemagic.io → **Team settings** (or your personal account settings) → **Team integrations** → **Developer Portal** → **Manage keys** → **Add key**.
2. Name it exactly what you put in `codemagic.yaml` (e.g. `Frontier Ledger key`). Paste the Issuer ID and Key ID and upload the .p8 file.

**B. Code signing**
1. Still in team settings, open **codemagic.yaml settings** → **Code signing identities**.
2. **iOS certificates** tab → **Generate certificate** → choose your API key → type **Apple Distribution**. (If you already have a distribution certificate, you can upload its .p12 instead.)
3. **iOS provisioning profiles** tab → **Fetch profiles** → choose your API key and fetch the **App Store** profile for your bundle ID.
   - If no profile shows up, create one at developer.apple.com → **Profiles** → **+** → **App Store Connect** → pick your App ID and the distribution certificate → then fetch again.

**C. Connect the repo and build**
1. Codemagic → **Apps** → **Add application** → **GitHub** → pick `frontier-ledger-app` → choose **codemagic.yaml**.
2. Click **Start new build**, choose the **Frontier Ledger - TestFlight** workflow and branch **main**.
3. It takes about 15–25 minutes. The first step checks that `data.json` is there and prints how many people it found.

If a build fails, open the failed step in Codemagic, copy the red error text, and paste it to Claude.

## Step 6: Try it on your phone (TestFlight)

1. After the build, App Store Connect takes about 10–30 minutes to process it.
2. App Store Connect → your app → **TestFlight** → **Internal Testing** → add yourself as a tester.
3. Install the **TestFlight** app on your iPhone and install Frontier Ledger from it.

## Step 7: Submit to the App Store

In App Store Connect → your app → the **1.0** version page:

- **Screenshots:** iPhone 6.9" screenshots are required (at least one, up to 10). Take them on a recent iPhone from the TestFlight build. The app is set to iPhone-only, so iPad screenshots aren't needed.
- **Description, keywords, support URL:** your public edition link works as the support URL.
- **Privacy policy URL:** required, even though the app collects nothing. Claude can make a simple privacy page for you.
- **App Privacy:** answer **"No, we do not collect data."**
- **Age rating:** the ledger describes historical violence (gunfights, hangings). Answer the questionnaire honestly; expect "Infrequent/Mild Realistic Violence."
- **Category:** Reference (or Education).
- **Build:** pick the TestFlight build, then **Add for Review** → **Submit**.

**Review note:** Apple sometimes rejects apps that look like "just a website." This one has an advantage: all the content is built in and works offline. In the **Notes for Review** box, it helps to say so, e.g. *"An offline reference of 130+ Old West figures, with events, towns, cattle trails, a timeline, a map, a connections graph and On This Day. All content is bundled in the app; no account or network needed."*

## Updating the app later

1. Make your changes in the working ledger as usual.
2. Click **Download data file (for the app)** again.
3. On GitHub, open `www`, click **Add file → Upload files**, upload the new `data.json` (it replaces the old one), and commit to `main`.
4. Codemagic builds automatically on every push to `main` and sends a new build to TestFlight.
5. In App Store Connect, click **+** next to iOS App to make a new version (1.1, 1.2…), pick the new build, and submit.

If the ledger's design changes (new features), Claude will give you a new `www/index.html` to upload the same way.
