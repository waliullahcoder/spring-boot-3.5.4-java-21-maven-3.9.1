package com.example.core.service.impl;

import com.example.core.service.VendorService;
import com.example.persistence.entity.Vendor;
import com.example.persistence.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;

    @Override
    public Vendor save(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    @Override
    public List<Vendor> findAll() {
        return vendorRepository.findAll();
    }

    @Override
    public Optional<Vendor> findByEmail(String email) {
        return vendorRepository.findByEmail(email);
    }


    @Override
    public Optional<Vendor> findById(Long id) {
        return vendorRepository.findById(id);
    }

    @Override
    public Vendor updateVendorById(Long id, Vendor vendorUpdateData) {
        return vendorRepository.findById(id).map(existing -> {
            existing.setFirstName(vendorUpdateData.getFirstName());
            existing.setLastName(vendorUpdateData.getLastName());
            existing.setAddress(vendorUpdateData.getAddress());
            existing.setPhoneNumber(vendorUpdateData.getPhoneNumber());
            existing.setEmail(vendorUpdateData.getEmail());
            existing.setZipCode(vendorUpdateData.getZipCode());
            return vendorRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Vendor not found with id " + id));
    }


    @Override
    public void deleteById(Long id) {
        vendorRepository.deleteById(id);
    }

}
