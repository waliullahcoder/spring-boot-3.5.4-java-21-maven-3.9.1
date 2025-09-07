package com.example.core.service;

import com.example.persistence.entity.Vendor;

import java.util.List;
import java.util.Optional;

public interface VendorService {
    Vendor save(Vendor vendor);
    void deleteById(Long id);
    List<Vendor> findAll();

    Optional<Vendor> findByEmail(String email);

    Optional<Vendor> findById(Long id);

    Vendor updateVendorById(Long id, Vendor vendorUpdateData);
}
