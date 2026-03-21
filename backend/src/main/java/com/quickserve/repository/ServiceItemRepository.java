package com.quickserve.repository;

import com.quickserve.entity.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByCategory_CategoryId(Long categoryId);

    Optional<ServiceItem> findByNameAndCategory_CategoryId(String name, Long categoryId);
}
