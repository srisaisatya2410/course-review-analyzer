
fetch("http://localhost:8080/reviews")
.then(res => res.json())
.then(data => {

    const reviews = data.reviews;

    // =========================
    // 📊 BASIC STATS
    // =========================
    let totalReviews = reviews.length;
    document.getElementById("totalReviews").innerText = totalReviews;

    let totalRating = 0;
    let coursesSet = new Set();

    reviews.forEach(r => {
        totalRating += r.rating;
        coursesSet.add(r.course);
    });

    let avg = (totalRating / totalReviews).toFixed(2);
    document.getElementById("avgRating").innerText = avg;

    document.getElementById("totalCourses").innerText = coursesSet.size;

    // =========================
    // 🏆 TOP COURSE
    // =========================
    let courseMap = {};

    reviews.forEach(r => {
        if (!courseMap[r.course]) {
            courseMap[r.course] = [];
        }
        courseMap[r.course].push(r.rating);
    });

    let bestCourse = "";
    let bestAvg = 0;

    for (let course in courseMap) {
        let ratings = courseMap[course];
        let avgRating = ratings.reduce((a,b)=>a+b,0) / ratings.length;

        if (avgRating > bestAvg) {
            bestAvg = avgRating;
            bestCourse = course;
        }
    }

    document.getElementById("topCourse").innerText =
        bestCourse + " ⭐ (" + bestAvg.toFixed(2) + ")";

    // =========================
    // 📋 TABLE
    // =========================
    let table = document.getElementById("reviewTable");

    reviews.forEach(r => {
        let row = table.insertRow();

        row.insertCell(0).innerText = r.course;
        row.insertCell(1).innerText = r.student;
        row.insertCell(2).innerText = "⭐".repeat(r.rating);
        row.insertCell(3).innerText = r.comment;
    });

    // =========================
    // 📊 CHART
    // =========================
    let labels = [];
    let values = [];

    for (let course in courseMap) {
        let ratings = courseMap[course];
        let avgRating = ratings.reduce((a,b)=>a+b,0) / ratings.length;

        labels.push(course);
        values.push(avgRating.toFixed(2));
    }

    new Chart(document.getElementById("ratingChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Average Rating",
                data: values
            }]
        }
    });

    // =========================
    // 👑 LEADERBOARD
    // =========================
    let reviewerMap = {};

    reviews.forEach(r => {
        if (!reviewerMap[r.student]) {
            reviewerMap[r.student] = 0;
        }
        reviewerMap[r.student]++;
    });

    let sorted = Object.entries(reviewerMap)
        .sort((a,b) => b[1] - a[1]);

    let list = document.getElementById("topReviewers");

    sorted.forEach(r => {
        let li = document.createElement("li");
        li.innerText = r[0] + " (" + r[1] + " reviews)";
        list.appendChild(li);
    });

});

// =========================
// 🔍 SEARCH FUNCTION
// =========================
function searchCourse() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let table = document.getElementById("reviewTable");

    for (let i = 1; i < table.rows.length; i++) {
        let course = table.rows[i].cells[0].innerText.toLowerCase();

        if (course.includes(input)) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }
    }
} 