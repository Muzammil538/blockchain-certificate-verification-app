import hashlib
import json
from datetime import datetime
import os

class Block:
    def __init__(self, index, timestamp, data, file_hash, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data  # Certificate metadata
        self.file_hash = file_hash  # Hash of the certificate file
        self.previous_hash = previous_hash
        self.current_hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": str(self.timestamp),
            "data": self.data,
            "file_hash": self.file_hash,
            "previous_hash": self.previous_hash
        }, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": str(self.timestamp),
            "data": self.data,
            "file_hash": self.file_hash,
            "previous_hash": self.previous_hash,
            "current_hash": self.current_hash
        }

class Blockchain:
    def __init__(self):
        self.chain = []
        self.initialize_chain()

    def initialize_chain(self):
        if os.path.exists('chain.json') and os.path.getsize('chain.json') > 0:
            self.load_chain()
        else:
            self.create_genesis_block()

    def create_genesis_block(self):
        genesis_block = Block(
            index=0,
            timestamp=datetime.now(),
            data={"name": "Genesis Block", "issued_by": "System"},
            file_hash="0",
            previous_hash="0"
        )
        self.chain.append(genesis_block)
        self.save_chain()

    def add_block(self, data, file_hash):
        previous_block = self.chain[-1]
        new_block = Block(
            index=len(self.chain),
            timestamp=datetime.now(),
            data=data,
            file_hash=file_hash,
            previous_hash=previous_block.current_hash
        )
        self.chain.append(new_block)
        self.save_chain()
        return new_block

    def is_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            if current_block.current_hash != current_block.calculate_hash():
                return False

            if current_block.previous_hash != previous_block.current_hash:
                return False

        return True

    def find_certificate(self, file_hash):
        for block in self.chain[1:]:  # Skip genesis block
            if block.file_hash == file_hash:
                return block
        return None

    def save_chain(self):
        with open('chain.json', 'w') as f:
            chain_data = [block.to_dict() for block in self.chain]
            json.dump(chain_data, f, indent=4)

    def load_chain(self):
        with open('chain.json', 'r') as f:
            chain_data = json.load(f)
            self.chain = []
            for block_data in chain_data:
                block = Block(
                    index=block_data['index'],
                    timestamp=datetime.strptime(block_data['timestamp'], "%Y-%m-%d %H:%M:%S.%f"),
                    data=block_data['data'],
                    file_hash=block_data['file_hash'],
                    previous_hash=block_data['previous_hash']
                )
                # Ensure the loaded hash matches
                if block.current_hash != block_data['current_hash']:
                    raise ValueError("Blockchain integrity compromised")
                self.chain.append(block)

def calculate_file_hash(file_path):
    sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        while chunk := f.read(4096):
            sha256.update(chunk)
    return sha256.hexdigest()