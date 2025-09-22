# 📜 Blockchain Certificate Verification System - README 

Welcome to your first blockchain project! This system lets you store and verify certificates using blockchain technology. Don't worry if you're new to programming - this guide will walk you through everything step by step.

## 🌟 What This Project Does

This is a web application that:
- Stores certificates (like diplomas or awards) in a secure blockchain
- Lets you verify if a certificate is genuine by checking its digital fingerprint
- Shows all certificates that have been added

## 🛠️ What You'll Need

Before starting, make sure you have:
1. A computer (Windows, Mac, or Linux)
2. Python installed (version 3.6 or newer)
   - [Download Python](https://www.python.org/downloads/)
3. A text editor (like [VS Code](https://code.visualstudio.com/) or Notepad++)

## 🚀 How to Get Started

### Step 1: Download the Project
1. Click the "Code" button (usually green) and select "Download ZIP"
2. Unzip the folder to a location you'll remember (like your Desktop)

### Step 2: Open Command Prompt/Terminal
- **Windows**: Press `Windows Key + R`, type `cmd`, press Enter
- **Mac**: Open Spotlight (Command+Space), type "Terminal", press Enter

### Step 3: Install Dependencies
Type these commands one at a time, pressing Enter after each:

```bash
pip install flask werkzeug
```

This installs the tools needed to run the project.

### Step 4: Run the Application
Navigate to the project folder in your terminal:
```bash
cd path/to/your/project/folder
```

Then start the application:
```bash
python app.py
```

You should see output like:
```
* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

### Step 5: Open in Your Browser
Open your web browser and visit:
```
http://localhost:5000
```

## 🖥️ Using the Application

### Home Page
- Explains what the system does
- Links to other pages

### Upload Certificate
1. Fill in information about the certificate:
   - Name (e.g., "Computer Science Diploma")
   - Who it's issued to (your name)
   - Who issued it (e.g., "Tech University")
   - Date and other details
2. Select a file (PDF, image, or document)
3. Click "Upload to Blockchain"

### Verify Certificate
1. Upload a certificate file
2. The system will check if it's in the blockchain
3. You'll see if it's valid or not

### View Certificates
- Shows all certificates added to the system
- Displays basic information about each one

##  Debugging and Error handling

1. **If you get errors**:
   - Check you typed commands exactly
   - Make sure you're in the right folder
   - Google the error message - others have probably had the same issue!

2. **To stop the application**:
   - In your terminal, press `CTRL+C`

3. **To make changes**:
   - Edit the files with your text editor
   - Save your changes
   - Restart the application (stop with `CTRL+C` and run `python app.py` again)
