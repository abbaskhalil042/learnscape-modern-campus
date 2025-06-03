
const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/users/wishlist - Get user's wishlist
router.get('/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'wishlist',
        select: 'title thumbnail price originalPrice instructor rating duration level category',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
});

// POST /api/users/wishlist/add - Add course to wishlist
router.post('/wishlist/add', auth, async (req, res) => {
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

    // Check if course is already in wishlist
    if (user.wishlist.includes(courseId)) {
      return res.status(400).json({ message: 'Course is already in your wishlist' });
    }

    // Add course to wishlist
    user.wishlist.push(courseId);
    await user.save();

    res.json({
      message: 'Course added to wishlist successfully',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Error adding course to wishlist', error: error.message });
  }
});

// DELETE /api/users/wishlist/remove/:courseId - Remove course from wishlist
router.delete('/wishlist/remove/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove course from wishlist
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== courseId
    );

    await user.save();

    res.json({
      message: 'Course removed from wishlist successfully',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing course from wishlist', error: error.message });
  }
});

// GET /api/users/enrolled-courses - Get user's enrolled courses
router.get('/enrolled-courses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'enrolledCourses.course',
        select: 'title thumbnail instructor duration curriculum category rating',
        populate: {
          path: 'category',
          select: 'name slug'
        }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate progress for each course
    const enrolledCourses = user.enrolledCourses.map(enrollment => {
      const course = enrollment.course;
      if (!course) return null;

      const totalLessons = course.curriculum.length;
      const completedLessons = enrollment.completedLessons.length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        ...enrollment.toObject(),
        course: {
          ...course.toObject(),
          progressPercentage,
          totalLessons,
          completedLessons: completedLessons
        }
      };
    }).filter(course => course !== null);

    res.json({ enrolledCourses });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Error fetching enrolled courses', error: error.message });
  }
});

// PUT /api/users/course-progress/:courseId - Update course progress
router.put('/course-progress/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, completed } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the enrollment
    const enrollment = user.enrolledCourses.find(
      e => e.course.toString() === courseId
    );

    if (!enrollment) {
      return res.status(404).json({ message: 'Course enrollment not found' });
    }

    // Update completed lessons
    if (completed && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    } else if (!completed) {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        id => id.toString() !== lessonId
      );
    }

    // Get course to calculate progress
    const course = await Course.findById(courseId);
    if (course) {
      const totalLessons = course.curriculum.length;
      const completedCount = enrollment.completedLessons.length;
      enrollment.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    }

    enrollment.lastAccessed = new Date();
    await user.save();

    res.json({
      message: 'Progress updated successfully',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons.length
    });
  } catch (error) {
    console.error('Error updating course progress:', error);
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
});

module.exports = router;
