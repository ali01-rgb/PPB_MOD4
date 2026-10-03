import { useRef } from 'react'

function GunCard({ gun, onAddToCart }) {
  const popup = useRef(null)

  return (
    <li className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Area Kartu untuk melihat detail popup */}
      <button 
        className="card-btn" 
        type="button"
        onClick={() => popup.current.showModal()}
        style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 0, textAlign: 'left', background: 'none', border: 'none' }}
      >
        {/* Butir 1: Bingkai Seragam (Konsistensi Ukuran Kartu) */}
        <div style={{
          width: '100%',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e6ebed',
          overflow: 'hidden'
        }}>
          <img 
            src={gun.image} 
            alt={gun.name} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>

        <div style={{ padding: '14px', width: '100%', boxSizing: 'border-box' }}>
          <span className="name display" style={{ display: 'block', fontSize: '17px', fontWeight: 'bold' }}>{gun.name}</span>
          <span className="type" style={{ display: 'block', margin: '4px 0', color: '#5a6673', fontSize: '13px' }}>
            {gun.type} · {gun.caliber}
          </span>
          <span className="price" style={{ display: 'block', fontWeight: 'bold', color: '#a67c2e' }}>
            ${gun.price.toLocaleString()}
          </span>
        </div>
      </button>

      {/* Butir 4: Tombol Tambah ke Keranjang pada Setiap Kartu */}
      <div style={{ padding: '0 14px 14px 14px' }}>
        <button
          type="button"
          onClick={() => onAddToCart(gun)}
          style={{
            width: '100%',
            height: '36px',
            backgroundColor: '#1e2a35',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600'
          }}
        >
          + Add to Cart
        </button>
      </div>

      {/* Pop-up Dialog Detail Senjata */}
      <dialog
        className="popup"
        ref={popup}
        onClick={(e) => e.target === popup.current && popup.current.close()}
        style={{
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid #d9dee2',
          maxWidth: '460px',
          width: '90%'
        }}
      >
        <div style={{
          width: '100%',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e6ebed',
          borderRadius: '6px',
          marginBottom: '16px',
          overflow: 'hidden'
        }}>
          <img 
            src={gun.image} 
            alt={gun.name} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>

        <h3 className="display" style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{gun.name}</h3>
        <p className="type" style={{ margin: '0 0 12px 0', color: '#5a6673' }}>
          {gun.type} · {gun.caliber} · <span className="price" style={{ color: '#a67c2e', fontWeight: 'bold' }}>${gun.price.toLocaleString()}</span>
        </p>
        <p style={{ margin: '0 0 20px 0', lineHeight: '1.5' }}>{gun.description}</p>
        
        {/* Tombol di Pop-up */}
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
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              popup.current.close()
              onAddToCart(gun)
            }}
            style={{
              height: '40px',
              padding: '0 18px',
              backgroundColor: '#1e2a35',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            + Add to Cart
          </button>
        </div>
      </dialog>
    </li>
  )
}

export default GunCard