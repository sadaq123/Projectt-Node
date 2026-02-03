const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// GET /reports/sales - Sales summary report (Open for testing)
router.get('/sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get bookings data
    const bookings = await Booking.find(dateFilter).populate('room');
    const orders = await Order.find(dateFilter).populate('items.food');

    // Calculate totals
    const bookingRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const orderRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalRevenue = bookingRevenue + orderRevenue;

    // Payment status breakdown
    const paidBookings = bookings.filter(b => b.paymentStatus === 'paid');
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
    const paidRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0) +
                        paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingRevenue = totalRevenue - paidRevenue;

    // Payment method breakdown
    const paymentMethods = {};
    [...bookings, ...orders].forEach(item => {
      if (item.paymentStatus === 'paid') {
        const method = item.paymentMethod || 'cash';
        paymentMethods[method] = (paymentMethods[method] || 0) + 
          (item.totalPrice || item.totalAmount || 0);
      }
    });

    res.json({
      summary: {
        totalRevenue,
        paidRevenue,
        pendingRevenue,
        bookingRevenue,
        orderRevenue,
        totalBookings: bookings.length,
        totalOrders: orders.length,
        paidBookings: paidBookings.length,
        paidOrders: paidOrders.length
      },
      paymentMethods,
      bookings: bookings.map(b => ({
        _id: b._id,
        customerName: b.name,
        customerEmail: b.email,
        customerPhone: b.phone,
        room: b.room?.name || 'N/A',
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        amount: b.totalPrice,
        status: b.status,
        paymentStatus: b.paymentStatus,
        paymentMethod: b.paymentMethod,
        paidAt: b.paidAt,
        createdAt: b.createdAt
      })),
      orders: orders.map(o => ({
        _id: o._id,
        roomNumber: o.roomNumber,
        items: o.items.length,
        amount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        paidAt: o.paidAt,
        createdAt: o.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /reports/export - Export sales data as CSV (Open for testing)
router.get('/export', async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let csvData = '';

    if (type === 'bookings' || !type) {
      const bookings = await Booking.find(dateFilter).populate('room');
      csvData += 'Type,ID,Customer Name,Email,Phone,Room,Check-in,Check-out,Amount,Status,Payment Status,Payment Method,Paid At,Created At\n';
      bookings.forEach(b => {
        csvData += `Booking,${b._id},${b.name},${b.email},${b.phone},${b.room?.name || 'N/A'},${b.checkIn},${b.checkOut},${b.totalPrice},${b.status},${b.paymentStatus},${b.paymentMethod || 'N/A'},${b.paidAt || 'N/A'},${b.createdAt}\n`;
      });
    }

    if (type === 'orders' || !type) {
      const orders = await Order.find(dateFilter).populate('items.food');
      if (!type) csvData += '\n';
      csvData += 'Type,ID,Room Number,Items Count,Amount,Status,Payment Status,Payment Method,Paid At,Created At\n';
      orders.forEach(o => {
        csvData += `Order,${o._id},${o.roomNumber},${o.items.length},${o.totalAmount},${o.status},${o.paymentStatus},${o.paymentMethod || 'N/A'},${o.paidAt || 'N/A'},${o.createdAt}\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=sales-report-${Date.now()}.csv`);
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /reports/dashboard - Quick dashboard stats (Open for testing)
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's stats
    const todayBookings = await Booking.find({ createdAt: { $gte: today } });
    const todayOrders = await Order.find({ createdAt: { $gte: today } });
    const todayRevenue = todayBookings.reduce((sum, b) => sum + b.totalPrice, 0) +
                         todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // This month's stats
    const monthBookings = await Booking.find({ createdAt: { $gte: thisMonth } });
    const monthOrders = await Order.find({ createdAt: { $gte: thisMonth } });
    const monthRevenue = monthBookings.reduce((sum, b) => sum + b.totalPrice, 0) +
                         monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Pending payments
    const pendingBookings = await Booking.find({ paymentStatus: 'pending' });
    const pendingOrders = await Order.find({ paymentStatus: 'pending' });
    const pendingAmount = pendingBookings.reduce((sum, b) => sum + b.totalPrice, 0) +
                          pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      today: {
        bookings: todayBookings.length,
        orders: todayOrders.length,
        revenue: todayRevenue
      },
      thisMonth: {
        bookings: monthBookings.length,
        orders: monthOrders.length,
        revenue: monthRevenue
      },
      pending: {
        bookings: pendingBookings.length,
        orders: pendingOrders.length,
        amount: pendingAmount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
