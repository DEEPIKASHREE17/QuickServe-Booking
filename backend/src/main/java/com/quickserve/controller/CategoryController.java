package com.quickserve.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quickserve.entity.Category;
import com.quickserve.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/category")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addCategory(@RequestBody String rawBody) {
        try {
            System.out.println("RAW BODY = " + rawBody);

            Category category = objectMapper.readValue(rawBody, Category.class);

            System.out.println("Category Name = " + category.getCategoryName());
            System.out.println("Description = " + category.getDescription());

            return ResponseEntity.ok(categoryService.addCategory(category));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllCategories() {
        try {
            return ResponseEntity.ok(categoryService.getAllCategories());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }
}