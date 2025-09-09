package com.example.core.service.impl;

import org.springframework.transaction.annotation.Transactional;
import com.example.common.dto.PurchaseOrderDTO;
import com.example.common.dto.PurchaseOrderDetailDTO;
import com.example.common.dto.PurchaseOrderInfoDTO;
import com.example.common.dto.PurchaseOrderResponseDTO;
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
    public PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrderDTO dto) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PurchaseOrder not found"));

        PurchaseOrderInfoDTO info = dto.getPurchaseOrder();
        order.setVendorId(info.getVendorId());
        order.setTotalQuantity(info.getTotalQuantity());
        order.setTotalAmount(info.getTotalAmount());
        order.setDiscountPersantage(info.getDiscountPersantage());
        order.setDiscountAmount(info.getDiscountAmount());
        order.setTaxPersantage(info.getTaxPersantage());
        order.setTaxAmount(info.getTaxAmount());
        order.setNetAmount(info.getNetAmount());

        PurchaseOrder updatedOrder = purchaseOrderRepository.save(order);

        // Delete old details
        purchaseOrderDetailRepository.deleteByPurchaseOrderId(updatedOrder.getId());

        // Insert new details
        if (dto.getPurchaseOrderDetails() != null) {
            List<PurchaseOrderDetail> orderDetails = dto.getPurchaseOrderDetails().stream().map(d -> {
                PurchaseOrderDetail detail = new PurchaseOrderDetail();
                detail.setPurchaseOrder(updatedOrder); // Link to parent
                detail.setProductId(d.getProductId());
                detail.setProductName(d.getProductName());
                detail.setPurchaseOrderQuantity(d.getPurchaseOrderQuantity());
                detail.setPurchaseOrderAmount(d.getPurchaseOrderAmount());
                return detail;
            }).collect(Collectors.toList());

            purchaseOrderDetailRepository.saveAll(orderDetails);
        }

        return updatedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrder getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PurchaseOrder not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponseDTO> getAllPurchaseOrders() {
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();

        return orders.stream().map(order -> {
            PurchaseOrderResponseDTO dto = new PurchaseOrderResponseDTO();
            dto.setId(order.getId());
            dto.setVendorId(order.getVendorId());  // শুধু vendorId
            dto.setTotalQuantity(order.getTotalQuantity());
            dto.setTotalAmount(order.getTotalAmount());
            dto.setDiscountPersantage(order.getDiscountPersantage());
            dto.setDiscountAmount(order.getDiscountAmount());
            dto.setTaxPersantage(order.getTaxPersantage());
            dto.setTaxAmount(order.getTaxAmount());
            dto.setNetAmount(order.getNetAmount());
            dto.setProductPrice(order.getProductPrice());

            return dto;
        }).toList();
    }



}
