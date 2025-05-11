from flask import Flask, render_template, request, redirect, url_for, flash
import os
from werkzeug.utils import secure_filename
from blockchain import Blockchain, calculate_file_hash
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'supersecretkey'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'}

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

blockchain = Blockchain()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        
        file = request.files['file']
        
        # If user does not select file, browser also submits an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Get certificate metadata from form
            certificate_data = {
                "name": request.form.get('name'),
                "issued_to": request.form.get('issued_to'),
                "issued_by": request.form.get('issued_by'),
                "issue_date": request.form.get('issue_date'),
                "course": request.form.get('course'),
                "description": request.form.get('description')
            }
            
            # Calculate file hash and add to blockchain
            file_hash = calculate_file_hash(filepath)
            blockchain.add_block(certificate_data, file_hash)
            
            flash('Certificate successfully uploaded and added to the blockchain!')
            return redirect(url_for('certificates'))
    
    return render_template('upload.html')

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
            # Save the file temporarily to calculate its hash
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], 'temp_verify')
            file.save(temp_path)
            file_hash = calculate_file_hash(temp_path)
            os.remove(temp_path)
            
            # Check if the hash exists in the blockchain
            certificate = blockchain.find_certificate(file_hash)
            
            if certificate:
                flash('Certificate is valid and exists in the blockchain!', 'success')
                return render_template('verify.html', 
                                    found=True, 
                                    certificate=certificate)
            else:
                flash('Certificate not found in the blockchain!', 'error')
    
    return render_template('verify.html', found=False)

@app.route('/certificates')
def certificates():
    # Skip the genesis block
    certificates = blockchain.chain[1:]
    return render_template('certificates.html', certificates=certificates)

if __name__ == '__main__':
    app.run(debug=True)