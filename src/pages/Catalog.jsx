import { useState } from 'react'
import GUNS from '../data/guns.js'
import GunCard from '../components/GunCard.jsx'

function Catalog() {
  // 1. State untuk menangani modal checkout
  const [selectedGun, setSelectedGun] = useState(null)
  const [buyerName, setBuyerName] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    setIsSuccess(true)
  }

  const handleClose = () => {
    setSelectedGun(null)
    setBuyerName('')
    setIsSuccess(false)
  }

  return (
    <>
      <section className="masthead">
        <h1 className="display">Hardware, by the spec sheet.</h1>
        <p className="lede">
          A small armory of pistols, rifles, and shotguns. Every piece listed with its
          type, caliber, and price — nothing else.
        </p>
      </section>

      <section>
        <div className="list-head">
          <h2>Current stock</h2>
          <span className="count">{GUNS.length} pieces</span>
        </div>
        <ul className="stock">
          {/* 2. Kirim callback onCheckout ke GunCard */}
          {GUNS.map((gun) => (
            <GunCard 
              key={gun.name} 
              gun={gun} 
              onCheckout={(item) => setSelectedGun(item)} 
            />
          ))}
        </ul>
      </section>

      {/* 3. Modal Formulir Checkout ditaruh di sini */}
      {selectedGun && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '420px',
            width: '100%',
            color: '#18222c',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            {!isSuccess ? (
              <form onSubmit={handleCheckoutSubmit}>
                <h3 style={{ marginTop: 0 }}>Form Checkout</h3>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <strong>Item:</strong> {selectedGun.name} ({selectedGun.type})
                </p>
                <p style={{ margin: '8px 0', fontSize: '15px' }}>
                  <strong>Total Tagihan:</strong> ${selectedGun.price.toLocaleString()}
                </p>
                <div style={{ margin: '14px 0' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Nama Pembeli:</label>
                  <input 
                    type="text" 
                    required 
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Masukkan nama lengkap..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '18px' }}>
                  <button 
                    type="button" 
                    onClick={handleClose}
                    style={{ padding: '8px 14px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    style={{ padding: '8px 14px', background: '#1e2a35', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Konfirmasi Beli
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Checkout Berhasil!</h3>
                <p style={{ fontSize: '15px' }}>
                  Terima kasih <strong>{buyerName}</strong>, transaksi pembelian <strong>{selectedGun.name}</strong> seharga <strong>${selectedGun.price.toLocaleString()}</strong> berhasil diproses.
                </p>
                <button 
                  onClick={handleClose}
                  style={{ marginTop: '12px', padding: '8px 18px', background: '#1e2a35', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Catalog