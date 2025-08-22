import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState([])
  const [form, setForm] = useState({
    kode: '',
    nama_siswa: '',
    alamat: '',
    tgl_siswa: '',
    jurusan_siswa: ''
  })
  const [editKode, setEditKode] = useState(null)

  // Ambil data dari backend
  const fetchData = () => {
    fetch('http://localhost:3000/school')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }

  useEffect(fetchData, [])

  // Handle input form
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Create data
  const create = e => {
    e.preventDefault()
    fetch('http://localhost:3000/school', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        fetchData()
        setForm({ kode: '', nama_siswa: '', alamat: '', tgl_siswa: '', jurusan_siswa: '' })
      })
      .catch(console.error)
  }

  // Delete data
  const deleteData = kode => {
    fetch(`http://localhost:3000/school/${kode}`, { method: 'DELETE' })
      .then(() => fetchData())
      .catch(console.error)
  }

  // Edit data
  const edit = siswa => {
  setEditKode(siswa.kode)
  setForm({
    kode: siswa.kode,
    nama_siswa: siswa.nama_siswa,
    alamat: siswa.alamat,
    tgl_siswa: siswa.tgl_siswa,
    jurusan_siswa: siswa.jurusan_siswa
  })
}

  // Update data
  const update = e => {
  e.preventDefault()
  console.log('Update:', editKode, form) // Debug log
  fetch(`http://localhost:3000/school/${editKode}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  })
      .then(res => res.json())
      .then(() => {
        fetchData()
        setEditKode(null)
        setForm({ kode: '', nama_siswa: '', alamat: '', tgl_siswa: '', jurusan_siswa: '' })
      })
      .catch(console.error)
  }

  return (
    <div className="container">
      <h1>Data Siswa</h1>
      <form onSubmit={editKode ? update : create}>
        <input
          name="kode"
          value={form.kode}
          onChange={handleChange}
          placeholder="Kode"
          disabled={!!editKode}
        />
        <input
          name="nama_siswa"
          value={form.nama_siswa}
          onChange={handleChange}
          placeholder="Nama Siswa"
        />
        <input
          name="alamat"
          value={form.alamat}
          onChange={handleChange}
          placeholder="Alamat"
        />
        <input
          name="tgl_siswa"
          type="date"
          value={form.tgl_siswa}
          onChange={handleChange}
        />
        <input
          name="jurusan_siswa"
          value={form.jurusan_siswa}
          onChange={handleChange}
          placeholder="Jurusan Siswa"
        />
        <button type="submit">{editKode ? 'Update' : 'Create'}</button>
      </form>
      <ul>
        {data.map(siswa => (
          <li key={siswa.kode}>
            {siswa.nama_siswa} - {siswa.alamat} - {siswa.jurusan_siswa}
            <button onClick={() => edit(siswa)}>Edit</button>
            <button onClick={() => deleteData(siswa.kode)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App