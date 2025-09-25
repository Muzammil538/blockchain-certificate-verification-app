from flask import Flask, render_template, request, redirect, url_for, flash, session, send_from_directory
import os
import csv
from werkzeug.utils import secure_filename
from blockchain import Blockchain, calculate_file_hash
from datetime import datetime
import uuid

app = Flask(__name__)
app.secret_key = 'supersecretkey'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'}
USERS_CSV = 'users.csv'
PENDING_CSV = 'pending_uploads.csv'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
blockchain = Blockchain()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def get_users():
    users = []
    if os.path.exists(USERS_CSV):
        with open(USERS_CSV, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                users.append(row)
    return users

def save_user(username, password, role):
    file_exists = os.path.isfile(USERS_CSV)
    with open(USERS_CSV, 'a', newline='') as csvfile:
        fieldnames = ['username', 'password', 'role']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow({'username': username, 'password': password, 'role': role})

def find_user(username):
    users = get_users()
    for user in users:
        if user['username'] == username:
            return user
    return None

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        role = 'user'
        if find_user(username):
            flash('Username already exists.')
            return redirect(url_for('register'))
        save_user(username, password, role)
        flash('Registration successful! Please log in.')
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = find_user(username)
        if user and user['password'] == password:
            session['username'] = username
            session['role'] = user['role']
            flash('Logged in successfully!')
            if user['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))
            else:
                return redirect(url_for('user_dashboard'))
        else:
            flash('Invalid credentials.')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully.')
    return redirect(url_for('home'))

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if 'username' not in session or session.get('role') != 'user':
        flash('Please log in as a user to upload documents.')
        return redirect(url_for('login'))
    if request.method == 'POST':
        doc_type = request.form.get('doc_type')
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            file_hash = calculate_file_hash(filepath)
            # Check for duplicate in blockchain
            if blockchain.find_certificate(file_hash):
                flash('This document already exists in the blockchain!', 'error')
                os.remove(filepath)
                return redirect(url_for('user_dashboard'))
            # Save to pending approvals
            with open(PENDING_CSV, 'a', newline='') as csvfile:
                # Use superset of all possible fields
                fieldnames = [
                    'doc_type', 'filename', 'file_hash', 'aadhar', 'holdername',
                    'name', 'issued_to', 'issued_by', 'issue_date', 'course', 'description', 'uploaded_by'
                ]
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                if os.stat(PENDING_CSV).st_size == 0:
                    writer.writeheader()
                if doc_type == 'personal_info':
                    writer.writerow({
                        'doc_type': doc_type,
                        'filename': filename,
                        'file_hash': file_hash,
                        'name': request.form.get('holdername'),  # Name of Holder
                        'issued_to': request.form.get('aadhar'), # Aadhaar Number
                        'issued_by': request.form.get('pan'),    # PAN Number
                        'issue_date': '',                        # Not applicable
                        'course': '',                            # Not applicable
                        'description': '',                       # Not applicable
                        'uploaded_by': str(session.get('username', ''))
                    })
                else:
                    writer.writerow({
                        'doc_type': doc_type,
                        'filename': filename,
                        'file_hash': file_hash,
                        'name': request.form.get('name'),
                        'issued_to': request.form.get('issued_to'),
                        'issued_by': request.form.get('issued_by'),
                        'issue_date': request.form.get('issue_date'),
                        'course': request.form.get('course'),
                        'description': request.form.get('description'),
                        'uploaded_by': str(session.get('username', ''))
                    })
            flash('Document uploaded and pending admin approval.')
            return redirect(url_for('user_dashboard'))
    return render_template('upload.html')

@app.route('/download/<filename>')
def download(filename):
    if 'username' not in session:
        flash('Please log in to download files.')
        return redirect(url_for('login'))
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

@app.route('/user_dashboard')
def user_dashboard():
    if 'username' not in session or session.get('role') != 'user':
        flash('Please log in as a user to view your dashboard.')
        return redirect(url_for('login'))
    user_certificates = [block for block in blockchain.chain[1:] if getattr(block, 'data', {}).get('uploaded_by') == session['username']]
    return render_template('user_dashboard.html', certificates=user_certificates)

@app.route('/verify', methods=['GET', 'POST'])
def verify():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], 'temp_verify')
            file.save(temp_path)
            file_hash = calculate_file_hash(temp_path)
            os.remove(temp_path)
            certificate = blockchain.find_certificate(file_hash)
            if certificate:
                flash('Certificate is valid and exists in the blockchain!', 'success')
                return render_template('verify.html', found=True, certificate=certificate)
            else:
                flash('Certificate not found in the blockchain!', 'error')
    return render_template('verify.html', found=False)

