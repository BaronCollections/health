package com.mintbit.health.model.dto.ocr;

import lombok.Data;

@Data
public class OcrUploadResponse {

    private Long assessmentId;
    private String taskId;
    private String status;
    private String nextAction;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private String uploadedAt;
}
