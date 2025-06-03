
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 300
  },
  instructor: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    bio: String,
    avatar: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    hours: {
      type: Number,
      required: true,
      min: 1
    },
    minutes: {
      type: Number,
      default: 0,
      min: 0,
      max: 59
    }
  },
  thumbnail: {
    type: String,
    required: true
  },
  previewVideo: String,
  curriculum: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    duration: {
      type: Number, // Duration in minutes
      required: true
    },
    videoUrl: String,
    resources: [{
      name: String,
      url: String,
      type: {
        type: String,
        enum: ['pdf', 'video', 'audio', 'zip', 'other']
      }
    }]
  }],
  requirements: [String],
  whatYouWillLearn: [String],
  tags: [String],
  language: {
    type: String,
    default: 'English'
  },
  subtitles: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ enrolledStudents: -1 });
courseSchema.index({ createdAt: -1 });

// Virtual for formatted duration
courseSchema.virtual('formattedDuration').get(function() {
  const totalMinutes = (this.duration.hours * 60) + this.duration.minutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
});

// Virtual for discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
