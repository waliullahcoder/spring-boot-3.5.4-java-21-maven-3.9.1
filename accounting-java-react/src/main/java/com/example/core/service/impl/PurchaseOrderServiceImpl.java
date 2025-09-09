package com.example.core.service.impl;

import org.springframework.transaction.annotation.Transactional;
import com.example.common.dto.PurchaseOrderDTO;
import com.example.common.dto.PurchaseOrderDetailDTO;
import com.example.common.dto.PurchaseOrderInfoDTO;
import com.example.common.dto.PurchaseOrderResponseDTO;
import com.example.common.dto.purchases.PurchaseOrderDetailResponseDTO;
import com.example.common.dto.purchases.PurchaseOrderFullResponseDTO;
import com.example.core.repository.PurchaseOrderDetailRepository;
import com.example.core.repository.PurchaseOrderRepository;
import com.example.core.service.PurchaseOrderService;
import com.example.persistence.entity.PurchaseOrder;
import com.example.persistence.entity.PurchaseOrderDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderDetailRepository purchaseOrderDetailRepository;

    @Override
    public PurchaseOrder createPurchaseOrder(PurchaseOrderDTO dto) {
        PurchaseOrderInfoDTO info = dto.getPurchaseOrder();

        // Create main order
        PurchaseOrder order = new PurchaseOrder();
        order.setVendorId(info.getVendorId());
        order.setTotalQuantity(info.getTotalQuantity());
        order.setTotalAmount(info.getTotalAmount());
        order.setDiscountPersantage(info.getDiscountPersantage());
        order.setDiscountAmount(info.getDiscountAmount());
        order.setTaxPersantage(info.getTaxPersantage());
        order.setTaxAmount(info.getTaxAmount());
        order.setNetAmount(info.getNetAmount());

        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);

        // Create order details
        if (dto.getPurchaseOrderDetails() != null) {
            List<PurchaseOrderDetail> orderDetails = dto.getPurchaseOrderDetails().stream().map(d -> {
                PurchaseOrderDetail detail = new PurchaseOrderDetail();
                detail.setPurchaseOrder(savedOrder); // Link to parent
                detail.setProductId(d.getProductId());
                detail.setProductName(d.getProductName());
                detail.setPurchaseOrderQuantity(d.getPurchaseOrderQuantity());
                detail.setPurchaseOrderAmount(d.getPurchaseOrderAmount());
                return detail;
            }).collect(Collectors.toList());

            purchaseOrderDetailRepository.saveAll(orderDetails);
        }

        return savedOrder;
    }

    @Override
    public PurchaseOrder getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PurchaseOrder not found with id: " + id));
    }




    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderFullResponseDTO getPurchaseOrderFullById(Long id) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PurchaseOrder not found with id: " + id));

        PurchaseOrderFullResponseDTO dto = new PurchaseOrderFullResponseDTO();
        dto.setId(order.getId());
        dto.setVendorId(order.getVendorId());
        dto.setTotalQuantity(order.getTotalQuantity());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDiscountPersantage(order.getDiscountPersantage());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setTaxPersantage(order.getTaxPersantage());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setNetAmount(order.getNetAmount());
        dto.setProductPrice(order.getProductPrice());
        dto.setCreatedAt(order.getCreatedAt() != null ? order.getCreatedAt().toString() : null);
        dto.setUpdatedAt(order.getUpdatedAt() != null ? order.getUpdatedAt().toString() : null);

        if (order.getVendor() != null) {
            dto.setVendorFirstName(order.getVendor().getFirstName());
            dto.setVendorLastName(order.getVendor().getLastName());
            dto.setVendorAddress(order.getVendor().getAddress());
            dto.setVendorPhoneNo(order.getVendor().getPhoneNumber());
            dto.setVendorEmail(order.getVendor().getEmail());
            dto.setVendorZipCode(order.getVendor().getZipCode());
        }

        List<PurchaseOrderDetailResponseDTO> details = order.getDetails().stream().map(d -> {
            PurchaseOrderDetailResponseDTO detailDTO = new PurchaseOrderDetailResponseDTO();
            detailDTO.setId(d.getId());
            detailDTO.setPurchaseOrderId(order.getId());
            detailDTO.setProductId(d.getProductId());
            detailDTO.setProductName(d.getProductName());
            detailDTO.setPurchaseOrderQuantity(d.getPurchaseOrderQuantity());
            detailDTO.setPurchaseOrderAmount(d.getPurchaseOrderAmount());
            detailDTO.setCreatedAt(d.getCreatedAt() != null ? d.getCreatedAt().toString() : null);
            detailDTO.setUpdatedAt(d.getUpdatedAt() != null ? d.getUpdatedAt().toString() : null);
            return detailDTO;
        }).toList();


        dto.setPurchaseOrderDetails(details);

        return dto;
    }


    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponseDTO> getAllPurchaseOrders() {
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll(); // You can add Sort if needed

        return orders.stream().map(order -> {
            PurchaseOrderResponseDTO dto = new PurchaseOrderResponseDTO();
            dto.setId(order.getId());
            dto.setVendorId(order.getVendorId());
            dto.setTotalQuantity(order.getTotalQuantity());
            dto.setTotalAmount(order.getTotalAmount());
            dto.setDiscountPersantage(order.getDiscountPersantage());
            dto.setDiscountAmount(order.getDiscountAmount());
            dto.setTaxPersantage(order.getTaxPersantage());
            dto.setTaxAmount(order.getTaxAmount());
            dto.setNetAmount(order.getNetAmount());
            dto.setProductPrice(order.getProductPrice());

            // Convert LocalDateTime to ISO string
            dto.setCreatedAt(order.getCreatedAt() != null ? order.getCreatedAt().toString() : null);
            dto.setUpdatedAt(order.getUpdatedAt() != null ? order.getUpdatedAt().toString() : null);

            // Vendor info
            if (order.getVendor() != null) {
                dto.setVendorFirstName(order.getVendor().getFirstName());
                dto.setVendorLastName(order.getVendor().getLastName());
            }

            return dto;
        }).toList();
    }



}
