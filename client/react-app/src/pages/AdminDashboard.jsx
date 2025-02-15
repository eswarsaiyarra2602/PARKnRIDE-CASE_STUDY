import React, { useState } from 'react';
import './css/AdminDashboard.css';

const AdminDashboard = () => {
  const [section, setSection] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationCode, setLocationCode] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState({
    perHour: '',
    perMonth: '',
    perYear: ''
  });
  const [coordinates, setCoordinates] = useState({ longitude: '', latitude: '' });
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');

  // Handle Submit for Adding Location
  const handleSubmit = (e) => {
    e.preventDefault();

    const parkingLocationData = {
      locationName,
      locationCode,
      address,
      price,
      parkingLocation: {
        type: 'Point',
        coordinates: [Number(coordinates.longitude), Number(coordinates.latitude)]
      }
    };

    console.log('Parking Location Data:', parkingLocationData);
    alert('Parking Location Added Successfully');
  };

  // Fetch Slots by Location Code
  const fetchSlots = () => {
    console.log('Fetching slots for location code:', locationCode);
    setSlots([
      {
        slotNumber: 1,
        bookedSlots: [
          {
            user: 'John Doe',
            startTime: new Date(),
            endTime: new Date()
          }
        ]
      }
    ]);
    setError('');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Welcome, Admin</h1>
        <button className="admin-signout-btn">Sign Out</button>
      </header>

      <div className="admin-main-content">
        <aside className="admin-sidebar">
          <h3>Manage Parking</h3>
          <ul>
            <li onClick={() => setSection('addLocation')}>Add Parking Location</li>
            <li onClick={() => setSection('modifyLocation')}>Modify Parking Location</li>
            <li onClick={() => setSection('deleteLocation')}>Delete Parking Location</li>
          </ul>
        </aside>

        <main className="admin-content">
          {/* Add Parking Location */}
          {section === 'addLocation' && (
            <form className="admin-form" onSubmit={handleSubmit}>
              <h2>Add Parking Location</h2>
              <input type="text" placeholder="Location Name" value={locationName} onChange={(e) => setLocationName(e.target.value)} required />
              <input type="text" placeholder="Location Code" value={locationCode} onChange={(e) => setLocationCode(e.target.value)} required />
              <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
              <input type="number" placeholder="Price Per Hour" value={price.perHour} onChange={(e) => setPrice({ ...price, perHour: e.target.value })} required />
              <input type="number" placeholder="Price Per Month" value={price.perMonth} onChange={(e) => setPrice({ ...price, perMonth: e.target.value })} required />
              <input type="number" placeholder="Price Per Year" value={price.perYear} onChange={(e) => setPrice({ ...price, perYear: e.target.value })} required />
              <input type="text" placeholder="Longitude" value={coordinates.longitude} onChange={(e) => setCoordinates({ ...coordinates, longitude: e.target.value })} required />
              <input type="text" placeholder="Latitude" value={coordinates.latitude} onChange={(e) => setCoordinates({ ...coordinates, latitude: e.target.value })} required />
              <button type="submit">Add Location</button>
            </form>
          )}

          {/* Modify Parking Location */}
          {section === 'modifyLocation' && (
            <div>
              <h2>Modify Parking Location</h2>
              <input
                type="text"
                placeholder="Enter Location Code"
                value={locationCode}
                onChange={(e) => setLocationCode(e.target.value)}
              />
              <button onClick={fetchSlots}>Fetch Slots</button>

              {error && <p style={{ color: 'red' }}>{error}</p>}

              <ul className="admin-slots-list">
                {slots.map((slot, index) => (
                  <li key={index} className="admin-slot-item">
                    <h4>Slot Number: {slot.slotNumber}</h4>
                    {slot.bookedSlots.length > 0 ? (
                      slot.bookedSlots.map((booking, idx) => (
                        <div key={idx} className="admin-booking-details">
                          <p>User: {booking.user || "N/A"}</p>
                          <p>Start Time: {new Date(booking.startTime).toLocaleString()}</p>
                          <p>End Time: {new Date(booking.endTime).toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p>No Bookings</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Delete Parking Location */}
          {section === 'deleteLocation' && <h2>Delete Parking Location (Coming Soon)</h2>}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;