# MongoDB Reference: Faculty-Based Query & Bulk Update

This document provides a quick reference for finding, counting,
updating, and verifying MongoDB records based on faculty involvement.

------------------------------------------------------------------------

## Collection Used

books

------------------------------------------------------------------------

## Find Records by Faculty Name

``` js
db.publications.find(
  { "facultyInvolved.name": "Prof. Venkata Ramana Badarla" }
).pretty()
```



------------------------------------------------------------------------

## Count Matching Records

``` js
db.books.find(
  { "facultyInvolved.name": "Prof. Venkata Ramana Badarla" }
).count()
```

Recommended:

``` js
db.books.countDocuments({
  "facultyInvolved.name": "Dr. Kalidas Yeturu"
})
```

------------------------------------------------------------------------

## Bulk Update: Change createdBy

``` js
db.books.updateMany(
  {
    "facultyInvolved.name": "Dr. Kalidas Yeturu"
  },
  {
    $set: {
      createdBy: "ykalidas@iittp.ac.in",
      updatedAt: new Date()
    }
  }
)
```

------------------------------------------------------------------------

## Verify the Update

``` js
db.books.find(
  { "facultyInvolved.name": "Dr. Kalidas Yeturu" },
  { name: 1, createdBy: 1 }
).pretty()
```

------------------------------------------------------------------------


Notes: - facultyInvolved is an array of objects - updateMany performs
bulk updates safely when filters are precise


db.projects.updateMany(
  {
    "facultyInvolved.name": "Prof. Venkata Ramana Badarla",
    "facultyInvolved.institute": "dr-venkata-ramana-badarla"
  },
  {
    $set: {
      "facultyInvolved.$[faculty].institute": "prof-venkata-ramana-badarla",
      updatedAt: new Date()
    }
  },
  {
    arrayFilters: [
      {
        "faculty.name": "Prof. Venkata Ramana Badarla",
        "faculty.institute": "dr-venkata-ramana-badarla"
      }
    ]
  }
)
