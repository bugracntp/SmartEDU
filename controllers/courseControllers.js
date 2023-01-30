const CourseModel = require('../models/Course');
const CategoryModel = require('../models/Category');


exports.getAllCourses = async (req, res) => {
    try {
        let filtred = false;
        const page = req.query.page || 1; // Başlangıç sayfamız veya ilk sayfamız.
        const CoursePerPage = 6; // Her sayfada bulunan fotoğraf sayısı
        const totalCourses = await CourseModel.find().countDocuments(); // Toplam fotoğraf sayısı

        const categorySlug = req.query.categories;
        const category = await CategoryModel.findOne({slug:categorySlug})
    
        let filter = {};
        if(categorySlug) {
          filter = {category:category._id}
        }

        const courses = await CourseModel.find(filter) // Fotoğrafları alıyoruz
            .sort('-dateCreated') // Fotoğrafları sıralıyoruz
            .skip((page - 1) * CoursePerPage) // Her sayfanın kendi fotoğrafları
            .limit(CoursePerPage); // Her sayfada olmasını istediğimi F. sayısını sınırlıyoruz.

        const categories = await CategoryModel.find();
        res.status(200).render('courses', {
            courses,
            categories,
            current: page,
            pages: Math.ceil(totalCourses / CoursePerPage),
            page_name: 'courses',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.getCourse = async (req, res) => {
    try {
        const course = await CourseModel.findOne({ slug: req.params.slug });

        res.status(200).render('course', {
            course,
            page_name: 'courses',
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.createCourse = async (req, res) => {
    const course = await CourseModel.create(req.body);
    try {
        res.status(201).json({
            status: 'success',
            course,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};
