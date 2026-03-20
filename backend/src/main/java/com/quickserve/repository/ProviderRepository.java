package com.quickserve.repository;

import com.quickserve.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    List<Provider> findByLocationIgnoreCase(String location);

    List<Provider> findByCategory_CategoryId(Long categoryId);

    List<Provider> findByLocationIgnoreCaseAndCategory_CategoryId(String location, Long categoryId);

    List<Provider> findByLocationIgnoreCaseAndCategory_CategoryIdAndPriceLessThanEqual(
            String location,
            Long categoryId,
            Double price
    );
}