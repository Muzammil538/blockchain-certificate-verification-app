// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateRegistry {
    struct Certificate {
        string studentName;
        string courseName;
        string ipfsHash;
        uint256 date;
    }

    Certificate[] private certificates;

    event CertificateAdded(
        uint256 indexed certificateId,
        string indexed studentName,
        string courseName,
        string indexed ipfsHash,
        uint256 date
    );

    function addCertificate(
        string memory _studentName,
        string memory _courseName,
        string memory _ipfsHash,
        uint256 _date
    ) public {
        certificates.push(
            Certificate({
                studentName: _studentName,
                courseName: _courseName,
                ipfsHash: _ipfsHash,
                date: _date
            })
        );

        emit CertificateAdded(
            certificates.length - 1,
            _studentName,
            _courseName,
            _ipfsHash,
            _date
        );
    }

    function getCertificate(uint256 _index)
        public
        view
        returns (
            string memory studentName,
            string memory courseName,
            string memory ipfsHash,
            uint256 date
        )
    {
        require(_index < certificates.length, "Certificate does not exist");
        Certificate memory cert = certificates[_index];
        return (cert.studentName, cert.courseName, cert.ipfsHash, cert.date);
    }

    function getTotalCertificates() public view returns (uint256) {
        return certificates.length;
    }
}
