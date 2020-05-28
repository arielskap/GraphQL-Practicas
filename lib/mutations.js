'use strict'

const connectDb = require('./db')
const { ObjectID } = require('mongodb')
const errorHandler = require('./errorHandler')

module.exports = {
  createCourse: async (root, { input }) => {
    const defaults = {
      teacher: '',
      topic: ''
    }

    const newCourse = Object.assign(defaults, input)
    let db
    let course

    try {
      db = await connectDb()
      course = await db.collection('courses').insertOne(newCourse)
      newCourse._id = course.insertedId
    } catch (error) {
      errorHandler(error);
    }

    return newCourse
  },
  editCourse: async (root, { _id, input }) => {
    let db
    let course

    try {
      db = await connectDb()
      await db.collection('courses').updateOne(
        { _id: ObjectID(_id) },
        { $set: input }
      )
      course = await db.collection('courses').findOne(
        { _id: ObjectID(_id) }
      )
    } catch (error) {
      errorHandler(error);
    }

    return course
  },
  deleteCourse: async (root, { _id }) => {
    let db
    let isDeleted
    try {
      db = await connectDb()
      isDeleted = await db.collection('courses').deleteOne({ _id: ObjectID(_id) })
    } catch (error) {
      errorHandler(error);
    }
    return isDeleted ? `Se elimino el curso ${_id}` : 'No se encontre curso con ese id'
  },
  createPerson: async (root, { input }) => {
    let db
    let student

    try {
      db = await connectDb()
      student = await db.collection('students').insertOne(input)
      input._id = student.insertedId
    } catch (error) {
      errorHandler(error);
    }

    return input
  },
  editPerson: async (root, { _id, input }) => {
    let db
    let student

    try {
      db = await connectDb()
      await db.collection('students').updateOne(
        { _id: ObjectID(_id) },
        { $set: input }
      )
      student = await db.collection('students').findOne(
        { _id: ObjectID(_id) }
      )
    } catch (error) {
      errorHandler(error);
    }

    return student
  },
  deleteStudent: async (root, { _id }) => {
    let db
    let isDeleted
    try {
      db = await connectDb()
      isDeleted = await db.collection('students').deleteOne({ _id: ObjectID(_id) })
    } catch (error) {
      errorHandler(error);
    }
    return isDeleted ? `Se elimino el estudiante ${_id}` : 'No se encontre estudiante con ese id'
  },
  addPeople: async ( root, { courseID, personID }) => {
    let db
    let person
    let course

    try {
      db = await connectDb()
      course = await db.collection('courses').findOne(
        { _id: ObjectID(courseID) }
      )
      person = await db.collection('students').findOne(
        { _id: ObjectID(personID) }
      )

      if (!course || !person) throw new Error('La persona o el Curso no existe')

      await db.collection('courses').updateOne(
        { _id: ObjectID(courseID) },
        { $addToSet: { people: ObjectID(personID) } }
      )
    } catch (error) {
      errorHandler(error);
    }

    return course
  }
}
