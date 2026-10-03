import { useRef, useState, useEffect } from 'react'
import './cart-anim.css'

// Gambar cadangan lokal jika gambar utama gagal dimuat
const FALLBACKS = {
  Pistol: '/guns/pistol.svg',
  Rifle: '/guns/rifle.svg',
  Shotgun: '/guns/shotgun.svg',
}

function handleImgError(e, gun) {
  const img = e.currentTarget
  img.onerror = null // cegah loop tak berujung
  img.src = FALLBACKS[gun.type] || '/guns/rifle.svg'
}

function GunCard({ gun, onAddToCart }) {
  const popup = useRef(null)
  const timer = useRef(null)
  const [added, setAdded] = useState(false)
  const [clicks, setClicks] = useState(0) // dipakai untuk me-restart animasi label

  // Bersihkan timer saat komponen dilepas
  useEffect(() => () => clearTimeout(timer.current), [])

  const handleAdd = () => {
    onAddToCart(gun)
    setClicks((c) => c + 1)
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1200)
  }

  return (
    <li className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Area kartu: klik untuk melihat detail */}
      <button
        className="card-btn"
        type="button"
        onClick={() => popup.current.showModal()}
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: 0,
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {/* Butir 1: bingkai gambar berukuran tetap */}
        <div
          style={{
            width: '100%',
            height: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e6ebed',
            overflow: 'hidden',
          }}
        >
          <img
            src={gun.image}
            alt={gun.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => handleImgError(e, gun)}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <div style={{ padding: '14px', width: '100%', boxSizing: 'border-box' }}>
          <span className="name display" style={{ display: 'block', fontSize: '17px', fontWeight: 'bold' }}>
            {gun.name}
          </span>
          <span className="type" style={{ display: 'block', margin: '4px 0', color: '#5a6673', fontSize: '13px' }}>
            {gun.type} · {gun.caliber}
          </span>
          <span className="price" style={{ display: 'block', fontWeight: 'bold', color: '#a67c2e' }}>
            ${gun.price.toLocaleString()}
          </span>
        </div>
      </button>

      {/* Butir 4: tombol tambah ke keranjang dengan animasi klik */}
      <div style={{ padding: '0 14px 14px 14px' }}>
        <button
          type="button"
          onClick={handleAdd}
          className={`add-btn${added ? ' is-added' : ''}`}
          aria-live="polite"
        >
          <span key={clicks} className={clicks > 0 ? 'add-btn-label' : undefined}>
            {added ? '✓ Added' : '+ Add to Cart'}
          </span>
        </button>
      </div>

      {/* Pop-up detail senjata */}
      <dialog
        className="popup"
        ref={popup}
        onClick={(e) => e.target === popup.current && popup.current.close()}
        style={{
          padding: 0, // padding dipindah ke div di dalam agar klik di luar konten benar-benar menutup dialog
          borderRadius: '8px',
          border: '1px solid #d9dee2',
          maxWidth: '460px',
          width: '90%',
        }}
      >
        <div style={{ padding: '24px' }}>
          <div
            style={{
              width: '100%',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e6ebed',
              borderRadius: '6px',
              marginBottom: '16px',
              overflow: 'hidden',
            }}
          >
            <img
              src={gun.image}
              alt={gun.name}
              referrerPolicy="no-referrer"
              onError={(e) => handleImgError(e, gun)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          <h3 className="display" style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{gun.name}</h3>
          <p className="type" style={{ margin: '0 0 12px 0', color: '#5a6673' }}>
            {gun.type} · {gun.caliber} ·{' '}
            <span className="price" style={{ color: '#a67c2e', fontWeight: 'bold' }}>
              ${gun.price.toLocaleString()}
            </span>
          </p>
          <p style={{ margin: '0 0 20px 0', lineHeight: '1.5' }}>{gun.description}</p>

          {/* Tombol di pop-up */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
            <form method="dialog" style={{ margin: 0 }}>
              <button
                type="submit"
                style={{
                  height: '40px',
                  padding: '0 18px',
                  backgroundColor: '#fff',
                  color: '#18222c',
                  border: '1px solid #5a6673',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Close
              </button>
            </form>

            <button
              type="button"
              className="add-btn add-btn--lg"
              onClick={() => {
                popup.current.close()
                handleAdd()
              }}
            >
              + Add to Cart
            </button>
          </div>
        </div>
      </dialog>
    </li>
  )
}

export default GunCard