@app.route('/admin_dashboard')
def admin_dashboard():
    if 'username' not in session or session.get('role') != 'admin':
        flash('Admin access required.')
        return redirect(url_for('login'))
    all_certificates = blockchain.chain[1:]
    # Pending approvals
    pending = []
    if os.path.exists(PENDING_CSV):
        with open(PENDING_CSV, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                pending.append(row)
    return render_template('admin_dashboard.html', certificates=all_certificates, pending=pending)

@app.route('/approve/<file_hash>', methods=['POST'])
def approve(file_hash):
    if 'username' not in session or session.get('role') != 'admin':
        flash('Admin access required.')
        return redirect(url_for('login'))
    pending = []
    approved = None
    if os.path.exists(PENDING_CSV):
        with open(PENDING_CSV, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['file_hash'] == file_hash:
                    approved = row
                else:
                    pending.append(row)
    if approved:
        if approved['doc_type'] == 'personal_info':
            data = {
                "doc_type": approved['doc_type'],
                "filename": approved['filename'],
                "name": approved.get('name', ''),
                "issued_to": approved.get('issued_to', ''),
                "issued_by": approved.get('issued_by', ''),
                "issue_date": approved.get('issue_date', ''),
                "course": approved.get('course', ''),
                "description": approved.get('description', ''),
                "uploaded_by": str(approved.get('uploaded_by', ''))
            }
        else:
            data = {
    # The code snippet appears to be a Python dictionary containing key-value pairs. It is extracting
    # values from the `approved` dictionary using the `get` method with default values provided in
    # case the key is not present in the `approved` dictionary. The keys being extracted include
    # 'doc_type', 'filename', 'name', 'issued_to', 'issued_by', 'issue_date', 'course', 'description',
    # and 'uploaded_by'. The extracted values are then used to create a new dictionary.
                "doc_type": approved['doc_type'],
                "filename": approved['filename'],
                "name": approved.get('name', ''),
                "issued_to": approved.get('issued_to', ''),
                "issued_by": approved.get('issued_by', ''),
                "issue_date": approved.get('issue_date', ''),
                "course": approved.get('course', ''),
                "description": approved.get('description', ''),
                "uploaded_by": str(approved.get('uploaded_by', ''))
            }
        blockchain.add_block(data, approved['file_hash'])
        flash('Document approved and added to blockchain!', 'success')
    # Always write headers, even if no rows left
    with open(PENDING_CSV, 'w', newline='') as csvfile:
        fieldnames = [
            'doc_type', 'filename', 'file_hash', 'aadhar', 'holdername',
            'name', 'issued_to', 'issued_by', 'issue_date', 'course', 'description', 'uploaded_by'
        ]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in pending:
            writer.writerow(row)
    return redirect(url_for('admin_dashboard'))

@app.route('/reject/<file_hash>', methods=['POST'])
def reject(file_hash):
    if 'username' not in session or session.get('role') != 'admin':
        flash('Admin access required.')
        return redirect(url_for('login'))
    pending = []
    rejected_file = None
    if os.path.exists(PENDING_CSV):
        with open(PENDING_CSV, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row['file_hash'] == file_hash:
                    rejected_file = row['filename']
                else:
                    pending.append(row)
    if rejected_file:
        try:
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], rejected_file))
        except Exception:
            pass
    # Always write headers, even if no rows left
    with open(PENDING_CSV, 'w', newline='') as csvfile:
        fieldnames = [
            'doc_type', 'filename', 'file_hash', 'aadhar', 'holdername',
            'name', 'issued_to', 'issued_by', 'issue_date', 'course', 'description', 'uploaded_by'
        ]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in pending:
            writer.writerow(row)
    flash('Document rejected and file deleted.', 'success')
    return redirect(url_for('admin_dashboard'))

@app.route('/certificates')
def certificates():
    if 'username' not in session:
        flash('Please log in to view certificates.')
        return redirect(url_for('login'))
    if session.get('role') == 'admin':
        certificates = blockchain.chain[1:]
    else:
        certificates = [block for block in blockchain.chain[1:] if getattr(block, 'data', {}).get('uploaded_by') == session['username']]
    return render_template('certificates.html', certificates=certificates)

if __name__ == '__main__':
    app.run(debug=True)