package com.example.core.service.impl;

import com.example.core.service.CustomerService;
import com.example.persistence.entity.Customer;
import com.example.persistence.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public Customer save(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    @Override
    public Optional<Customer> findByEmail(String email) {
        return customerRepository.findByEmail(email);
    }


    @Override
    public Optional<Customer> findById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Customer updateCustomerById(Long id, Customer customerUpdateData) {
        return customerRepository.findById(id).map(existing -> {
            existing.setFirstName(customerUpdateData.getFirstName());
            existing.setLastName(customerUpdateData.getLastName());
            existing.setAddress(customerUpdateData.getAddress());
            existing.setPhoneNumber(customerUpdateData.getPhoneNumber());
            existing.setEmail(customerUpdateData.getEmail());
            existing.setZipCode(customerUpdateData.getZipCode());
            return customerRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Customer not found with id " + id));
    }


    @Override
    public void deleteById(Long id) {
        customerRepository.deleteById(id);
    }

}
