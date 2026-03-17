package com.project.coursereview;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;   // ✅ added
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody; // ✅ added

@Controller   // ✅ changed from @RestController
@CrossOrigin
public class ReviewController {

    // 🔹 GET API → return JSON
    @ResponseBody   // ✅ added
    @GetMapping("/reviews")
    public Map<String, Object> getReviews() {

        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> list = new ArrayList<>();

        try (Connection con = DBConnection.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery("SELECT * FROM reviews")) {

            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();

                row.put("course", rs.getString("course"));
                row.put("student", rs.getString("student"));
                row.put("rating", rs.getInt("rating"));
                row.put("comment", rs.getString("comment"));

                list.add(row);
            }

            response.put("reviews", list);

        } catch (Exception e) {
            System.out.println("Error fetching reviews: " + e.getMessage());
        }

        return response;
    }

    // 🔹 POST API → add review + redirect
    @PostMapping("/addReview")
    public String addReview(
            @RequestParam String course,
            @RequestParam String student,
            @RequestParam int rating,
            @RequestParam(required = false) String comment) {

        try (Connection con = DBConnection.getConnection()) {

            try (PreparedStatement check = con.prepareStatement(
                    "SELECT * FROM reviews WHERE course=? AND student=? AND comment=?")) {

                check.setString(1, course);
                check.setString(2, student);
                check.setString(3, comment);

                try (ResultSet rs = check.executeQuery()) {

                    if (!rs.next()) {
                        try (PreparedStatement ps = con.prepareStatement(
                                "INSERT INTO reviews(course,student,rating,comment) VALUES(?,?,?,?)")) {

                            ps.setString(1, course);
                            ps.setString(2, student);
                            ps.setInt(3, rating);
                            ps.setString(4, comment);

                            ps.executeUpdate();
                        }
                    }
                }
            }

        } catch (Exception e) {
            System.out.println("Error adding review: " + e.getMessage());
        }

        return "redirect:/reviews.html"; // ✅ now works
    }
}