
const express = require('express');
const Course = require('../models/Course');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/courses - Get all courses with filtering and search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      level,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
      rating
    } = req.query;

    // Build filter object
    const filter = { isPublished: true };
    
    if (category && category !== 'all') {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }
    
    if (level) {
      filter.level = level;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (rating) {
      filter['rating.average'] = { $gte: parseFloat(rating) };
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const courses = await Course.find(filter)
      .populate('category', 'name slug icon color')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-curriculum.videoUrl'); // Exclude video URLs for security

    const total = await Course.countDocuments(filter);

    res.json({
      courses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// GET /api/courses/featured - Get featured courses
router.get('/featured', async (req, res) => {
  try {
    const courses = await Course.find({ 
      isPublished: true, 
      isFeatured: true 
    })
    .populate('category', 'name slug icon color')
    .sort({ 'rating.average': -1, enrolledStudents: -1 })
    .limit(6)
    .select('-curriculum.videoUrl');

    res.json({ courses });
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    res.status(500).json({ message: 'Error fetching featured courses', error: error.message });
  }
});

// GET /api/courses/:id - Get single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('category', 'name slug icon color');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Don't include video URLs unless user is enrolled
    const courseData = course.toObject();
    if (!req.user || !req.user.enrolledCourses.includes(course._id)) {
      courseData.curriculum.forEach(lesson => {
        delete lesson.videoUrl;
      });
    }

    res.json({ course: courseData });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
});

// POST /api/courses - Create new course (instructor/admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Instructor role required.' });
    }

    const courseData = {
      ...req.body,
      instructor: {
        name: req.user.fullName,
        email: req.user.email,
        bio: req.user.bio || '',
        avatar: req.user.avatar || ''
      }
    };

    const course = new Course(courseData);
    await course.save();
    
    await course.populate('category', 'name slug icon color');

    res.status(201).json({ 
      message: 'Course created successfully', 
      course 
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ message: 'Error creating course', error: error.message });
  }
});

// PUT /api/courses/:id - Update course (instructor/admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor or admin
    if (req.user.role !== 'admin' && course.instructor.email !== req.user.email) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('category', 'name slug icon color');

    res.json({ 
      message: 'Course updated successfully', 
      course: updatedCourse 
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(400).json({ message: 'Error updating course', error: error.message });
  }
});

// DELETE /api/courses/:id - Delete course (instructor/admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor or admin
    if (req.user.role !== 'admin' && course.instructor.email !== req.user.email) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

module.exports = router;
