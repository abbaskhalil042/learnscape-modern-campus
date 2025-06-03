
const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/cart - Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'cart.course',
        select: 'title thumbnail price originalPrice instructor rating duration level',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate cart totals
    const cartItems = user.cart.map(item => item.course).filter(course => course);
    const subtotal = cartItems.reduce((total, course) => total + course.price, 0);
    const originalTotal = cartItems.reduce((total, course) => total + course.originalPrice, 0);
    const totalSavings = originalTotal - subtotal;

    res.json({
      cart: {
        items: user.cart,
        summary: {
          itemCount: cartItems.length,
          subtotal: subtotal.toFixed(2),
          originalTotal: originalTotal.toFixed(2),
          totalSavings: totalSavings.toFixed(2),
          discountPercentage: originalTotal > 0 ? Math.round((totalSavings / originalTotal) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// POST /api/cart/add - Add course to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is already enrolled in this course
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.course.toString() === courseId
    );
    if (isEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Check if course is already in cart
    const isInCart = user.cart.some(
      item => item.course.toString() === courseId
    );
    if (isInCart) {
      return res.status(400).json({ message: 'Course is already in your cart' });
    }

    // Add course to cart
    user.cart.push({
      course: courseId,
      addedAt: new Date()
    });

    await user.save();

    // Populate the newly added course
    await user.populate({
      path: 'cart.course',
      select: 'title thumbnail price originalPrice instructor rating duration level',
      populate: {
        path: 'category',
        select: 'name slug'
      }
    });

    res.json({
      message: 'Course added to cart successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding course to cart', error: error.message });
  }
});

// DELETE /api/cart/remove/:courseId - Remove course from cart
router.delete('/remove/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove course from cart
    user.cart = user.cart.filter(
      item => item.course.toString() !== courseId
    );

    await user.save();

    res.json({
      message: 'Course removed from cart successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing course from cart', error: error.message });
  }
});

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = [];
    await user.save();

    res.json({
      message: 'Cart cleared successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
});

// POST /api/cart/checkout - Process cart checkout
router.post('/checkout', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('cart.course');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Get all courses from cart
    const coursesToEnroll = user.cart.map(item => item.course).filter(course => course);

    // Add courses to user's enrolled courses
    const enrollments = coursesToEnroll.map(course => ({
      course: course._id,
      enrolledAt: new Date(),
      progress: 0,
      completedLessons: [],
      lastAccessed: new Date()
    }));

    user.enrolledCourses.push(...enrollments);

    // Update course enrollment counts
    await Promise.all(
      coursesToEnroll.map(course =>
        Course.findByIdAndUpdate(course._id, {
          $inc: { enrolledStudents: 1 }
        })
      )
    );

    // Clear the cart
    user.cart = [];
    await user.save();

    res.json({
      message: 'Checkout completed successfully',
      enrolledCourses: enrollments.length,
      courses: coursesToEnroll.map(course => ({
        id: course._id,
        title: course.title,
        instructor: course.instructor.name
      }))
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ message: 'Error processing checkout', error: error.message });
  }
});

module.exports = router;
