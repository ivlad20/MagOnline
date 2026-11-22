package com.example.spring_boot_jdbc_app.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

/**
 * Stores product images.
 * - app.storage=gcs   (default): the Google Cloud Storage bucket
 * - app.storage=local : on disk in app.storage.local-dir, served at {app.public-url}/uploads/...
 */
@Service
public class GcsUploadService {

    private static final String BUCKET_NAME = "magonline-product-images";

    private final String mode;
    private final Path localDir;
    private final String publicUrl;
    private Storage storage; // created lazily so local runs don't need GCP credentials

    public GcsUploadService(
            @Value("${app.storage:gcs}") String mode,
            @Value("${app.storage.local-dir:uploads}") String localDir,
            @Value("${app.public-url:http://localhost:8080}") String publicUrl) {
        this.mode = mode;
        this.localDir = Path.of(localDir).toAbsolutePath();
        this.publicUrl = publicUrl.replaceAll("/+$", "");
    }

    public String upload(MultipartFile file, String filename) throws IOException {
        if ("local".equalsIgnoreCase(mode)) {
            Files.createDirectories(localDir);
            Path target = localDir.resolve(filename).normalize();
            if (!target.startsWith(localDir)) {
                throw new IOException("Invalid file name: " + filename);
            }
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return publicUrl + "/uploads/" + filename;
        }

        if (storage == null) {
            storage = StorageOptions.getDefaultInstance().getService();
        }
        BlobId blobId = BlobId.of(BUCKET_NAME, filename);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        storage.create(blobInfo, file.getBytes());
        return "https://storage.googleapis.com/" + BUCKET_NAME + "/" + filename;
    }

    public String getMode() {
        return mode;
    }

    public Path getLocalDir() {
        return localDir;
    }
}
