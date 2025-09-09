package com.example.core.repository;

import com.example.persistence.entity.PurchaseOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface PurchaseOrderDetailRepository extends JpaRepository<PurchaseOrderDetail, Long> {

}
