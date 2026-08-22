package com.example.spring_boot_jdbc_app.service;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

@Service
public class GcsUploadService {

    private static final String BUCKET_NAME = "magonline-product-images";
    private final Storage storage = StorageOptions.getDefaultInstance().getService();

    public String upload(MultipartFile file, String filename) throws IOException {
        BlobId blobId = BlobId.of(BUCKET_NAME, filename);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        storage.create(blobInfo, file.getBytes());
        return "https://storage.googleapis.com/" + BUCKET_NAME + "/" + filename;
    }
}