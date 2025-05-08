export default function CertificateCard({ id, recipientName, courseName, issueDate }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{courseName}</h3>
        <p className="text-gray-600 mb-3">Issued to: {recipientName}</p>
        <p className="text-sm text-gray-500">Issued on: {new Date(issueDate * 1000).toLocaleDateString()}</p>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <p className="text-xs font-mono text-gray-500 truncate">ID: {id}</p>
      </div>
    </div>
  )
}