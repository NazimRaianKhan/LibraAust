export default function SearchBar({ value, onChange, onSubmit, placeholder='Search...' }) {
  return (
    <form 
      onSubmit={(e)=>{e.preventDefault(); onSubmit?.()}} 
      className="flex w-full md:w-auto items-center gap-2"
    >
      <input 
        className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
      />
      <button 
        className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
        type="submit"
      >
        Search
      </button>
    </form>
  )
}
