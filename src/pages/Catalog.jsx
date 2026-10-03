import { useState, useMemo } from 'react'
import GUNS from '../data/guns.js'
import GunCard from '../components/GunCard.jsx'
import '../components/cart-anim.css'

function Catalog() {
  // State keranjang & checkout
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutModal, setIsCheckoutModal] = useState(false)
  const [buyerName, setBuyerName] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // State pencarian, filter jenis, dan sort
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [sortField, setSortField] = useState('name') // 'name' | 'price'
  const [sortDirection, setSortDirection] = useState('asc') // 'asc' | 'desc'

  // Butir 4: tambah item (kuantitas bertambah jika sudah ada)
  const addToCart = (gun) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === gun.name)
      if (existing) {
        return prev.map((item) =>
          item.name === gun.name ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...gun, quantity: 1 }]
    })
  }

  const increaseQuantity = (name) => {
    setCart((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decreaseQuantity = (name) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.name === name ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (name) => {
    setCart((prev) => prev.filter((item) => item.name !== name))
  }

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Butir 3: toggle sort (klik lagi = balik arah)
  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Daftar kategori dibuat otomatis dari data
  const categories = useMemo(() => {
    const types = new Set(GUNS.map((g) => g.type))
    return ['All', ...Array.from(types)]
  }, [])

  // Butir 2 & 3: filter + sort
  const filteredGuns = useMemo(() => {
    let result = [...GUNS]

    const q = searchQuery.trim().toLowerCase()
    if (q) {
      result = result.filter((g) => g.name.toLowerCase().includes(q))
    }

    if (selectedType !== 'All') {
      result = result.filter((g) => g.type === selectedType)
    }

    result.sort((a, b) => {
      const cmp =
        sortField === 'name' ? a.name.localeCompare(b.name) : a.price - b.price
      return sortDirection === 'asc' ? cmp : -cmp
    })

    return result
  }, [searchQuery, selectedType, sortField, sortDirection])

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    setIsSuccess(true)
  }

  const resetAll = () => {
    setCart([])
    setIsCartOpen(false)
    setIsCheckoutModal(false)
    setBuyerName('')
    setIsSuccess(false)
  }

  const sortBtnStyle = (active) => ({
    flex: 1,
    padding: '8px',
    backgroundColor: active ? '#1e2a35' : '#fff',
    color: active ? '#fff' : '#1e2a35',
    border: '1px solid #1e2a35',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  })

  return (
    <>
      <section className="masthead">
        <h1 className="display">Hardware, by the spec sheet.</h1>
        <p className="lede">
          A small armory of pistols, rifles, shotguns, and submachine guns. Every piece
          listed with its type, caliber, and price — nothing else.
        </p>
      </section>

      {/* Toolbar: pencarian, filter jenis, toggle sort */}
      <section style={{ backgroundColor: '#f0f3f5', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Search Product:</label>
            <input
              type="text"
              placeholder="Search gun name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Filter Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Toggle Sort:</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => handleSortToggle('name')} style={sortBtnStyle(sortField === 'name')}>
                Name {sortField === 'name' ? (sortDirection === 'asc' ? '↑ (A-Z)' : '↓ (Z-A)') : ''}
              </button>
              <button type="button" onClick={() => handleSortToggle('price')} style={sortBtnStyle(sortField === 'price')}>
                Price {sortField === 'price' ? (sortDirection === 'asc' ? '↑ Low' : '↓ High') : ''}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Header stok + badge keranjang */}
      <section>
        <div className="list-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Current stock <span className="count">({filteredGuns.length} pieces shown)</span></h2>

          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1e2a35',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🛒 Cart
            {/* key berubah tiap jumlah berubah, jadi animasi "bump" diputar ulang */}
            <span
              key={totalItemCount}
              className={`cart-badge${totalItemCount > 0 ? ' cart-badge-bump' : ''}`}
            >
              {totalItemCount}
            </span>
          </button>
        </div>

        {filteredGuns.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
            No products match your search or filter.
          </p>
        ) : (
          <ul className="stock">
            {filteredGuns.map((gun) => (
              <GunCard key={gun.name} gun={gun} onAddToCart={addToCart} />
            ))}
          </ul>
        )}
      </section>

      {/* Modal keranjang */}
      {isCartOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && setIsCartOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '16px',
          }}
        >
          <div style={{
            background: '#fff', padding: '24px', borderRadius: '8px',
            maxWidth: '460px', width: '100%', color: '#18222c', maxHeight: '85vh',
            display: 'flex', flexDirection: 'column',
          }}>
            <h3 style={{ marginTop: 0 }}>Shopping Cart</h3>

            {cart.length === 0 ? (
              <p style={{ color: '#666', margin: '24px 0', textAlign: 'center' }}>Keranjang masih kosong.</p>
            ) : (
              <div style={{ overflowY: 'auto', flex: 1, margin: '10px 0', maxHeight: '280px' }}>
                {cart.map((item) => (
                  <div key={item.name} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid #eee',
                  }}>
                    <div style={{ flex: 1 }}>
                      <strong>{item.name}</strong>
                      <div style={{ fontSize: '13px', color: '#666' }}>${item.price.toLocaleString()} / pcs</div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#a67c2e' }}>
                        Subtotal: ${(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '12px' }}>
                      <button
                        onClick={() => decreaseQuantity(item.name)}
                        style={{ width: '28px', height: '28px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 'bold', minWidth: '18px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.name)}
                        style={{ width: '28px', height: '28px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.name)}
                      style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop: '2px solid #ddd', paddingTop: '12px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '600' }}>
                <span>Total Items:</span>
                <span>{totalItemCount} pcs</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: 'bold', color: '#a67c2e', marginTop: '4px' }}>
                <span>Total Belanja:</span>
                <span>${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '18px' }}>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ padding: '8px 14px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Close
              </button>
              {cart.length > 0 && (
                <button
                  onClick={() => {
                    setIsCartOpen(false)
                    setIsCheckoutModal(true)
                  }}
                  style={{ padding: '8px 16px', background: '#a67c2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal checkout */}
      {isCheckoutModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1001, padding: '16px',
        }}>
          <div style={{
            background: '#fff', padding: '24px', borderRadius: '8px',
            maxWidth: '420px', width: '100%', color: '#18222c',
          }}>
            {!isSuccess ? (
              <form onSubmit={handleCheckoutSubmit}>
                <h3 style={{ marginTop: 0 }}>Form Checkout Pembelian</h3>
                <p style={{ margin: '6px 0', fontSize: '14px' }}>
                  <strong>Total Kuantitas:</strong> {totalItemCount} item
                </p>
                <p style={{ margin: '6px 0', fontSize: '14px' }}>
                  <strong>Total Pembayaran:</strong> ${totalPrice.toLocaleString()}
                </p>

                <div style={{ margin: '14px 0' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Nama Lengkap Pembeli:</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Masukkan nama Anda..."
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '18px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModal(false)}
                    style={{ padding: '8px 14px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 14px', background: '#1e2a35', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Konfirmasi Pembayaran
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Pembayaran Berhasil!</h3>
                <p style={{ fontSize: '15px' }}>
                  Terima kasih <strong>{buyerName}</strong>, pembayaran senilai <strong>${totalPrice.toLocaleString()}</strong> untuk <strong>{totalItemCount} item</strong> berhasil diverifikasi.
                </p>
                <button
                  onClick={resetAll}
                  style={{ marginTop: '12px', padding: '8px 20px', background: '#1e2a35', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
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
