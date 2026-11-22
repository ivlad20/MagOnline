package com.example.spring_boot_jdbc_app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.spring_boot_jdbc_app.service.GcsUploadService;

/** In app.storage=local mode, serves uploaded images under /uploads/**. */
@Configuration
public class UploadsConfig implements WebMvcConfigurer {

    private final GcsUploadService uploadService;

    public UploadsConfig(GcsUploadService uploadService) {
        this.uploadService = uploadService;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        if ("local".equalsIgnoreCase(uploadService.getMode())) {
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations(uploadService.getLocalDir().toUri().toString());
        }
    }
}
