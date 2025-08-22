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

  // Ambil data
  const fetchData = () => {
    fetch('http://localhost:3000/school')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }

  useEffect(fetchData, [])

  // Handle input
  const Change = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Tambah data
  const Tambah = e => {
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

  // Hapus data
  const Delete = kode => {
    fetch(`http://localhost:3000/school/${kode}`, { method: 'DELETE' })
      .then(() => fetchData())
      .catch(console.error)
  }

  // Edit data
  const Edit = school => {
    setEditKode(school.kode)
    setForm(school)
  }

  // Update data
  const Update = e => {
  e.preventDefault()
  console.log('Update:', editKode, form) // Debug log
  fetch(`http://localhost:3000/school/${editKode}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  })
    .then(res => res.json())
    .then((result) => {
      console.log(result) // Debug log
      fetchData()
      setEditKode(null)
      setForm({ kode: '', nama_siswa: '', alamat: '', tgl_siswa: '', jurusan_siswa: '' })
    })
    .catch(console.error)
}

  return (
    <div>
      <h1>Data Siswa</h1>
      <form onSubmit={editKode ? Update : Tambah}>
        <input name="kode" placeholder="Kode" value={form.kode} onChange={Change} required disabled={!!editKode} />
        <input name="nama_siswa" placeholder="Nama" value={form.nama_siswa} onChange={Change} required />
        <input name="alamat" placeholder="Alamat" value={form.alamat} onChange={Change} required />
        <input name="tgl_siswa" placeholder="Tanggal" value={form.tgl_siswa} onChange={Change} required />
        <input name="jurusan_siswa" placeholder="Jurusan" value={form.jurusan_siswa} onChange={Change} required />
        <button type="submit">{editKode ? 'Update' : 'Tambah'}</button>
        {editKode && <button type="button" onClick={() => { setEditKode(null); setForm({ kode: '', nama_siswa: '', alamat: '', tgl_siswa: '', jurusan_siswa: '' }) }}>Batal</button>}
      </form>
      <ul>
        {data.map(school => (
          <li key={school.kode}>
            {school.nama_siswa} - {school.alamat} - {school.jurusan_siswa}
            <button onClick={() => Edit(school)}>Edit</button>
            <button onClick={() => Delete(school.kode)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App