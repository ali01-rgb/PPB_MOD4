import { useRef } from 'react'

function GunCard({ gun, onCheckout }) {
  const popup = useRef(null)

  return (
    <li className="card">
      <button className="card-btn" onClick={() => popup.current.showModal()}>
        <img className="card-img" src={gun.image} alt="" width="120" height="90" style={{ objectFit: 'contain' }} />
        <span className="name display">{gun.name}</span>
        <span className="type">
          {gun.type} · {gun.caliber}
        </span>
        <span className="price">${gun.price.toLocaleString()}</span>
      </button>

      <dialog
        className="popup"
        ref={popup}
        onClick={(e) => e.target === popup.current && popup.current.close()}
      >
        <img className="popup-img" src={gun.image} alt="" width="240" height="180" style={{ objectFit: 'contain' }} />
        <h3 className="display">{gun.name}</h3>
        <p className="type">
          {gun.type} · {gun.caliber} · <span className="price">${gun.price.toLocaleString()}</span>
        </p>
        <p>{gun.description}</p>
        
        {/* Tombol aksi di dalam dialog */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <form method="dialog" style={{ margin: 0 }}>
            <button className="popup-close" style={{ height: '100%' }}>Close</button>
          </form>
          <button
            type="button"
            onClick={() => {
              popup.current.close()
              onCheckout(gun)
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1e2a35',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Checkout
          </button>
        </div>
      </dialog>
    </li>
  )
}

export default GunCard