package com.quickserve.service;

import com.quickserve.entity.ServiceItem;
import com.quickserve.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServiceItemService {

    @Autowired
    private ServiceItemRepository serviceItemRepository;

    public List<ServiceItem> getByCategory(Long categoryId) {
        return serviceItemRepository.findByCategory_CategoryId(categoryId);
    }

    public ServiceItem add(ServiceItem item) {
        return serviceItemRepository.save(item);
    }
}
