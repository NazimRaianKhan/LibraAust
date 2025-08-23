const DEPTS = ['CSE','EEE','MPE','Textile','Arch','Civil']

export default function Filters({ department, onDepartmentChange }){
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-600">Department</label>
      <select 
        className="px-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        value={department} 
        onChange={e=>onDepartmentChange(e.target.value)}
      >
        <option value="">All</option>
        {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  )
}
