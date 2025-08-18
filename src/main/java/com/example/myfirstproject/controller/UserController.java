package com.example.myfirstproject.controller;

import com.example.myfirstproject.model.User;
import com.example.myfirstproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User newUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(newUser.getName());
            user.setEmail(newUser.getEmail());
            user.setAge(newUser.getAge());
            return userRepository.save(user);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "User deleted " + id;
    }
}


// POST   /users       -> create user
// GET    /users       -> list all
// GET    /users/{id}  -> get one
// PUT    /users/{id}  -> update
// DELETE /users/{id}  -> delete


//------Postman Collection-----//

// {
// 	"info": {
// 		"_postman_id": "45b82844-388a-40c0-8b48-57bec620df93",
// 		"name": "spring-boot",
// 		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
// 		"_exporter_id": "39426504"
// 	},
// 	"item": [
// 		{
// 			"name": "http://localhost:8080/users",
// 			"request": {
// 				"method": "POST",
// 				"header": [],
// 				"body": {
// 					"mode": "formdata",
// 					"formdata": [
// 						{
// 							"key": "name",
// 							"value": "Wali",
// 							"type": "text"
// 						},
// 						{
// 							"key": "email",
// 							"value": "wali@gmail.com",
// 							"type": "text"
// 						},
// 						{
// 							"key": "age",
// 							"value": "37",
// 							"type": "text"
// 						}
// 					]
// 				},
// 				"url": {
// 					"raw": "http://localhost:8080/users",
// 					"protocol": "http",
// 					"host": [
// 						"localhost"
// 					],
// 					"port": "8080",
// 					"path": [
// 						"users"
// 					]
// 				}
// 			},
// 			"response": []
// 		},
// 		{
// 			"name": "http://localhost:8080/users",
// 			"request": {
// 				"method": "GET",
// 				"header": [],
// 				"url": {
// 					"raw": "http://localhost:8080/users",
// 					"protocol": "http",
// 					"host": [
// 						"localhost"
// 					],
// 					"port": "8080",
// 					"path": [
// 						"users"
// 					]
// 				}
// 			},
// 			"response": []
// 		},
// 		{
// 			"name": "http://localhost:8080/users/1",
// 			"request": {
// 				"method": "GET",
// 				"header": [],
// 				"url": {
// 					"raw": "http://localhost:8080/users/1",
// 					"protocol": "http",
// 					"host": [
// 						"localhost"
// 					],
// 					"port": "8080",
// 					"path": [
// 						"users",
// 						"1"
// 					]
// 				}
// 			},
// 			"response": []
// 		},
// 		{
// 			"name": "http://localhost:8080/users/delete",
// 			"request": {
// 				"method": "GET",
// 				"header": [],
// 				"url": {
// 					"raw": "http://localhost:8080/users/1",
// 					"protocol": "http",
// 					"host": [
// 						"localhost"
// 					],
// 					"port": "8080",
// 					"path": [
// 						"users",
// 						"1"
// 					]
// 				}
// 			},
// 			"response": []
// 		},
// 		{
// 			"name": "http://localhost:8080/users/update",
// 			"request": {
// 				"method": "PUT",
// 				"header": [],
// 				"url": {
// 					"raw": "http://localhost:8080/users/1",
// 					"protocol": "http",
// 					"host": [
// 						"localhost"
// 					],
// 					"port": "8080",
// 					"path": [
// 						"users",
// 						"1"
// 					]
// 				}
// 			},
// 			"response": []
// 		}
// 	]
// }
