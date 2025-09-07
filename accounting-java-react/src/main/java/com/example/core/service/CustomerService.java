package com.example.core.service;

import com.example.persistence.entity.Customer;

import java.util.List;
import java.util.Optional;

public interface CustomerService {
    Customer save(Customer customer);
    void deleteById(Long id);
    List<Customer> findAll();

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findById(Long id);

    Customer updateCustomerById(Long id, Customer customerUpdateData);
}
