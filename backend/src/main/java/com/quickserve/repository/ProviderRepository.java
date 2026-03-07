package com.quickserve.repository;

import com.quickserve.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    List<Provider> findByCategoryCategoryId(Long categoryId);

    List<Provider> findByUserLocationIgnoreCase(String location);
}
