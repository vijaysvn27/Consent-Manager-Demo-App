import { useDemo } from '../../store/store'

export default function DAMView() {
  const { state } = useDemo()
  const world = state.world!
  const { dataAssets, company, customer } = world

  return (
    <div className="h-full flex flex-col bg-gray-50 text-sm overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">DA</div>
          <span className="font-semibold text-gray-900">Data Asset Manager — {company.shortName}</span>
        </div>
        <span className="text-xs text-gray-400">{dataAssets.length} assets catalogued</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Assets', value: dataAssets.length },
            { label: 'Critical', value: dataAssets.filter(a => a.dataSensitivity === 'Critical').length },
            { label: 'Public Exposure', value: dataAssets.filter(a => a.exposure === 'Public').length },
            { label: 'With Issues', value: dataAssets.filter(a => a.issues.length > 0).length },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Data catalog table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Data Catalog</h3>
          </div>
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Asset Name', 'Sensitivity', 'Tags', 'Exposure', 'Cloud', 'Size', 'Risk Score'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dataAssets.map(asset => (
                <tr key={asset.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-mono font-semibold text-gray-900">{asset.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      asset.dataSensitivity === 'Critical' ? 'bg-red-100 text-red-700' :
                      asset.dataSensitivity === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{asset.dataSensitivity}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {asset.tags.map(tag => (
                        <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${asset.exposure === 'Public' ? 'text-red-600' : 'text-gray-600'}`}>
                      {asset.exposure === 'Public' && '⚠️ '}{asset.exposure}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{asset.cloudProvider}</td>
                  <td className="px-4 py-3 text-gray-500">{asset.sizeGB}GB</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-sm ${
                      asset.riskScore >= 80 ? 'text-red-600' :
                      asset.riskScore >= 60 ? 'text-orange-500' :
                      'text-green-600'
                    }`}>{asset.riskScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Customer data lineage */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{customer.name} — Data Lineage</h3>
          <div className="flex items-center gap-3 flex-wrap">
            {dataAssets.map((asset, i) => (
              <div key={asset.id} className="flex items-center gap-2">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 text-xs font-mono text-indigo-700">{asset.name}</div>
                {i < dataAssets.length - 1 && <span className="text-gray-400 text-xs">→</span>}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Data flows across {dataAssets.length} assets. Consent withdrawal triggers deletion across all linked stores.</p>
        </div>
      </div>
    </div>
  )
}
